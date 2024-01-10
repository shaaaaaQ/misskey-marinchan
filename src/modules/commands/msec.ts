import { format } from 'date-fns';
import { api } from '../../misskey';
import command from '../../command';

command.register(
    'msec',
    ['ms'],
    (note) => {
        const t = note.reply || note;
        const date = new Date(t.createdAt);
        api.request('notes/create', {
            replyId: note.id,
            text: format(date, 'HH:mm:ss.SSS')
        });
    }
);