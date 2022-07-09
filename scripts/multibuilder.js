// This script builds multiple randomized drivers
const Context = require('./context.js');
const generateRandomName = require('./utils.js');
const path = require('path');
const http = require('http');

const args = process.argv.slice(2);
const cnt = parseInt(args[0]) ?? 5;
const distDir = path.normalize(__dirname + '\\..\\dist\\');

async function getRandomWord() {
    return new Promise((res, rej) => {
        var options = {
            host: 'random-word-api.herokuapp.com',
            path: '/word'
        };

        callback = function(response) {
            let str = '';

            response.on('data', function (chunk) {
                str += chunk;
            });

            response.on('end', function () {
                res(str);
            });

        }

        const req = http.request(options, callback);

        req.on('error', function (e) {
            rej(e);
        });

        req.end();
    });
}

(async () => {
    await Context.purgeDir(distDir);
    for (let i = 0; i < cnt; i++) {

        let name = generateRandomName(10);
        try {
            const result = await getRandomWord();
            name = JSON.parse(result)[0]
                .replace(/[^a-z0-9_]/gi, '')
                .toLowerCase();
        } catch(e) { }

        const context = new Context(name, distDir + name + '\\');

        await context.all();
    }
})();
