module.exports = function (user) {
    user.follow();
    console.log(`フォロバ > ${user.username}`);
};