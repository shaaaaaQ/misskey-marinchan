class Api {
    constructor(ws, id) {
        this.ws = ws;
        this.id = id;
    }

    createNote(text, visibility = 'home') {
        if (!text) return console.log('Error --- api.createNote: 引数が正しくありません');
        this.ws.send(JSON.stringify({
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
        this.ws.send(JSON.stringify({
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
        this.ws.send(JSON.stringify({
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