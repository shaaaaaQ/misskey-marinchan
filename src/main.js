const fs = require('fs');
const { stream } = require('./misskey');

fs.readdirSync(`${__dirname}/stream`).filter(file => file.endsWith('.js')).forEach((filename) => {
    const event = require(`${__dirname}/stream/${filename}`);
    if (event.disabled) return console.log(`Disabled: ${filename}`);

    stream.on(event.event, event.listener);
});

fs.readdirSync(`${__dirname}/channel`).filter(file => file.endsWith('.js')).forEach((filename) => {
    const event = require(`${__dirname}/channel/${filename}`);
    if (event.disabled) return console.log(`Disabled: ${filename}`);

    const channel = stream.useChannel(event.channel);
    channel.on(event.event, event.listener);
});