module.exports = {
    name: 'repo',
    aliases: ['github', 'repository'],
    run(api, data) {
        api.post('notes/create', {
            replyId: data.id,
            text: 'https://github.com/shaaaaaQ/msk-marinchan'
        });
    }
};