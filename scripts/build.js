const env = require('dotenv').config();

const cheatEngineBinary = env.CHAMD_CHEAT_ENGINE_BINARY_DIR;
const driverName = env.CHAMD_DBK_DRIVER_NAME;
const seed = env.CHAMD.seed;

class Context {

    static build() {
        console.log(`Generating ${driverName} ...`);

    }

}

Context::build();
