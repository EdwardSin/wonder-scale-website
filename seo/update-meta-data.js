var list = require('./routes.json');
var fs = require('fs');
var projectName = 'wonder-scale-website';


console.log('start update routes');
for (let item of list) {
    fs.readFile('./dist/' + projectName + '/browser/page/' + item.username + '/index.html', 'utf8', function (err, data) {
        if (data) {
            data = data.replace('<title>Wonder Scale</title>', '<title>' + item.title + ' | Wonder Scale</title>' + (item.description ? '<meta key="description" value="' + item.description + '">' : ''));
            fs.writeFileSync('./dist/' + projectName + '/browser/page/' + item.username + '/index.html', data);
        }
    });
}
console.log('end updating routes');

console.log('start auto fill in links');
fs.readFile('./dist/' + projectName + '/browser/url-list/index.html', 'utf8', function (err, data) {
    if (data) {
        if (data.indexOf('<body><a') == -1) {
            let prefix = data.substring(0, data.indexOf('<body>') + 6);
            let subfix = data.substring(data.indexOf('<body>') + 6);
            let suffingString = '';
            for (let item of list) {
                suffingString += '<a href="/page/' + item.username + '">' + item.title + '</a>'
            }
            data = prefix + suffingString + subfix;
            fs.writeFileSync('./dist/' + projectName + '/browser/url-list/index.html', data);
        }
    }
});
console.log('stop auto fill in links');