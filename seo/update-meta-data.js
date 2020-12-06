var list = require('./routes.json');
var fs = require('fs');
var projectName = 'wonder-scale-website';


console.log('start update routes');
for (let item of list) {
    let url = getDomainUrl();
    fs.readFile('./dist/' + projectName + '/browser/page/' + item.username + '/index.html', 'utf8', function (err, data) {
        if (data) {
            data = data.replace('<title>Wonder Scale</title>', `
                    <title>${item.title} | Wonder Scale</title>
                    ${item.description ? '<meta name="description" content="' + item.description.slice(0, 200) + '" />' : ''}
                    <meta property="og:title" content="${item.title} | Wonder Scale" />
                    <meta property="og:type" content="website" />
                    ${item.profileImage ? '<meta property="og:image" content="' + url + '/api/images/media?url=' + item.profileImage.replace(/\//g, ',') + '" />': ''}
                    <meta property="og:url" content="${url}/page/${item.username}/index.html" />
                    ${item.description ? '<meta property="og:description" content="' + item.description.slice(0, 200) + '" />': ''}

                    <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content="${item.title} | Wonder Scale" />
                    ${item.profileImage ? '<meta name="twitter:image" content="' + url+ '/api/images/media?url=' + item.profileImage.replace(/\//g, ',') + '" />': ''}
                    ${item.description ? '<meta name="twitter:description" content="' + item.description.slice(0, 200) + '" />': ''}
                    <meta name="twitter:url" content="${url}/page/${item.username}/index.html" />
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

function getDomainUrl() {
    switch (process.argv[2]) {
        case '--dev':
            return 'http://localhost:9005';
        case '--testing':
            return 'https://testing.wonderscale.com';
        default:
            return 'https://www.wonderscale.com';
    }
}