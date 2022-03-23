const { api } = require('../misskey');

module.exports = {
    channel: 'main',
    event: 'followed',
    disabled: false,
    listener: function(user) {
        api.request('following/create', {
            userId: user.id
        }).catch(() => { });
    }
};