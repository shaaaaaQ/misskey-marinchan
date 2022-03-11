const { User } = require('../../misskey');

module.exports = {
    name: 'unfollow',
    async run(api, data) {
        const user = new User(api, await api.post('users/show', { userId: data.userId }));
        if (user.isFollowing) return user.unfollow();
    }
};