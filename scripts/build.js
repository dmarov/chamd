const env = require('dotenv').config().parsed;
const rimraf = require('rimraf');
const path = require('path');
const glob = require('glob');
const fs = require('fs');
const handlebars = require('handlebars');

console.log(env);
class Context {

    // you probably don't need to change this settings
    static buildMode = 'Release';
    static buildDir = path.normalize(__dirname + '\\..\\build\\');
    static cheatEngineBinary = env.CHAMD_CHEAT_ENGINE_BINARY_DIR;
    static driverName = env.CHAMD_DBK_DRIVER_NAME;
    static seed = env.CHAMD_SEED;

    static vcCommunityPath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    static vcEnterprisePath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    static vcPath = null;

    static cmakeTplPath = path.normalize(__dirname + '\\..\\templates\\CMakeLists.txt.tpl');
    static srcDir = path.normalize(__dirname + '\\..\\src\\');
    static cmakeConfigPath = this.srcDir + 'CMakeLists.txt';

    static async build() {
        console.log(`Generating ${this.driverName} driver ...`);
        await this.purgeBuildDir();
        await this.generateInfFile();
    }

    static async purgeBuildDir() {

        console.log(`Clearing ${this.buildDir}* ...`);

        return new Promise((res, rej) => {
            rimraf(`${this.buildDir}\\*`, () => {
                res();
            });
        });
    }

    static async generateInfFile() {
        const communityVs = fs.existsSync(this.vcvarsCommunity);
        const enterpriseVs = fs.existsSync(this.vcvarsEnterprise);

        if (!communityVs) {
            this.vcPath = this.vcCommunityPath;
        }

        if (!enterpriseVs) {
            this.vcPath = this.vcEnterprisePath;
        }

        if (this.vcPath === null) {
            throw new Error('Visual studio not found');
        }

        const cmakeTemplateContent = fs.readFileSync(this.cmakeTplPath, 'utf-8');
        const DRIVER_NAME = this.driverName;

        const template = handlebars.compile(cmakeTemplateContent);
        const res = template({ DRIVER_NAME })

        fs.writeFileSync(this.cmakeConfigPath, res);

    }
}

Context.build();
