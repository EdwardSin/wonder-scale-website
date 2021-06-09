import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import * as proxy from 'http-proxy-middleware';
const domino = require('domino');
var Prometheus,
    httpRequestDurationMicroseconds;

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  const server = express();
  let distFolder = join(process.cwd(), "browser");
  if (!existsSync(distFolder)){
    distFolder = join(process.cwd(), 'dist/wonder-scale-website/browser');
  }

  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);
  server.use(function (req, res, next) {
    if (!Prometheus) {
      Prometheus = require('prom-client');
    }
    if (!httpRequestDurationMicroseconds) {
      httpRequestDurationMicroseconds = new Prometheus.Counter({
        name: 'http_request_duration_ms',
        help: 'Duration of HTTP requests in ms',
        labelNames: ['method', 'route', 'code']
      })
    }
    res.on('finish', function () {
      if (req.originalUrl !== '/private/ws-metrics' &&
          req.originalUrl !== '/favicon.ico' &&
          !req.originalUrl.startsWith('/api/') &&
          req.originalUrl !== '/') {
        httpRequestDurationMicroseconds.inc({
            method: req.method,
            route: req.originalUrl,
            code: res.statusCode
        })
      }
    })
    next();
  });
  // Example Express Rest API endpoints
  if (!existsSync(join(process.cwd(), "browser"))) {
    const apiProxy = proxy('/api', { target: 'http://localhost:9005', changeOrigin: true, cookieDomainRewrite: 'http://localhost:4200' });
    server.use('/api/**', apiProxy);
  }
  
  server.get('/private/ws-metrics', async (req, res) => {
    if (!Prometheus) {
      Prometheus = require('prom-client');
    }
    res.set('Content-Type', Prometheus.register.contentType);
    res.send(await Prometheus.register.metrics());
  });

  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  server.disable('x-powered-by');

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => { 
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode') || moduleFilename.includes('node-loader.js')) {
  run();
}


// Run browser objects
let distFolder = join(process.cwd(), "browser");
if (!existsSync(distFolder)){
  distFolder = join(process.cwd(), 'dist/wonder-scale-website/browser');
}
const template = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';
const window = domino.createWindow(template);
global['window']= window;
global['document'] = window.document;
global['navigator'] = window.navigator;
global['localStorage'] = window.localStorage;
global['self'] = window;
global['IDBIndex'] = window.IDBIndex;
global['getComputedStyle'] = window.getComputedStyle;;
global['setTimeout'] = window.setTimeout;
global['console'] = window.console;
//

export * from './src/main.server';
