const Misskey = require('misskey-js');
const ws = require('ws');
const fetch = require('node-fetch');
const config = require('../config.json');

const stream = new Misskey.Stream(config.url, { token: config.i }, { WebSocket: ws });

const api = new Misskey.api.APIClient({
    origin: config.url,
    credential: config.i,
    fetch: fetch
});

module.exports = {
    stream,
    api
};