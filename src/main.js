const { Api } = require('./misskey');
const config = require('../config.json');


const a = new Api(`wss://${config.url}/streaming?i=${config.i}`);

/*
a.on('message', function (data) {
    console.log('-------------------------');
    console.log(data);
});
*/

a.on('open', require('./on/open'));
a.on('homeTimeline', require('./on/homeTimeline'));
a.on('followed', require('./on/followed'));
a.on('mention', require('./on/mention'));
a.run();