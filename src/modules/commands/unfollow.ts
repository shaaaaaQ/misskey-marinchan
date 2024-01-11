import { api } from '../../misskey';
import command from '../../command';

command.register(
    'unfollow',
    undefined,
    'まりんにリムられる',
    (note) => {
        api.request('following/delete', {
            userId: note.user.id
        }).catch(() => { });
    }
);