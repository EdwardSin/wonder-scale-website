var list = require('./routes.json');
var fs = require('fs');
var projectName = 'wonder-scale-website';


console.log('start update routes');
for (let item of list) {
    fs.readFile('./dist/' + projectName + '/browser/page/' + item.username + '/index.html', 'utf8', function (err, data) {
        if (data) {
            data = data.replace('<title>Wonder Scale</title>', `
                    <title>${item.title} | Wonder Scale</title>
                    ${item.description ? '<meta name="description" value="' + item.description + '">' : ''}
                    <meta name="og:title" value="${item.title} | Wonder Scale">
                    <meta name="og:type" value="website">
                    ${item.profileImage ? '<meta name="og:image" value="https://www.wonderscale.com/api/images/media?url=' + item.profileImage + '">': ''}
                    <meta name="og:url" value="/page/${item.username}/index.html">
                    ${item.description ? '<meta name="og:description" value="' + item.description + '">': ''}

                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:title" content="${item.title} | Wonder Scale" />
                    ${item.profileImage ? '<meta name="twitter:image" value="https://www.wonderscale.com/api/images/media?url=' + item.profileImage + '">': ''}
                    ${item.description ? '<meta name="twitter:description" value="' + item.description + '">': ''}
                    `);
            fs.writeFileSync('./dist/' + projectName + '/browser/page/' + item.username + '/index.html', data);
        }
    });
}
console.log('end updating routes');

console.log('start auto fill in links');
fs.readFile('./dist/' + projectName + '/browser/index.html', 'utf8', function (err, data) {
    if (data) {
        if (data.indexOf('<body><a') == -1) {
            let prefix = data.substring(0, data.indexOf('<body>') + 6);
            let subfix = data.substring(data.indexOf('<body>') + 6);
            let suffingString = '';
            for (let item of list) {
                suffingString += '<a hidden href="/page/' + item.username + '">' + item.title + '</a>'
            }
            data = prefix + suffingString + subfix;
            fs.writeFileSync('./dist/' + projectName + '/browser/index.html', data);
        }
    }
});
console.log('stop auto fill in links');