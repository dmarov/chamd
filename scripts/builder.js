// This script builds single driver based on config
const env = require('dotenv').config().parsed;
const Context = require('./context.js');
const generateRandomName = require('./utils.js');
const path = require('path');

const driverName = env.CHAMD_DBK_DRIVER_NAME ? env.CHAMD_DBK_DRIVER_NAME : generateRandomName();

const args = process.argv.slice(2);
const command = args[0];
const distDir = path.normalize(__dirname + '\\..\\dist\\');
const context = new Context(driverName, distDir);

(async () => {

    switch (command) {
        case 'all':
            await context.clearDistDir();
            await context.all();
            break;
        case 'purge':
            await context.purge();
            break;
        case 'compile':
            await context.generateCmakeFile();
            await context.compile();
            break;
        case 'geninf':
            await context.createInfFile();
            await context.stampInfFile();
            break;
        case 'sign':
            await context.signDriver();
            await context.createInfFile();
            break;
    }
})();
