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
        return res.data;
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

    createNote(text, visibility = 'home') {
        return this.post('notes/create', {
            text: text,
            visibility: visibility
        });
    }

    createReply(replyId, text, visibility = 'home') {
        return this.post('notes/create', {
            text: text,
            visibility: visibility,
            replyId: replyId
        });
    }

    addReaction(noteId, reaction) {
        return this.post('notes/reactions/create', {
            noteId: noteId,
            reaction: reaction
        });
    }

    follow(userId) {
        return this.post('following/create', {
            userId: userId
        });
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

    reply(text, visibility = 'home') {
        this.api.createReply(this.id, text, visibility);
    }

    addReaction(reaction) {
        this.api.addReaction(this.id, reaction);
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
        this.api.follow(this.id);
    }
}

module.exports = {
    Api: Api
};