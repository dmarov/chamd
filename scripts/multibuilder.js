import Context from './context.js';
import generateRandomName from './utils.js';
import path from 'path';
import http from 'http';
import { __dirname } from './paths.js';

const args = process.argv.slice(2);
const cnt = args[0] ? parseInt(args[0]) : 5;
const distDir = path.normalize(__dirname + '\\..\\dist\\');

async function getRandomWord() {
    return new Promise((res, rej) => {
        const options = {
            host: 'random-word-api.herokuapp.com',
            path: '/word'
        };

        const callback = function(response) {
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

await Context.purgeDir(distDir);
for (let i = 0; i < cnt; i++) {

    let name = generateRandomName(10);
    try {
        const result = await getRandomWord();
        name = JSON.parse(result)[0]
            .replace(/[^a-z0-9_]/gi, '')
            .toLowerCase();
    } catch(e) {
        console.log(e);
        break;
    }

    const context = new Context(name, distDir + name + '\\');

    await context.all();
}
