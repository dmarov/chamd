import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { spawn } from 'child_process';
import { __dirname } from './paths.js';

export default class Context {
    buildDir = path.normalize(__dirname + '\\..\\build\\');

    vcvarsCommunityPath = 'C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    vcvarsEnterprisePath = 'C:\\Program Files\\Microsoft Visual Studio\\2022\\Enterprise\\VC\\Auxiliary\\Build\\vcvarsall.bat';
    vcPath = null;

    cmakeTplPath = path.normalize(__dirname + '\\..\\templates\\CMakeLists.txt.tpl');
    infTplPath = path.normalize(__dirname + '\\..\\templates\\chamd.inf.tpl');
    makeCatTplPath = path.normalize(__dirname + '\\..\\templates\\makecat.cdf.tpl');
    datTplPath = path.normalize(__dirname + '\\..\\templates\\driver64.dat.tpl');
    datPath = `${this.buildDir}driver64.dat`;
    srcDir = path.normalize(__dirname + '\\..\\src\\');
    cmakeConfigPath = this.srcDir + 'CMakeLists.txt';

    constructor(driverName, distDir) {
        this.distDir = distDir;
        this.driverName = driverName
            .replace(/[^a-z0-9_]/gi, '')
            .toLowerCase();

        const communityVs = fs.existsSync(this.vcvarsCommunityPath);
        const enterpriseVs = fs.existsSync(this.vcvarsEnterprisePath);

        if (communityVs) {
            this.vcPath = this.vcvarsCommunityPath;
        }

        if (enterpriseVs) {
            this.vcPath = this.vcvarsEnterprisePath;
        }

        this.infPath = `${this.buildDir}${this.driverName}.inf`;
        this.makeCatPath = `${this.buildDir}${this.driverName}.cdf`;
    }

    async all() {
        console.log(`Generating ${this.driverName} driver ...`);
        await this.purge();
        await this.generateCmakeFile();
        await this.compile();
        await this.createMakeCatFile();
        await this.makeCatFile();
        await this.signDriver();
        await this.createDriverDatFile();
        await this.install();
        await this.clearBuildDir();
        console.log(`Success!!!`);
        console.log(`Now copy all files from ${this.distDir} to directory where cheatengine.exe is located`);
    }

    async purge() {
        await this.clearBuildDir();

        if (!fs.existsSync(this.cmakeConfigPath)) {
            return;
        }

        fs.rmSync(this.cmakeConfigPath);
    }

    static async purgeDir(dir) {

        if (!fs.existsSync(dir)) {
            return;
        }

        fs.rmSync(dir, { recursive: true })
    }

    async generateCmakeFile() {
        await this.templateToFile(
            this.cmakeTplPath,
            this.cmakeConfigPath,
            {
                DRIVER_NAME: this.driverName,
            }
        );
    }

    async templateToFile(src, dist, vars) {
        const templateContent = fs.readFileSync(src, 'utf-8');
        const template = handlebars.compile(templateContent);
        const res = template(vars)

        fs.writeFileSync(dist, res);
    }

    async compile() {
        console.log('Compiling');
        if (this.vcPath === null) {
            throw new Error('Visual studio not found');
        }

        if (!fs.existsSync(this.buildDir)) {
            fs.mkdirSync(this.buildDir);
        }

        const cmd = `"${this.vcPath}" amd64 && cd "${this.buildDir}" && cmake -G "Visual Studio 17 2022" -A x64 -T v143 "${this.srcDir}" && cmake --build . --config Release`;
        await this.execute(cmd, this.buildDir);
    }

    async createMakeCatFile() {
        console.log('Creating makecat file');
        await this.templateToFile(
            this.makeCatTplPath,
            this.makeCatPath, {
                DRIVER_NAME: this.driverName,
            },
        );
    }

    async makeCatFile() {
        console.log('Makeing cat file');
        const cmd = `"${this.vcPath}" amd64 && MakeCat.exe -v .\\${this.driverName}.cdf`
        await this.execute(cmd, this.buildDir);
    }

    async signDriver() {
        console.log('Signing driver');
        const openssl = `openssl req -nodes -newkey rsa:2048 -keyout ${this.driverName}.key -out ${this.driverName}.csr -subj "/CN=${this.driverName}.com/O=${this.driverName} LTD./C=US"`
        const crt = `openssl x509 -signkey ${this.driverName}.key -in ${this.driverName}.csr -req -days 365 -out ${this.driverName}.crt`;
        const pfx = `openssl pkcs12 -export -out ${this.driverName}.pfx -inkey ${this.driverName}.key -in ${this.driverName}.crt -password pass:`;
        const vc = `"${this.vcPath}" amd64`;
        const signtool = `signtool sign /fd SHA256 -f "./${this.driverName}.pfx" -t "http://timestamp.digicert.com" -v "${this.driverName}.cat"`;

        const cmd = `${openssl} && ${crt} && ${pfx} && ${vc} && ${signtool}`;

        await this.execute(cmd, this.buildDir);
    }

    async execute(cmd, cwd, params = []) {
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

    async createDriverDatFile() {
        console.log('Creating dat file');
        await this.templateToFile(
            this.datTplPath,
            this.datPath, {
                DRIVER_NAME: this.driverName,
            },
        );
    }

    async install() {
        console.log('Installing');

        if (!fs.existsSync(this.distDir)) {
            fs.mkdirSync(this.distDir, { recursive: true });
        }

        fs.copyFileSync(
            `${this.buildDir}${this.driverName}.sys`,
            `${this.distDir}${this.driverName}.sys`
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

    async clearBuildDir() {
        await Context.purgeDir(this.buildDir);
    }
}
