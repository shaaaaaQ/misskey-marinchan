const { User } = require('../../misskey');

module.exports = {
    name: 'unfollow',
    async run(api, data) {
        const user = data.userId && new User(api, await api.post('users/show', { userId: data.userId }));
        if (!user) return;
        if (user.isFollowing) return user.unfollow();
    }
};