const { EventEmitter } = require('events');
const WebSocket = require('ws');
const { v4 } = require('uuid');

class Api extends EventEmitter {
    constructor(address) {
        super();
        this.address = address;
    }

    run() {
        if ('_ws' in this) return;

        var self = this;
        this._ws = new WebSocket(this.address);
        this.id = {
            'homeTimeline': v4(),
            'main': v4(),
            'me': v4()
        };

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
            if (data.body && data.body.error) return self.emit('error', data.body.error.message);
        });
    }

    send(payload) {
        this._ws.send(JSON.stringify(payload));
    }

    connectMain() {
        this.send({
            type: 'connect',
            body: {
                channel: 'main',
                id: this.id.main
            }
        });
    }

    connectHomeTimeline() {
        this.send({
            type: 'connect',
            body: {
                channel: 'homeTimeline',
                id: this.id.homeTimeline
            }
        });
    }

    createNote(text, visibility = 'home') {
        this.send({
            type: 'api',
            body: {
                id: this.id.me,
                endpoint: 'notes/create',
                data: {
                    text: text,
                    visibility: visibility
                }
            }
        });
    }

    createReply(replyId, text, visibility = 'home') {
        this.send({
            type: 'api',
            body: {
                id: this.id.me,
                endpoint: 'notes/create',
                data: {
                    text: text,
                    visibility: visibility,
                    replyId: replyId
                }
            }
        });
    }

    addReaction(noteId, reaction) {
        this.send({
            type: 'api',
            body: {
                id: this.id.me,
                endpoint: 'notes/reactions/create',
                data: {
                    noteId: noteId,
                    reaction: reaction
                }
            }
        });
    }

    follow(userId) {
        this.send({
            type: 'api',
            body: {
                id: this.id.me,
                endpoint: 'following/create',
                data: {
                    userId: userId
                }
            }
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