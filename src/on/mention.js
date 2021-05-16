module.exports = function (note) {
    note.react(':marin:');
    console.log(`メンション > ${note.user.username}`);
};