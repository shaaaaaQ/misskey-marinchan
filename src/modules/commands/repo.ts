import { api } from '../../misskey';
import command from '../../command';

command.register(
    'repo',
    ['github', 'repository'],
    'GitHubのリンク',
    (note) => {
        api.request('notes/create', {
            replyId: note.id,
            text: 'https://github.com/shaaaaaQ/misskey-marinchan'
        });
    }
);