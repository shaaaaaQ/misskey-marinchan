const fs = require('fs');
const path = require('path');

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
        const name = args.shift().toLowerCase();

        let command = commands.find(obj => obj.name === name || obj.aliases && obj.aliases.includes(name));
        // todo 猫対策
        if (command) {
            try {
                command.run(this, data);
            } catch (e) {
                console.error(e);
            }
        }
    }
};