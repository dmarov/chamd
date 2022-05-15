// This script builds multiple randomized drivers
const Context = require('./context.js');
const generateRandomName = require('./utils.js');
const path = require('path');

const args = process.argv.slice(2);
const cnt = parseInt(args[0]) ?? 5;
const distDir = path.normalize(__dirname + '\\..\\dist\\');

(async () => {
    for (let i = 0; i < cnt; i++) {
        const name = generateRandomName(10);
        const context = new Context(name, distDir + name + '\\');
        await context.all();
    }
})();
