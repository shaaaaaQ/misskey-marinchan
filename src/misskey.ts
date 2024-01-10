import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as Misskey from 'misskey-js';
import WebSocket from 'ws';
// import config from '../config.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));

export const stream = new Misskey.Stream(config.url, { token: config.i }, { WebSocket });
export const api = new Misskey.api.APIClient({
    origin: config.url,
    credential: config.i
});