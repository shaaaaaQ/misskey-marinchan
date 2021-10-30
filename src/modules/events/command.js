const fs = require('fs');
const path = require('path');

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
for (const file of fs.readdirSync(path.join(__dirname, '../commands')).filter(file => file.endsWith('.js'))) {
    const obj = require(path.join(__dirname, `../commands/${file}`));
    commands.push(obj);
}

module.exports = {
    event: 'mention',
    disabled: false,
    listener: function (data) {
        if (data.user?.isBot || !data.text) return;

        const args = data.text.split(/ +/).filter(v => !new RegExp(`@${this.username}`).test(v));
        if (args.length === 0) return this.post('notes/reactions/create', {
            noteId: data.id,
            reaction: ':marin:'
        });

        let name = args.shift().toLowerCase();

        if (data.user.isCat) name = nya(name);

        const command = commands.find(obj => obj.name === name || obj.aliases && obj.aliases.includes(name));

        if (command) {
            try {
                command.run(this, data);
            } catch (e) {
                console.error(e);
            }
        }
    }
};