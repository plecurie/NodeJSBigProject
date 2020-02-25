'use strict';
[
    'NODE_ENV',
    'PORT'
].forEach(function (name) {
    if (!process.env[name]) {
        throw new Error('Environment variable ' + name + 'is missing');
    }
});
var config = {
    env: process.env.NODE_ENV,
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        enabled: process.env.BOOLEAN ? process.env.BOOLEAN.toLocaleLowerCase() === 'true' : false
    },
    server: {
        port: Number(process.env.PORT)
    }
};
module.exports = config;
//# sourceMappingURL=config.js.map