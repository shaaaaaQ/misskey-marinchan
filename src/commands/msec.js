const { format } = require('date-fns');
const { api } = require('../misskey');

module.exports = {
    name: 'msec',
    aliases: ['ms'],
    run(note) {
        const t = note.reply || note;
        const date = new Date(t.createdAt);
        api.request('notes/create', {
            replyId: note.id,
            text: format(date, 'HH:mm:ss.SSS')
        });
    }
};