var list = require('./routes.json');
var fs = require('fs');



console.log('start update routes');
for (let item of list) {
    fs.readFile('../dist/wonder-scale-website/browser/page/' + item.username + '/index.html', 'utf8', function (err, data) {
        if (data) {
            data = data.replace('<title>Wonder Scale</title>', '<title>' + item.title + ' | Wonder Scale</title>' + (item.description ? '<meta key="description" value="' + item.description + '">' : ''));
            fs.writeFileSync('../dist/wonder-scale-website/browser/page/' + item.username + '/index.html', data);
        }
    });
}
console.log('end updating routes');