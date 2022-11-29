import dotenv from 'dotenv';
import Context from './context.js';
import generateRandomName from './utils.js';
import path from 'path';
import { __dirname } from './paths.js';

const env = dotenv.config().parsed;
const driverName = env.CHAMD_DBK_DRIVER_NAME ?? generateRandomName();
const args = process.argv.slice(2);
const command = args[0];
const distDir = path.normalize(__dirname + '\\..\\dist\\');
const context = new Context(driverName, distDir);

await Context.purgeDir(distDir);

switch (command) {
    case 'all':
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
