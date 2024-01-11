import { format, formatDistance } from 'date-fns';
import { api } from '../../misskey';
import command from '../../command';
import { version } from '../../../package.json';

const startDate = new Date();

command.register(
    'status',
    ['uptime', 'version'],
    (note) => {
        const now = new Date();
        api.request('notes/create', {
            replyId: note.id,
            text: [
                `v${version}`,
                `現在時刻: ${format(now, 'yyyy/MM/dd HH:mm:ss')}`,
                `起動時刻: ${format(startDate, 'yyyy/MM/dd HH:mm:ss')}`,
                `起動時間: ${formatDistance(startDate, now)}`
            ].join('\n')
        });
    }
);