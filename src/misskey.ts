import * as Misskey from 'misskey-js';
import WebSocket from 'ws';
import config from '../config.json';

export const stream = new Misskey.Stream(config.url, { token: config.i }, { WebSocket });
export const api = new Misskey.api.APIClient({
    origin: config.url,
    credential: config.i
});