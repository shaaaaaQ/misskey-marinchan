const { Api } = require('./misskey');
const config = require('../config.json');


const a = new Api(`wss://${config.url}/streaming?i=${config.i}`);

a.on('open', function () {
    a.connectHomeTimeline();
    a.connectMain();
});

a.on('homeTimeline', require('./on/homeTimeline'));

a.on('followed', function (data) {
    const userId = data.body.body.id;
    const username = data.body.body.username;
    a.follow(userId);

    console.log(`フォロバ > ${username}`);
});