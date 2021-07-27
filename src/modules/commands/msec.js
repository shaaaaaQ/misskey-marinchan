const { format } = require('date-fns');

module.exports = {
    name: 'msec',
    aliases: ['ms'],
    run(api, data) {
        const note = data.reply || data;
        const date = new Date(note.createdAt);
        api.post('notes/create', {
            replyId: data.id,
            text: format(date, 'HH:mm:ss.SSSS')
        });
    }
};