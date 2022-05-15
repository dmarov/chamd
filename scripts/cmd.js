const env = require('dotenv').config().parsed;
const rimraf = require('rimraf');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');
const spawn = require('child_process').spawn;

class Context {
    static buildDir = path.normalize(__dirname + '\\..\\build\\');
    static driverName = (env.CHAMD_DBK_DRIVER_NAME ? env.CHAMD_DBK_DRIVER_NAME : '')
        .replace(/[^a-z0-9_]/gi, '')
        .toLowerCase();

    static vcvarsCommunityPath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    static vcvarsEnterprisePath = 'C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Enterprise\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    static vcPath = null;

    static cmakeTplPath = path.normalize(__dirname + '\\..\\templates\\CMakeLists.txt.tpl');
    static infTplPath = path.normalize(__dirname + '\\..\\templates\\chamd.inf.tpl');
    static datTplPath = path.normalize(__dirname + '\\..\\templates\\driver64.dat.tpl');
    static datPath = `${this.buildDir}driver64.dat`;
    static srcDir = path.normalize(__dirname + '\\..\\src\\');
    static distDir = path.normalize(__dirname + '\\..\\dist\\');
    static cmakeConfigPath = this.srcDir + 'CMakeLists.txt';
    static infPath = `${this.buildDir}${this.driverName}.inf`;
    static inf2CatPath = "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x86\\inf2cat.exe"

    static generateRandomName(length) {
        let result = '';
        const characters = 'abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    }

    static async all() {
        console.log(`Generating ${this.driverName} driver ...`);
        await this.purge();
        await this.generateCmakeFile();
        await this.compile();
        await this.createInfFile();
        await this.stampInfFile();
        await this.signDriver();
        await this.createDriverDatFile();
        await this.install();
        await this.clearBuildDir();
        console.log(`Success!!!`);
        console.log(`Now copy all files from ${this.distDir} to directory where cheatengine.exe is located`);
    }

    static async purge() {
        await this.clearBuildDir();
        await this.purgeDir(this.distDir);

        if (!fs.existsSync(this.cmakeConfigPath)) {
            return;
        }

        fs.rmSync(this.cmakeConfigPath);
    }

    static async purgeDir(dir) {

        if (!fs.existsSync(dir)) {
            return;
        }

        console.log(`Clearing ${dir}* and other files ...`);

        return new Promise((res, rej) => {
            rimraf(`${dir}\\*`, () => {
                res();
            });
        });
    }

    static async generateCmakeFile() {
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
        console.log('Compiling');
        if (this.vcPath === null) {
            throw new Error('Visual studio not found');
        }

        if (!fs.existsSync(this.buildDir)) {
            fs.mkdirSync(this.buildDir);
        }

        const cmd = `"${this.vcPath}" amd64 && cd "${this.buildDir}" && cmake -G "Visual Studio 16 2019" "${this.srcDir}" && cmake --build . --config Release`;
        await this.execute(cmd, this.buildDir);
    }

    static async createInfFile() {
        console.log('Creating inf file');
        await this.templateToFile(
            this.infTplPath,
            this.infPath, {
                DRIVER_NAME: this.driverName,
            },
        );
    }

    static async stampInfFile() {
        console.log('Stamping inf file');
        const cmd = `"${this.vcPath}" amd64 && stampinf.exe -f .\\${this.driverName}.inf  -a "amd64" -k "1.15" -v "*" -d "*"`
        await this.execute(cmd, this.buildDir);
    }

    static async signDriver() {
        console.log('Signing driver');
        const vc = `"${this.vcPath}" amd64`;
        const inf2cat = `"${this.inf2CatPath}" /driver:"./" /os:10_X64 /verbose`;
        const openssl = `openssl req -nodes -newkey rsa:2048 -keyout ${this.driverName}.key -out ${this.driverName}.csr -subj "/CN=${this.driverName}.com/O=${this.driverName} LTD./C=US"`
        const crt = `openssl x509 -signkey ${this.driverName}.key -in ${this.driverName}.csr -req -days 365 -out ${this.driverName}.crt`;
        const pfx = `openssl pkcs12 -export -out ${this.driverName}.pfx -inkey ${this.driverName}.key -in ${this.driverName}.crt -password pass:`;
        const signtool = `signtool sign /fd SHA256 -f "./${this.driverName}.pfx" -t "http://timestamp.digicert.com" -v "./${this.driverName}.cat"`;

        const cmd = `${openssl} && ${crt} && ${pfx} && ${inf2cat} && ${vc} && ${signtool}`;
        // const cmd = `${genPrivKey} && ${genReq}`;
        await this.execute(cmd, this.buildDir);
    }

    static async execute(cmd, cwd, params = []) {

        console.log(`!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!`);
        console.log(`Executing: ${cmd}`);

        return new Promise((res, rej) => {
            const proc = spawn(cmd, params, {
                cwd,
                shell: true,
            });

            proc.stderr.setEncoding('utf-8');
            proc.stdout.pipe(process.stdout);
            proc.stderr.pipe(process.stderr);

            proc.on('close', (code) => {
                code == 0 ? res() : rej();
            });
        });
    }

    static async createDriverDatFile() {
        console.log('Creating dat file');
        await this.templateToFile(
            this.datTplPath,
            this.datPath, {
                DRIVER_NAME: this.driverName,
            },
        );
    }

    static async install() {
        console.log('Installing');

        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir);
        }

        fs.copyFileSync(
            `${this.buildDir}${this.driverName}.sys`,
            `${this.distDir}${this.driverName}.sys`
        );

        fs.copyFileSync(
            `${this.buildDir}${this.driverName}.inf`,
            `${this.distDir}${this.driverName}.inf`
        );

        fs.copyFileSync(
            `${this.buildDir}${this.driverName}.cat`,
            `${this.distDir}${this.driverName}.cat`
        );

        fs.copyFileSync(
            `${this.buildDir}driver64.dat`,
            `${this.distDir}driver64.dat`
        );
    }

    static async clearBuildDir() {
        await this.purgeDir(this.buildDir);
    }
}

const communityVs = fs.existsSync(Context.vcvarsCommunityPath);
const enterpriseVs = fs.existsSync(Context.vcvarsEnterprisePath);

if (communityVs) {
    Context.vcPath = Context.vcvarsCommunityPath;
}

if (enterpriseVs) {
    Context.vcPath = Context.vcvarsEnterprisePath;
}

if (!Context.driverName) {
    Context.driverName = Context.generateRandomName(10);
}

const args = process.argv.slice(2);
const command = args[0];

(async () => {
    switch (command) {
        case 'all':
            await Context.all();
            break;
        case 'purge':
            await Context.purge();
            break;
        case 'compile':
            await Context.generateCmakeFile();
            await Context.compile();
            break;
        case 'geninf':
            await Context.createInfFile();
            await Context.stampInfFile();
            break;
        case 'sign':
            await Context.signDriver();
            await Context.createInfFile();
            break;
    }
})();
