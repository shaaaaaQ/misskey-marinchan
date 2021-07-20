const { User } = require('../misskey');

module.exports = {
    event: 'followed',
    listener: function (data) {
        const user = new User(this, data);
        user.follow();
    }
};