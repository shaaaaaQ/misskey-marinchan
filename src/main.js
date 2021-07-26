const fs = require('fs');
const { Api } = require('./misskey');
const config = require('../config.json');


const a = new Api(config.url, config.i);

for (const file of fs.readdirSync(`${__dirname}/modules/events`).filter(file => file.endsWith('.js'))) {
    const obj = require(`${__dirname}/modules/events/${file}`);
    obj.disabled ? console.log(`disabled: ${file}`) : a.on(obj.event, obj.listener);
}

a.run();