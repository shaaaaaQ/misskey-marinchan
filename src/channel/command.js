const fs = require('fs');
const path = require('path');
const mfm = require('mfm-js');
const { api } = require('../misskey');

function nya(str) {
    for (const [k, v] of Object.entries({
        'nya': 'na',
        'Nya': 'Na',
        'nYA': 'nA',
        'NYA': 'NA',
        'にゃ': 'な',
        'ニャ': 'ナ',
        'ﾆｬ': 'ﾅ'
    })) {
        str = str.replace(new RegExp(k, 'g'), v);
    }
    return str;
}

const commands = [];
fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js')).forEach((filename) => {
    const obj = require(path.join(__dirname, `../commands/${filename}`));
    commands.push(obj);
});

module.exports = {
    channel: 'main',
    event: 'mention',
    disabled: false,
    listener: function(note) {
        if (note.user?.isBot || !note.text) return;

        // メンションを削除
        let nodes = mfm.parse(note.text);
        nodes = mfm.extract(nodes, (node) => {
            return node.type !== 'mention';
        });
        note.text = mfm.toString(nodes);

        const args = note.text.split(/ +/).filter(str => str !== '');

        if (args.length === 0) return api.request('notes/reactions/create', {
            noteId: note.id,
            reaction: ':marin'
        });

        let commandName = args.shift().toLowerCase();

        if (note.user.isCat) commandName = nya(commandName);

        const command = commands.find(obj => obj.name === commandName || obj.aliases && obj.aliases.includes(commandName));

        if (command) {
            try {
                command.run(note);
            } catch (e) {
                console.error(e);
            }
        }
    }
};