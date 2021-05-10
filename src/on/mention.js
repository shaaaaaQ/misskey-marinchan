module.exports = function (note) {
    note.addReaction(':marin:');
    console.log(`メンション > ${note.user.username}`);
};