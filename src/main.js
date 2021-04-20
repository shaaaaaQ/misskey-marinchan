const { Api } = require('./misskey');
const config = require('../config.json');


const a = new Api(`wss://${config.url}/streaming?i=${config.i}`);

a.on('open', function () {
    a.connectHomeTimeline();
    a.connectMain();
});

/*
a.on('message', function (data) {
    console.log('-------------------------');
    console.log(data);
});
*/

a.on('homeTimeline', require('./on/homeTimeline'));

a.on('followed', function (user) {
    user.follow();
    console.log(`フォロバ > ${user.username}`);
});