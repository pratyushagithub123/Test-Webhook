const configRouter = require('./config');
const serverRouter = require('./server');
const partRouter = require('./part');
const serverPartsRouter = require('./serverParts');
const normalizeServerRouter = require('./normalizeServers');
const normalizePartRouter = require('./normalizeParts');
module.exports = {
    configRouter,
    serverRouter,
    partRouter,
    serverPartsRouter,
    normalizeServerRouter,
    normalizePartRouter
};