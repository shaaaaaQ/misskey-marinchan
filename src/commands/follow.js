const { api } = require('../misskey');

module.exports = {
    name: 'follow',
    aliases: ['フォロー', 'フォローして'],
    async run(note) {
        api.request('following/create', {
            userId: note.user.id
        }).catch(() => { });
    }
};