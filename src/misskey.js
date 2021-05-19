const { EventEmitter } = require('events');
const WebSocket = require('ws');
const axios = require('axios');
const { v4 } = require('uuid');

class Api extends EventEmitter {
    constructor(url, i) {
        super();
        this.url = url;
        this.i = i;
    }

    run() {
        if ('_ws' in this) return;

        this._ws = new WebSocket(`${this.url.replace('http', 'ws')}/streaming?i=${this.i}`);
        this.id = {
            homeTimeline: v4(),
            main: v4()
        };

        this._ws.on('open', () => {
            this.emit('open');
        });

        this._ws.on('message', (json) => {
            const data = JSON.parse(json);
            this.emit('message', data);
            if (!data.body) return;
            if (data.body.error) return this.emit('error', data.body.error);
            if (data.type === 'channel') {
                switch (data.body.id) {
                    case this.id.homeTimeline: return this.emit('homeTimeline', data.body.body);
                    case this.id.main: return this.emit(data.body.type, data.body.body);
                }
            }
        });
    }

    post(endpoint, params) {
        return axios.post(`${this.url}/api/${endpoint}`, {
            i: this.i,
            ...params
        })
            .then((res) => { return res.data; })
            .catch((err) => { return err.response.data; });
    }

    connect(channel) {
        this._ws.send(JSON.stringify({
            type: 'connect',
            body: {
                channel: channel,
                id: this.id[channel]
            }
        }));
    }
}

class Note {
    constructor(api, data) {
        this.api = api;
        this.data = data;

        if (data) {
            this.id = data.id;
            this.text = data.text;
            this.cw = data.cw;
            this.visibility = data.visibility;
        }
    }

    get user() {
        return this.data && this.data.user && new User(this.api, this.data.user);
    }

    get createdAt() {
        return this.data.createdAt && new Date(this.data.createdAt);
    }

    get parent() {
        return this.data && this.data.user && new Note(this.api, this.data.reply);
    }

    reply(params) {
        if (this.api) return this.api.post('notes/create', {
            replyId: this.id,
            ...params
        });
    }

    react(reaction) {
        if (this.api) return this.api.post('notes/reactions/create', {
            noteId: this.id,
            reaction: reaction
        });
    }
}

class User {
    constructor(api, data) {
        this.api = api;
        this.data = data;

        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.username = data.username;
            this.avatarUrl = data.avatarUrl;
            this.isModerator = data.isModerator;
            this.isBot = data.isBot;
            this.isCat = data.isCat;
        }
    }

    follow() {
        if (this.api) return this.api.post('following/create', {
            userId: this.id
        });
    }
}

module.exports = {
    Api: Api,
    Note: Note,
    User: User
};