const WebSocket = require('ws');
const { v4 } = require('uuid');

const config = require('../config.json');

const id = {
    'homeTimeline': v4(),
    'me': v4()
};
const ws = new WebSocket(`wss://${config.url}/streaming?i=${config.i}`);

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
    console.log(data);
    if (data.type === 'channel' && data.body.id === id.homeTimeline && data.body.type === 'note') {
        const msg = data.body.body.text;
        console.log(`メッセージを受信 > ${msg}`);
        if (msg.indexOf('まりん') != -1) {
            console.log('まりんを検知');
            ws.send(JSON.stringify({
                'type': 'api',
                'body': {
                    'id': id.me,
                    'endpoint': 'notes/reactions/create',
                    'data': {
                        'noteId': data.body.body.id,
                        'reaction': 'like'
                    }
                }
            }));
        }
    }
});