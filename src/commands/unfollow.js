const { api } = require('../misskey');

module.exports = {
    name: 'unfollow',
    async run(note) {
        api.request('following/delete', {
            userId: note.user.id
        }).catch(() => { });
    }
};