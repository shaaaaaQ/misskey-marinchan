import { api } from '../../misskey';
import command from '../../command';

command.register(
    'follow',
    ['フォロー', 'フォローして'],
    'まりんにフォローされる',
    (note) => {
        api.request('following/create', {
            userId: note.user.id
        }).catch(() => { });
    }
);