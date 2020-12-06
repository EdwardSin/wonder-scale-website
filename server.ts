import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';
import * as proxy from 'http-proxy-middleware';
const domino = require('domino');

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

  // Example Express Rest API endpoints
  if (!existsSync(join(process.cwd(), "browser"))) {
    const apiProxy = proxy('/api', { target: 'http://localhost:9005', changeOrigin: true, cookieDomainRewrite: 'http://localhost:4200' });
    server.use('/api/**', apiProxy);
  }
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

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

let distFolder = join(process.cwd(), "browser");
if (!existsSync(distFolder)){
  distFolder = join(process.cwd(), 'dist/wonder-scale-website/browser');
}
const template = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

const window = domino.createWindow(template);
global['window']= window;
global['document'] = window.document;
global['navigator'] = window.navigator;

export * from './src/main.server';
