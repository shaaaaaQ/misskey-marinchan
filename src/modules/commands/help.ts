import { api } from '../../misskey';
import command from '../../command';

command.register(
    'help',
    undefined,
    'これ。`help {command name}`で詳細を',
    (note, args) => {
        if (args.length) {
            const cmd = command.get(args[0]);
            if (cmd) {
                api.request('notes/create', {
                    replyId: note.id,
                    text: `${cmd.name}

Alias:
${cmd.aliases.length ? cmd.aliases.join(', ') : 'ない'}

Description:
${cmd.description}`
                });
            } else {
                api.request('notes/create', {
                    replyId: note.id,
                    text: 'ないよ〜'
                });
            }
        } else {
            const commands = command.getAll();
            const maxLen = Math.max(...commands.map(c => c.name.length));
            const lines = commands.map(c => `${c.name}${' '.repeat(maxLen - c.name.length)} - ${c.description}`);
            api.request('notes/create', {
                replyId: note.id,
                text: 'help\n' + lines.join('\n')
            });
        }
    }
);