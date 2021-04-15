const Api = require('./api');
const emoji = require('./emoji.json');
const config = require('../config.json');


const a = new Api(`wss://${config.url}/streaming?i=${config.i}`);

a.on('open', function () {
    a.connectHomeTimeline();
});

a.on('message', function (json) {
    const data = JSON.parse(json);
    // console.log(data);
    // console.log('onMsg');

    // homeTimelineにノートが投稿されてBotじゃなかったとき
    if (data.type === 'channel' && data.body.id === a.id.homeTimeline && data.body.type === 'note' && !data.body.body.user.isBot && data.body.body.text) {
        const msg = data.body.body.text;
        const noteId = data.body.body.id;
        switch (true) {
            case /卍Hello|起床|ぽき|ぽは|おはよ|はろ|こんにちは|こんばんは/i.test(msg) && !/おはようございません/i.test(msg): {
                const hour = new Date().getHours();
                switch (true) {
                    case 4 <= hour && hour < 11:
                        a.reply(noteId, 'おはようございます…むにゃむにゃ……');
                        break;
                    case 11 <= hour && hour < 18:
                        a.reply(noteId, 'こんにちは！(\\*^_^*)');
                        break;
                    case 18 <= hour || hour < 4:
                        a.reply(noteId, 'こんばんは〜(\\*^_^*)');
                        break;
                }
                break;
            }
            case /おやすみ|寝る|ぽや/i.test(msg): {
                a.addReaction(noteId, '😴');
                a.reply(noteId, 'おやすみ〜〜');
                break;
            }
            case /まりんとじゃんけん/i.test(msg): {
                a.reply(noteId, 'ごめん！まだ整備中なの！ ><');
                break;
            }
            case /まりん/i.test(msg) && !/‪しまりん|クソまりん|さぶまりん|まりんで|まりんが/i.test(msg): {
                switch (true) {
                    case /ハゲ/i.test(msg): {
                        a.addReaction(noteId, '💢');
                        a.reply(noteId, '私はハゲてなんかいません！');
                        break;
                    }
                    case /じゃんけんしよ/i.test(msg): {
                        a.reply(noteId, 'ごめん！まだ整備中なの！ ><');
                        break;
                    }
                    case /結婚/i.test(msg): {
                        a.addReaction(noteId, '💞');
                        a.reply(noteId, 'うーん、考えておきます^^;');
                        break;
                    }
                    case /てくるね/i.test(msg): {
                        a.reply(noteId, 'いってらっしゃい〜');
                        break;
                    }
                    case /すき|好き|あいし|愛し/i.test(msg): {
                        a.addReaction(noteId, '💗');
                        a.reply(noteId, 'あ、ありがとうございます///');
                        break;
                    }
                    case /してあげた|した/i.test(msg): {
                        a.reply(noteId, 'ありがとう！！(極度感謝)');
                        break;
                    }
                    case /かわいい|可愛い/i.test(msg): {
                        switch (true) {
                            case /宇宙一/i.test(msg): {
                                a.addReaction(noteId, '💗');
                                a.reply(noteId, 'そ、そんなことないですよ ///>_</// 💞💞💞💞');
                                break;
                            }
                            default: {
                                a.reply(noteId, 'ありがとうございます 💞💞');
                                break;
                            }
                        }
                        break;
                    }
                    case /やさしい|優しい/i.test(msg): {
                        a.reply(noteId, 'そんなことないですよ〜(\\*^_^*)');
                        break;
                    }
                    case /持ち帰り/i.test(msg) && !/りたくない/i.test(msg): {
                        a.reply(noteId, '照れますね...///');
                        break;
                    }
                    case /歳|年齢|才/i.test(msg): {
                        switch (true) {
                            case /ナン才|ナン歳|ナンさい/i.test(msg): {
                                a.reply(noteId, 'ナン歳でしょうか？なんちゃって笑');
                                break;
                            }
                            default: {
                                a.reply(noteId, '私は13歳よ！');
                                break;
                            }
                        }
                        break;
                    }
                    case /草|w|ｗ/i.test(msg): {
                        a.reply(noteId, '笑笑');
                        break;
                    }
                    case /まりんちゃんと/i.test(msg): {
                        a.reply(noteId, 'まりんと何がしたいって？');
                        break;
                    }
                    default: {
                        a.addReaction(noteId, '❓');
                        a.reply(noteId, 'どうしたの？');
                        break;
                    }
                }
                break;
            }
            case /💩/i.test(msg): {
                a.addReaction(noteId, '💩');
                break;
            }
            case /PPAP|ペンパイナッポーアッポーペン|Pen Pineapple Apple Pen/i.test(msg): {
                a.addReaction(noteId, '🆖');
                a.reply(noteId, 'PPAPは禁止です！');
                break;
            }
            case /卍/i.test(msg): {
                switch (true) {
                    case /卍。/i.test(msg): {
                        a.reply(noteId, '卍。');
                        break;
                    }
                    case /卍！|卍!/i.test(msg): {
                        a.reply(noteId, '卍！');
                        break;
                    }
                }
                break;
            }
            case /はい。/i.test(msg) && !/はいい/i.test(msg) && !/はいはい/i.test(msg): {
                a.reply(noteId, 'はい。');
                break;
            }
            default: {
                if (msg === 'お') a.addReaction(noteId, emoji.o);
                break;
            }
        }
        return console.log(`メッセージを受信 > ${msg}`);
    }
});