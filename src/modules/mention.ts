import mfm from 'mfm-js';
import { stream } from '../misskey';
import command from '../command';

function unya(text: string) {
    for (const [k, v] of Object.entries({
        'nya': 'na',
        'Nya': 'Na',
        'nYA': 'nA',
        'NYA': 'NA',
        'にゃ': 'な',
        'ニャ': 'ナ',
        'ﾆｬ': 'ﾅ'
    })) {
        text = text.replace(new RegExp(k, 'g'), v);
    }
    return text;
}

stream.useChannel('main').on('mention', (note) => {
    if (note.user?.isBot || !note.text) return;

    // メンションを削除
    let nodes = mfm.parse(note.text);
    nodes = mfm.extract(nodes, (node) => {
        return node.type !== 'mention';
    });
    const text = mfm.toString(nodes);

    const args = text.split(/ +/).filter(str => str !== '');

    if (args.length === 0) return;
    // メンションだけだったときにリアクション
    // api.request('notes/reactions/create', {
    //     noteId: note.id,
    //     reaction: ':marin:'
    // });

    let commandName = args.shift()!.toLowerCase();

    if (note.user.isCat) commandName = unya(commandName);

    command.get(commandName)?.run(note, args);
});