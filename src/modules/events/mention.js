const { Note } = require('../../misskey');

module.exports = {
    event: 'mention',
    disabled: true,
    listener: function (data) {
        const note = new Note(this, data);
        note.react(':marin:');
    }
};