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
    static infTplPath = path.normalize(__dirname + '\\..\\templates\\chamd.inf.tpl');
    static srcDir = path.normalize(__dirname + '\\..\\src\\');
    static cmakeConfigPath = this.srcDir + 'CMakeLists.txt';
    static infPath = `${this.buildDir}${this.driverName}.inf`;
    static inf2CatPath = "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x86\\inf2cat.exe"

    static async build() {
        console.log(`Generating ${this.driverName} driver ...`);
        await this.purgeBuild();
        await this.generateInfFile();
        await this.compile();
        await this.createInfFile();
        await this.stampInfFile();
        await this.signDriver();
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
        await this.templateToFile(
            this.cmakeTplPath,
            this.cmakeConfigPath,
            {
                DRIVER_NAME: this.driverName,
            }
        );

    }

    static async templateToFile(src, dist, vars) {
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

        const cmd = `"${this.vcPath}" amd64 && cd "${this.buildDir}" && cmake -G "Visual Studio 16 2019" "${this.srcDir}" && cmake --build . --config Release`;
        await this.execute(cmd, this.buildDir);
    }

    static async createInfFile() {
        await this.templateToFile(
            this.infTplPath,
            this.infPath, {
                DRIVER_NAME: this.driverName,
            },
        );

    }

    static async stampInfFile() {
        const cmd = `"${this.vcPath}" amd64 && stampinf.exe -f .\\${this.driverName}.inf  -a "amd64" -k "1.15" -v "*" -d "*"`
        await this.execute(cmd, this.buildDir);
    }

    static async signDriver() {

        const vc = `"${this.vcPath}" amd64`;
        const inf2cat = `"${this.inf2CatPath}" /driver:"./" /os:10_X64 /verbose`;
        const makecert = `makecert -r -sv "./${this.driverName}.pvk" -n CN="whatever" "./${this.driverName}.cer"`;
        const cert2spc = `cert2spc "./${this.driverName}.cer" "./${this.driverName}.spc"`;
        const pvk2pfx = `pvk2pfx -f -pvk "./${this.driverName}.pvk" -spc "./${this.driverName}.spc" -pfx "./${this.driverName}.pfx"`;
        const signtool = `signtool sign -f "./${this.driverName}.pfx" -t "http://timestamp.digicert.com" -v "./${this.driverName}.cat"`;
        const cmd = `${vc} && ${inf2cat} && ${makecert} && ${cert2spc} && ${pvk2pfx} && ${signtool}`;

        this.execute(cmd, this.buildDir);
    }

    static async execute(cmd, cwd, params = []) {

        console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        console.log(`Executing: ${cmd}`);
        console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);

        return new Promise((res, rej) => {
            const proc = spawn(cmd, params, {
                cwd,
                shell: true,
            });

            proc.stderr.setEncoding('utf-8');
            // proc.stdout.pipe(process.stdout);
            proc.stderr.pipe(process.stderr);

            proc.on('close', (code) => {
                code == 0 ? res() : rej();
            });
        });
    }

}

Context.build();
