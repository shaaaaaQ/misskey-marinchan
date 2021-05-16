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

        var self = this;
        this._ws = new WebSocket(`${self.url.replace('http', 'ws')}/streaming?i=${self.i}`);
        this.id = {};

        this._ws.on('open', function () {
            self.emit('open');
        });

        this._ws.on('message', function (json) {
            const data = JSON.parse(json);
            self.emit('message', data);
            if (data.body && data.body.id === self.id.homeTimeline) return self.emit('homeTimeline', new Note(data.body.body, self));
            if (data.body && data.body.id === self.id.main && data.body.type === 'followed') return self.emit('followed', new User(data.body.body, self));
            if (data.body && data.body.id === self.id.main && data.body.type === 'mention') return self.emit('mention', new Note(data.body.body, self));
            if (data.body && data.body.id === self.id.main && data.body.type === 'reply') return self.emit('reply', new Note(data.body.body, self));
            if (data.body && data.body.error) return self.emit('error', data.body.error);
        });
    }

    async post(endpoint, params) {
        let res;
        try {
            res = await axios.post(`${this.url}/api/${endpoint}`, {
                i: this.i,
                ...params
            });
        } catch (err) {
            res = err.response;
        }
        if (!res.data) return;
        const data = res.data;
        if (data.error) return data;
        switch (endpoint) {
            case 'notes/create': return new Note(data.createdNote, this);
            case 'following/create': return new User(data, this);
            default: return res.data;
        }
    }

    connect(channel) {
        this.id[channel] = v4();
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
    constructor(data, api) {
        this.api = api;
        this.id = data.id;
        this.createdAt = data.createdAt;
        this.user = new User(data.user, api);
        this.text = data.text;
        this.cw = data.cw;
        this.visibility = data.visibility;
        this.parent = data.reply && new Note(data.reply, api);
    }

    reply(text, params) {
        return this.api.post('notes/create', {
            text: text,
            replyId: this.id,
            ...params
        });
    }

    react(reaction, params) {
        return this.api.post('notes/reactions/create', {
            noteId: this.id,
            reaction: reaction,
            ...params
        });
    }
}

class User {
    constructor(data, api) {
        this.api = api;
        this.id = data.id;
        this.name = data.name;
        this.username = data.username;
        this.avatarUrl = data.avatarUrl;
        this.isModerator = data.isModerator;
        this.isBot = data.isBot;
        this.isCat = data.isCat;
    }

    follow() {
        return this.api.post('following/create', {
            userId: this.id
        });
    }
}

module.exports = {
    Api: Api
};