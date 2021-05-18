const { Note } = require('../misskey');

module.exports = function (data) {
    const note = new Note(this, data);
    note.react(':marin:');
    console.log(`メンション > ${note.user.username}`);
};