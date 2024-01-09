import { format } from 'date-fns';
import mfm from 'mfm-js';
import { api, stream } from '../misskey';

const i = await api.request('i');

function react(noteId: string, reaction: string) {
    api.request('notes/reactions/create', {
        noteId: noteId,
        reaction: reaction
    });
}

function reply(noteId: string, text: string) {
    api.request('notes/create', {
        replyId: noteId,
        text: text
    });
}

stream.useChannel('homeTimeline').on('note', (note) => {
    if (note.user?.isBot || !note.text) return;
    console.log(`ノートを受信 > ${note.text}`);

    // 他人へのメンションだったら無視
    if (note.mentions && !note.mentions.includes(i.id)) return;

    // URLとメンションを削除
    let nodes = mfm.parse(note.text);
    nodes = mfm.extract(nodes, (node) => {
        return node.type !== 'url' && node.type !== 'mention';
    });
    note.text = mfm.toString(nodes);

    switch (true) {
        case /ping/i.test(note.text): {
            const date = new Date(note.createdAt);
            const diffMillis = Date.now() - date.getTime();
            reply(note.id, `pong (${diffMillis}ms)`);
            break;
        }
        case /起床|ぽき|ぽは|おはよ|はろ|こんにちは|こんばんは/i.test(note.text) && !/おはようございません/i.test(note.text): {
            const hour = new Date().getHours();
            switch (true) {
                case 4 <= hour && hour < 11:
                    reply(note.id, 'おはようございます…むにゃむにゃ……');
                    break;
                case 11 <= hour && hour < 18:
                    reply(note.id, 'こんにちは！(\\*^_^*)');
                    break;
                case 18 <= hour || hour < 4:
                    reply(note.id, 'こんばんは〜(\\*^_^*)');
                    break;
            }
            break;
        }
        case /おやすみ|寝る|ぽや/i.test(note.text): {
            react(note.id, '😴');
            reply(note.id, 'おやすみ〜〜');
            break;
        }
        case note.text.startsWith('まりんとじゃんけん'): {
            const hand = note.text.split(/ +/)[1];
            switch (hand) {
                case 'グー':
                    reply(note.id, 'パー\n\n私の勝ち！なんで負けたか、明日まで考えといてください ^^');
                    break;
                case 'チョキ':
                    reply(note.id, 'グー\n\n私の勝ち！なんで負けたか、明日まで考えといてください ^^');
                    break;
                case 'パー':
                    reply(note.id, 'チョキ\n\n私の勝ち！なんで負けたか、明日まで考えといてください ^^');
                    break;
                default:
                    reply(note.id, 'ごめん！まだ整備中なの！ ><');
                    break;
            }
            break;
        }
        case /まりん/i.test(note.text) && !/しまりん|クソまりん|さぶまりん/i.test(note.text): {
            switch (true) {
                case /ハゲ/i.test(note.text): {
                    react(note.id, '💢');
                    reply(note.id, '私はハゲてなんかいません！');
                    break;
                }
                case /今何時/i.test(note.text): {
                    reply(note.id, `${new Date().getHours()}時よ！`);
                    break;
                }
                case /じゃんけんしよ/i.test(note.text): {
                    reply(note.id, 'ごめん！まだ整備中なの！ ><');
                    break;
                }
                case /結婚/i.test(note.text): {
                    react(note.id, '💞');
                    reply(note.id, 'うーん、考えておきます^^;');
                    break;
                }
                case /てくるね/i.test(note.text): {
                    reply(note.id, 'いってらっしゃい〜');
                    break;
                }
                case /すき|好き|あいし|愛し/i.test(note.text): {
                    react(note.id, '💗');
                    reply(note.id, 'あ、ありがとうございます///');
                    break;
                }
                case /してあげた|した/i.test(note.text): {
                    reply(note.id, 'ありがとう！！(極度感謝)');
                    break;
                }
                case /かわいい|可愛い/i.test(note.text): {
                    switch (true) {
                        case /宇宙一/i.test(note.text): {
                            react(note.id, '💗');
                            reply(note.id, 'そ、そんなことないですよ ///>_</// 💞💞💞💞');
                            break;
                        }
                        default: {
                            reply(note.id, 'ありがとうございます 💞💞');
                            break;
                        }
                    }
                    break;
                }
                case /やさしい|優しい/i.test(note.text): {
                    reply(note.id, 'そんなことないですよ〜(\\*^_^*)');
                    break;
                }
                case /持ち帰り/i.test(note.text) && !/りたくない/i.test(note.text): {
                    reply(note.id, '照れますね...///');
                    break;
                }
                case /歳|年齢|才/i.test(note.text): {
                    switch (true) {
                        case /ナン才|ナン歳|ナンさい/i.test(note.text): {
                            reply(note.id, 'ナン歳でしょうか？なんちゃって笑');
                            break;
                        }
                        default: {
                            reply(note.id, '私は13歳よ！');
                            break;
                        }
                    }
                    break;
                }
                case /草/i.test(note.text): {
                    reply(note.id, '笑笑');
                    break;
                }
                case /まりんちゃんと/i.test(note.text): {
                    reply(note.id, 'まりんと何がしたいって？');
                    break;
                }
                default: {
                    react(note.id, '❓');
                    reply(note.id, 'どうしたの？');
                    break;
                }
            }
            break;
        }
        case /💩/i.test(note.text): {
            react(note.id, '💩');
            break;
        }
        case /PPAP|ペンパイナッポーアッポーペン|Pen Pineapple Apple Pen/i.test(note.text): {
            react(note.id, '🆖');
            reply(note.id, 'PPAPは禁止です！');
            break;
        }
        case /卍/i.test(note.text): {
            switch (true) {
                case /卍。/i.test(note.text): {
                    reply(note.id, '卍。');
                    break;
                }
                case /卍！|卍!/i.test(note.text): {
                    reply(note.id, '卍！');
                    break;
                }
            }
            break;
        }
        case /はい。/i.test(note.text) && !/はいい|はいはい/i.test(note.text): {
            reply(note.id, 'はい。');
            break;
        }
        case /:cloudflare:/i.test(note.text): {
            react(note.id, ':soundcloud:');
            break;
        }
        case /:soundcloud:/i.test(note.text): {
            react(note.id, ':cloudflare:');
            break;
        }
        case /seppuku|切腹/i.test(note.text): {
            react(note.id, ':seppuku:');
            break;
        }
        case /RedBull|レッドブル/i.test(note.text): {
            react(note.id, ':redbull:');
            break;
        }
        case /chrome/i.test(note.text): {
            react(note.id, ':chrome:');
            break;
        }
        case /edge/i.test(note.text): {
            react(note.id, ':edge:');
            break;
        }
        case /firefox/i.test(note.text): {
            react(note.id, ':firefox:');
            break;
        }
        case /brave/i.test(note.text): {
            react(note.id, ':brave:');
            break;
        }
        case /twitter/i.test(note.text): {
            react(note.id, ':twitter:');
            break;
        }
        case /misskey/i.test(note.text): {
            react(note.id, ':misskey:');
            break;
        }
        case /microsoft/i.test(note.text): {
            react(note.id, ':microsoft:');
            break;
        }
        case /ubuntu/i.test(note.text): {
            react(note.id, ':ubuntu:');
            break;
        }
        case /safari/i.test(note.text): {
            react(note.id, ':safari:');
            break;
        }
        case /windows/i.test(note.text): {
            react(note.id, ':windows:');
            break;
        }
        case /xiaomi/i.test(note.text): {
            react(note.id, ':xiaomi:');
            break;
        }
        case /youtube/i.test(note.text): {
            react(note.id, ':youtube:');
            break;
        }
        case /vivaldi/i.test(note.text): {
            react(note.id, ':vivaldi:');
            break;
        }
        case /blender/i.test(note.text): {
            react(note.id, ':blender:');
            break;
        }
        case /334/i.test(note.text): {
            react(note.id, ':334:');
            if (note.text === '334') {
                const date = new Date(note.createdAt);
                reply(note.id, format(date, 'HH:mm:ss.SSS'));
            }
            break;
        }
        case note.text === '264': {
            const date = new Date(note.createdAt);
            reply(note.id, format(date, 'HH:mm:ss.SSS'));
            break;
        }
        case note.text === 'お' || note.text === ':o:': {
            react(note.id, ':o:');
            //if (Math.floor(Math.random() * 10) === 0) renote(note.id);
            break;
        }
        case note.text === '月': {
            reply(note.id, '何万光年も先にある星って、今はもう消滅してるかもしれないのに地球では光って見えるのロマンあるな。');
            break;
        }
        case note.text === '桜': {
            reply(note.id, '春になると咲く桜の花って、朝には満開だったのに夕方になると散ってしまうのロマンあるな。');
            break;
        }
        case note.text === 'うう': {
            react(note.id, ':rara:');
            break;
        }
        case note.text === 'ララ': {
            react(note.id, ':uu:');
            break;
        }
    }
});
