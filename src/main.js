const { Api } = require('./misskey');
const config = require('../config.json');


const a = new Api(config.url, config.i);

a.on('open', require('./on/open'));
a.on('homeTimeline', require('./on/homeTimeline'));
a.on('followed', require('./on/followed'));
// a.on('mention', require('./on/mention'));
// a.on('message', require('./on/message'));
a.on('error', require('./on/error'));

a.run();