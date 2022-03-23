const { api } = require('../misskey');

module.exports = {
    name: 'repo',
    aliases: ['github', 'repository'],
    run(note) {
        api.request('notes/create', {
            replyId: note.id,
            text: 'https://github.com/shaaaaaQ/msk-marinchan'
        });
    }
};