import { api } from '../../misskey';
import command from '../../command';

command.register(
    'follow',
    ['フォロー', 'フォローして'],
    (note) => {
        api.request('following/create', {
            userId: note.user.id
        }).catch(() => { });
    }
);