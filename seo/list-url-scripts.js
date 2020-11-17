const fs = require('fs');
const axios = require('axios')
const endOfLine = require('os').EOL;
const routesFile = './seo/routes.txt';
const metaDataFile = './seo/routes.json';

function retrievePageUrlList() {
    try{
        let domainUrl = getDomainUrl();
        axios.get(domainUrl + '/api/stores/list-all-stores')
        .then(function (res) {
            let urlRoutes = [];
            fs.writeFileSync(routesFile, '');
            fs.writeFileSync(metaDataFile, '');
            res.data.result.forEach(result => {
                urlRoutes.push('page/' + result.username);
            });
            urlRoutes.push('url-list');
            fs.writeFileSync(routesFile, urlRoutes.join(endOfLine), 'utf8');
            fs.writeFileSync(metaDataFile, JSON.stringify(res.data.result, null, 2), 'utf8');
        })
    }catch(err) {
        console.log(err);
    }
}


function getDomainUrl() {
    switch (process.argv[2]) {
        case '--dev':
            return 'http://localhost:9005';
        case '--testing':
            return 'http://testing.wonderscale.com';
        default:
            return 'http://www.wonderscale.com';
    }
}

retrievePageUrlList();