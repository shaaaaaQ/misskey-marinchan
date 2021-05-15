module.exports = function (note) {
    if (note.user.isBot || !note.text) return;

    console.log(`メッセージを受信 > ${note.text}`);

    switch (true) {
        case /ping/i.test(note.text): {
            const createdAt = new Date(note.createdAt);
            const diffMillis = Date.now() - createdAt.getTime();
            note.reply(`pong (${diffMillis}ms)`);
            break;
        }
        case /卍Hello|起床|ぽき|ぽは|おはよ|はろ|こんにちは|こんばんは/i.test(note.text) && !/おはようございません/i.test(note.text): {
            const hour = new Date().getHours();
            switch (true) {
                case 4 <= hour && hour < 11:
                    note.reply('おはようございます…むにゃむにゃ……');
                    break;
                case 11 <= hour && hour < 18:
                    note.reply('こんにちは！(\\*^_^*)');
                    break;
                case 18 <= hour || hour < 4:
                    note.reply('こんばんは〜(\\*^_^*)');
                    break;
            }
            break;
        }
        case /おやすみ|寝る|ぽや/i.test(note.text): {
            note.addReaction('😴');
            note.reply('おやすみ〜〜');
            break;
        }
        case /まりんとじゃんけん/i.test(note.text): {
            note.reply('ごめん！まだ整備中なの！ ><');
            break;
        }
        case /まりん/i.test(note.text) && !/しまりん|クソまりん|さぶまりん/i.test(note.text): {
            switch (true) {
                case /ハゲ/i.test(note.text): {
                    note.addReaction('💢');
                    note.reply('私はハゲてなんかいません！');
                    break;
                }
                case /じゃんけんしよ/i.test(note.text): {
                    note.reply('ごめん！まだ整備中なの！ ><');
                    break;
                }
                case /結婚/i.test(note.text): {
                    note.addReaction('💞');
                    note.reply('うーん、考えておきます^^;');
                    break;
                }
                case /てくるね/i.test(note.text): {
                    note.reply('いってらっしゃい〜');
                    break;
                }
                case /すき|好き|あいし|愛し/i.test(note.text): {
                    note.addReaction('💗');
                    note.reply('あ、ありがとうございます///');
                    break;
                }
                case /してあげた|した/i.test(note.text): {
                    note.reply('ありがとう！！(極度感謝)');
                    break;
                }
                case /かわいい|可愛い/i.test(note.text): {
                    switch (true) {
                        case /宇宙一/i.test(note.text): {
                            note.addReaction('💗');
                            note.reply('そ、そんなことないですよ ///>_</// 💞💞💞💞');
                            break;
                        }
                        default: {
                            note.reply('ありがとうございます 💞💞');
                            break;
                        }
                    }
                    break;
                }
                case /やさしい|優しい/i.test(note.text): {
                    note.reply('そんなことないですよ〜(\\*^_^*)');
                    break;
                }
                case /持ち帰り/i.test(note.text) && !/りたくない/i.test(note.text): {
                    note.reply('照れますね...///');
                    break;
                }
                case /歳|年齢|才/i.test(note.text): {
                    switch (true) {
                        case /ナン才|ナン歳|ナンさい/i.test(note.text): {
                            note.reply('ナン歳でしょうか？なんちゃって笑');
                            break;
                        }
                        default: {
                            note.reply('私は13歳よ！');
                            break;
                        }
                    }
                    break;
                }
                case /草/i.test(note.text): {
                    note.reply('笑笑');
                    break;
                }
                case /まりんちゃんと/i.test(note.text): {
                    note.reply('まりんと何がしたいって？');
                    break;
                }
                default: {
                    note.addReaction('❓');
                    note.reply('どうしたの？');
                    break;
                }
            }
            break;
        }
        case /💩/i.test(note.text): {
            note.addReaction('💩');
            break;
        }
        case /PPAP|ペンパイナッポーアッポーペン|Pen Pineapple Apple Pen/i.test(note.text): {
            note.addReaction('🆖');
            note.reply('PPAPは禁止です！');
            break;
        }
        case /卍/i.test(note.text): {
            switch (true) {
                case /卍。/i.test(note.text): {
                    note.reply('卍。');
                    break;
                }
                case /卍！|卍!/i.test(note.text): {
                    note.reply('卍！');
                    break;
                }
            }
            break;
        }
        case /はい。/i.test(note.text) && !/はいい|はいはい/i.test(note.text): {
            note.reply('はい。');
            break;
        }
        case /seppuku|切腹/i.test(note.text): {
            note.addReaction(':seppuku:');
            break;
        }
        case /RedBull|レッドブル/i.test(note.text): {
            note.addReaction(':redbull:');
            break;
        }
        case /chrome/i.test(note.text): {
            note.addReaction(':chrome:');
            break;
        }
        case /edge/i.test(note.text): {
            note.addReaction(':edge:');
            break;
        }
        case /firefox/i.test(note.text): {
            note.addReaction(':firefox:');
            break;
        }
        case /brave/i.test(note.text): {
            note.addReaction(':brave:');
            break;
        }
        case /twitter/i.test(note.text): {
            note.addReaction(':twitter:');
            break;
        }
        case /misskey/i.test(note.text): {
            note.addReaction(':misskey:');
            break;
        }
        case /microsoft/i.test(note.text): {
            note.addReaction(':microsoft:');
            break;
        }
        case /ubuntu/i.test(note.text): {
            note.addReaction(':ubuntu:');
            break;
        }
        case /safari/i.test(note.text): {
            note.addReaction(':safari:');
            break;
        }
        case /windows/i.test(note.text): {
            note.addReaction(':windows:');
            break;
        }
        case /xiaomi/i.test(note.text): {
            note.addReaction(':xiaomi:');
            break;
        }
        case /youtube/i.test(note.text): {
            note.addReaction(':youtube:');
            break;
        }
        case /vivaldi/i.test(note.text): {
            note.addReaction(':vivaldi:');
            break;
        }
        case /blender/i.test(note.text): {
            note.addReaction(':blender:');
            break;
        }
        case /334/i.test(note.text): {
            note.addReaction(':334:');
            break;
        }
        case note.text === 'お': {
            note.addReaction(':o:');
            break;
        }
    }
};
