const WebSocket = require('ws');
const { v4 } = require('uuid');

const config = require('../config.json');

const id = {
    'homeTimeline': v4(),
    'me': v4()
};
const ws = new WebSocket(`wss://${config.url}/streaming?i=${config.i}`);


async function sendMsg(text, visibility = 'home') {
    if (!text) return;
    ws.send(JSON.stringify({
        'type': 'api',
        'body': {
            'id': id.me,
            'endpoint': 'notes/create',
            'data': {
                'text': text,
                'visibility': visibility
            }
        }
    }));
}

async function reply(replyId, text, visibility = 'home') {
    if (!text || !replyId) return;
    ws.send(JSON.stringify({
        'type': 'api',
        'body': {
            'id': id.me,
            'endpoint': 'notes/create',
            'data': {
                'text': text,
                'visibility': visibility,
                'replyId': replyId
            }
        }
    }));
}

async function addReaction(noteId, reaction) {
    ws.send(JSON.stringify({
        'type': 'api',
        'body': {
            'id': id.me,
            'endpoint': 'notes/reactions/create',
            'data': {
                'noteId': noteId,
                'reaction': reaction
            }
        }
    }));
}

ws.on('open', function open() {
    ws.send(JSON.stringify({
        'type': 'connect',
        'body': {
            'channel': 'homeTimeline',
            'id': id.homeTimeline
        }
    }));
});

ws.on('message', function incoming(json) {
    const data = JSON.parse(json);
    // console.log(data);

    // homeTimelineにノートが投稿されてBotじゃなかったとき
    if (data.type === 'channel' && data.body.id === id.homeTimeline && data.body.type === 'note' && !data.body.body.user.isBot) {
        const msg = data.body.body.text;
        const noteId = data.body.body.id;
        console.log(`メッセージを受信 > ${msg}`);
        if (msg) {
            switch (true) {
                case /卍Hello|起床|ぽき|ぽは|おはよ|はろ|こんにちは|こんばんは/i.test(msg) && !/おはようございません/i.test(msg): {
                    const hour = new Date().getHours();
                    switch (true) {
                        case 4 <= hour && hour < 11:
                            reply(noteId, 'おはようございます…むにゃむにゃ……');
                            break;
                        case 11 <= hour && hour < 18:
                            reply(noteId, 'こんにちは！(\\*^_^*)');
                            break;
                        case 18 <= hour || hour < 4:
                            reply(noteId, 'こんばんは〜(\\*^_^*)');
                            break;
                    }
                    break;
                }
                case /おやすみ|寝る|ぽや/i.test(msg): {
                    addReaction(noteId, '😴');
                    reply(noteId, 'おやすみ〜〜');
                    break;
                }
                case /まりんとじゃんけん/i.test(msg): {
                    reply(noteId, 'ごめん！まだ整備中なの！ ><');
                    break;
                }
            }
        }
    }
});