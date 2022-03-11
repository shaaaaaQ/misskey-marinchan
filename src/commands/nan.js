// てすと

module.exports = {
    name: 'nan',
    aliases: ['naan'],
    run(api, data) {
        api.post('notes/reactions/create', {
            noteId: data.id,
            reaction: ':nan_india:'
        });
    }
};