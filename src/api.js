const { EventEmitter } = require('events');
const WebSocket = require('ws');
const { v4 } = require('uuid');

const id = {
    'homeTimeline': v4(),
    'me': v4()
};

class Api extends EventEmitter {
    constructor(p) {
        super();
        var self = this;
        this._ws = new WebSocket(p);
        this.id = id;

        this._ws.on('open', function () {
            self.emit('open');
        });

        this._ws.on('message', function (json) {
            self.emit('message', json);
        });
    }

    connectHomeTimeline() {
        this._ws.send(JSON.stringify({
            'type': 'connect',
            'body': {
                'channel': 'homeTimeline',
                'id': this.id.homeTimeline
            }
        }));
    }

    createNote(text, visibility = 'home') {
        if (!text) return console.log('Error --- api.createNote: 引数が正しくありません');
        this._ws.send(JSON.stringify({
            'type': 'api',
            'body': {
                'id': this.id.me,
                'endpoint': 'notes/create',
                'data': {
                    'text': text,
                    'visibility': visibility
                }
            }
        }));
    }

    reply(replyId, text, visibility = 'home') {
        if (!text || !replyId) return console.log('Error --- api.reply: 引数が正しくありません');
        this._ws.send(JSON.stringify({
            'type': 'api',
            'body': {
                'id': this.id.me,
                'endpoint': 'notes/create',
                'data': {
                    'text': text,
                    'visibility': visibility,
                    'replyId': replyId
                }
            }
        }));
    }

    addReaction(noteId, reaction) {
        if (!noteId || !reaction) return console.log('Error --- api.addReaction: 引数が正しくありません');
        this._ws.send(JSON.stringify({
            'type': 'api',
            'body': {
                'id': this.id.me,
                'endpoint': 'notes/reactions/create',
                'data': {
                    'noteId': noteId,
                    'reaction': reaction
                }
            }
        }));
    }
}

module.exports = Api;