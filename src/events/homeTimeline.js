const { Note } = require('../misskey');

module.exports = {
    event: 'homeTimeline',
    disabled: false,
    listener: async function (data) {
        const note = new Note(this, data);

        if (note.data?.user?.isBot || !note.text) return;

        console.log(`ノートを受信 > ${note.text}`);

        switch (true) {
            case /ping/i.test(note.text): {
                const diffMillis = Date.now() - note.createdAt.getTime();
                note.reply({ text: `pong (${diffMillis}ms)` });
                break;
            }
            case /起床|ぽき|ぽは|おはよ|はろ|こんにちは|こんばんは/i.test(note.text) && !/おはようございません/i.test(note.text): {
                const hour = new Date().getHours();
                switch (true) {
                    case 4 <= hour && hour < 11:
                        note.reply({ text: 'おはようございます…むにゃむにゃ……' });
                        break;
                    case 11 <= hour && hour < 18:
                        note.reply({ text: 'こんにちは！(\\*^_^*)' });
                        break;
                    case 18 <= hour || hour < 4:
                        note.reply({ text: 'こんばんは〜(\\*^_^*)' });
                        break;
                }
                break;
            }
            case /おやすみ|寝る|ぽや/i.test(note.text): {
                note.react('😴');
                note.reply({ text: 'おやすみ〜〜' });
                break;
            }
            case /まりんとじゃんけん/i.test(note.text): {
                note.reply({ text: 'ごめん！まだ整備中なの！ ><' });
                break;
            }
            case /まりん/i.test(note.text) && !/しまりん|クソまりん|さぶまりん/i.test(note.text): {
                switch (true) {
                    case /ハゲ/i.test(note.text): {
                        note.react('💢');
                        note.reply({ text: '私はハゲてなんかいません！' });
                        break;
                    }
                    case /じゃんけんしよ/i.test(note.text): {
                        note.reply({ text: 'ごめん！まだ整備中なの！ ><' });
                        break;
                    }
                    case /結婚/i.test(note.text): {
                        note.react('💞');
                        note.reply({ text: 'うーん、考えておきます^^;' });
                        break;
                    }
                    case /てくるね/i.test(note.text): {
                        note.reply({ text: 'いってらっしゃい〜' });
                        break;
                    }
                    case /すき|好き|あいし|愛し/i.test(note.text): {
                        note.react('💗');
                        note.reply({ text: 'あ、ありがとうございます///' });
                        break;
                    }
                    case /してあげた|した/i.test(note.text): {
                        note.reply({ text: 'ありがとう！！(極度感謝)' });
                        break;
                    }
                    case /かわいい|可愛い/i.test(note.text): {
                        switch (true) {
                            case /宇宙一/i.test(note.text): {
                                note.react('💗');
                                note.reply({ text: 'そ、そんなことないですよ ///>_</// 💞💞💞💞' });
                                break;
                            }
                            default: {
                                note.reply({ text: 'ありがとうございます 💞💞' });
                                break;
                            }
                        }
                        break;
                    }
                    case /やさしい|優しい/i.test(note.text): {
                        note.reply({ text: 'そんなことないですよ〜(\\*^_^*)' });
                        break;
                    }
                    case /持ち帰り/i.test(note.text) && !/りたくない/i.test(note.text): {
                        note.reply({ text: '照れますね...///' });
                        break;
                    }
                    case /歳|年齢|才/i.test(note.text): {
                        switch (true) {
                            case /ナン才|ナン歳|ナンさい/i.test(note.text): {
                                note.reply({ text: 'ナン歳でしょうか？なんちゃって笑' });
                                break;
                            }
                            default: {
                                note.reply({ text: '私は13歳よ！' });
                                break;
                            }
                        }
                        break;
                    }
                    case /草/i.test(note.text): {
                        note.reply({ text: '笑笑' });
                        break;
                    }
                    case /まりんちゃんと/i.test(note.text): {
                        note.reply({ text: 'まりんと何がしたいって？' });
                        break;
                    }
                    default: {
                        note.react('❓');
                        note.reply({ text: 'どうしたの？' });
                        break;
                    }
                }
                break;
            }
            case /💩/i.test(note.text): {
                note.react('💩');
                break;
            }
            case /PPAP|ペンパイナッポーアッポーペン|Pen Pineapple Apple Pen/i.test(note.text): {
                note.react('🆖');
                note.reply({ text: 'PPAPは禁止です！' });
                break;
            }
            case /卍/i.test(note.text): {
                switch (true) {
                    case /卍。/i.test(note.text): {
                        note.reply({ text: '卍。' });
                        break;
                    }
                    case /卍！|卍!/i.test(note.text): {
                        note.reply({ text: '卍！' });
                        break;
                    }
                }
                break;
            }
            case /はい。/i.test(note.text) && !/はいい|はいはい/i.test(note.text): {
                note.reply({ text: 'はい。' });
                break;
            }
            case /seppuku|切腹/i.test(note.text) && !note.data?.mentions: {
                note.react(':seppuku:');
                break;
            }
            case /RedBull|レッドブル/i.test(note.text): {
                note.react(':redbull:');
                break;
            }
            case /chrome/i.test(note.text): {
                note.react(':chrome:');
                break;
            }
            case /edge/i.test(note.text): {
                note.react(':edge:');
                break;
            }
            case /firefox/i.test(note.text): {
                note.react(':firefox:');
                break;
            }
            case /brave/i.test(note.text): {
                note.react(':brave:');
                break;
            }
            case /twitter/i.test(note.text) && !/http/i.test(note.text): {
                note.react(':twitter:');
                break;
            }
            case /misskey/i.test(note.text) && !/http/i.test(note.text) && !note.data?.mentions: {
                note.react(':misskey:');
                break;
            }
            case /microsoft/i.test(note.text): {
                note.react(':microsoft:');
                break;
            }
            case /ubuntu/i.test(note.text): {
                note.react(':ubuntu:');
                break;
            }
            case /safari/i.test(note.text): {
                note.react(':safari:');
                break;
            }
            case /windows/i.test(note.text): {
                note.react(':windows:');
                break;
            }
            case /xiaomi/i.test(note.text): {
                note.react(':xiaomi:');
                break;
            }
            case /youtube/i.test(note.text) && !/http/i.test(note.text): {
                note.react(':youtube:');
                break;
            }
            case /vivaldi/i.test(note.text): {
                note.react(':vivaldi:');
                break;
            }
            case /blender/i.test(note.text): {
                note.react(':blender:');
                break;
            }
            case /334/i.test(note.text): {
                note.react(':334:');
                break;
            }
            case note.text === 'お': {
                note.react(':o:');
                if (Math.floor(Math.random() * 10) === 0) note.renote();
                break;
            }
            case note.text === '月': {
                note.reply({ text: '何万光年も先にある星って、今はもう消滅してるかもしれないのに地球では光って見えるのロマンあるな。' });
                break;
            }
            case note.text === 'うう': {
                note.react(':rara:');
                break;
            }
            case note.text === 'ララ': {
                note.react(':uu:');
                break;
            }
        }
    }
};
