const env = require('dotenv').config().parsed;
const rimraf = require('rimraf');
const path = require('path');
const glob = require('glob');

console.log(env);
class Context {

    // you probably don't need to change this
    static buildMode = 'Release';
    static buildDir = path.normalize(__dirname + '\\..\\build\\');
    static cheatEngineBinary = env.CHAMD_CHEAT_ENGINE_BINARY_DIR;
    static driverName = env.CHAMD_DBK_DRIVER_NAME;
    static seed = env.CHAMD_SEED;

    static async build() {
        console.log(`Generating ${this.driverName} driver ...`);
        await this.purgeBuildDir();
    }

    static async purgeBuildDir() {

        console.log(`Clearing ${this.buildDir}* ...`);

        return new Promise((res, rej) => {
            rimraf(`${this.buildDir}\\*`, () => {
                res();
            });
        });


    }
}

Context.build();
