import { api, stream } from '../misskey';

stream.useChannel('main').on('followed', (user) => {
    api.request('following/create', {
        userId: user.id
    }).catch(() => { });
});