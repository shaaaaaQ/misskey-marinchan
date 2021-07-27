const { User } = require('../../misskey');

module.exports = {
    name: 'followback',
    aliases: ['ふぉろば', 'フォロバ'],
    async run(api, data) {
        const user = data.userId && new User(api, await api.post('users/show', { userId: data.userId }));
        if (!user) return;
        if (user.isFollowed && !user.isFollowing) return user.follow();
    }
};