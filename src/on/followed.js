const { User } = require('../misskey');

module.exports = function (data) {
    const user = new User(this, data);
    user.follow();
    console.log(`フォロバ > ${user.username}`);
};