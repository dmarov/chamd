const env = require('dotenv').config().parsed;
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const spawn = require('child_process').spawn;

class Context {
    static buildDir = path.normalize(__dirname + '\\..\\build\\');
    static cheatEngineBinary = env.CHAMD_CHEAT_ENGINE_BINARY_DIR;
    static driverName = env.CHAMD_DBK_DRIVER_NAME;
    static seed = env.CHAMD_SEED;

    static vcvarsCommunityPath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    static vcvarsEnterprisePath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    static vcPath = null;

    static cmakeTplPath = path.normalize(__dirname + '\\..\\templates\\CMakeLists.txt.tpl');
    static srcDir = path.normalize(__dirname + '\\..\\src\\');
    static cmakeConfigPath = this.srcDir + 'CMakeLists.txt';

    static async build() {
        console.log(`Generating ${this.driverName} driver ...`);
        await this.purgeBuild();
        await this.generateInfFile();
        await this.compile();
    }

    static async purgeBuild() {

        console.log(`Clearing ${this.buildDir}* and other files ...`);
        fs.rmSync(this.cmakeConfigPath);

        return new Promise((res, rej) => {
            rimraf(`${this.buildDir}\\*`, () => {
                res();
            });
        });
    }

    static async generateInfFile() {
        await this.tempalteToFile(
            this.cmakeTplPath,
            this.cmakeConfigPath,
            {
                DRIVER_NAME: this.driverName,
            }
        );

    }

    static async tempalteToFile(src, dist, vars) {
        const templateContent = fs.readFileSync(src, 'utf-8');
        const template = handlebars.compile(templateContent);
        const res = template(vars)

        fs.writeFileSync(dist, res);
    }

    static async compile() {
        const communityVs = fs.existsSync(this.vcvarsCommunityPath);
        const enterpriseVs = fs.existsSync(this.vcvarsEnterprisePath);

        if (communityVs) {
            this.vcPath = this.vcvarsCommunityPath;
        }

        if (enterpriseVs) {
            this.vcPath = this.vcvarsEnterprisePath;
        }

        if (this.vcPath === null) {
            throw new Error('Visual studio not found');
        }

        return new Promise((res, rej) => {
            const cmd = `cmd.exe /c "${this.vcPath}" amd64 && cd "${this.buildDir}" && cmake -G "Visual Studio 16 2019" "${this.srcDir}" && cmake --build . --config Release`;
            console.log(`Executing: '${cmd}'`);

            const proc = spawn(cmd, [], {
                cwd: this.buildDir,
                shell: true,
            });

            proc.stderr.setEncoding('utf-8');

            proc.stderr.on('data', (data) => {
                console.log(data);
            });

            proc.on('close', (code) => {
                code == 0 ? res() : rej();
            });
        });

// call %~dp0\vs-msvc.bat %build_type% x64
// cmake --build . --config %build_type%
// call %~dp0\postbuild.bat
    }
}

Context.build();
