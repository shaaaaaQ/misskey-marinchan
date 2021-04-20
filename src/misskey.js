const { EventEmitter } = require('events');
const WebSocket = require('ws');
const { v4 } = require('uuid');

class Api extends EventEmitter {
    constructor(p) {
        super();
        var self = this;
        this._ws = new WebSocket(p);
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
            if (data.type === 'channel' && data.body.id === self.id.homeTimeline) return self.emit('homeTimeline', new Note(data, self));
            if (data.type === 'channel' && data.body.id === self.id.main && data.body.type === 'followed') return self.emit('followed', new User(data.body.body, self));
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
        if (!text) return console.log('Error --- api.createNote: 引数が正しくありません');
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

    reply(replyId, text, visibility = 'home') {
        if (!text || !replyId) return console.log('Error --- api.reply: 引数が正しくありません');
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
        if (!noteId || !reaction) return console.log('Error --- api.addReaction: 引数が正しくありません');
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
        if (!userId) return console.log('Error --- api.follow: 引数が正しくありません');
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
        this.id = data.body.body.id;
        this.createdAt = data.body.body.createdAt;
        this.user = new User(data.body.body.user, api);
        this.text = data.body.body.text;
        this.cw = data.body.body.cw;
        this.visibility = data.body.body.visibility;
    }

    reply(text, visibility = 'home') {
        this.api.reply(this.id, text, visibility);
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