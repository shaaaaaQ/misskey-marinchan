## Misskey用のBot(作りかけ)
ここから下はメモ

#### 設定
./config.json
```json
{
    "i": "",
    "url": "https://msk.seppuku.club"
}
```

### channel
取得
```javascript
const { Api, Note, Channel } = require('./misskey');
const config = require('../config.json');

const a = new Api(config.url, config.i);

// ここから
const channels = await a.post('channels/featured');
const kaihatsuChannels = channels && channels.filter(ch => ch && ch.name === 'Misskeyまりん開発部');
kaihatsuChannels.forEach(ch => {
    const channel = new Channel(a, ch);
    if (channel.isFollowing) console.log('ふぉーしてある');
    if (!channel.isFollowing) {
        console.log('ふぉーしてない');
        channel.follow();
    }
});
```
TLから流れてきたノートのチャンネルを取得するとき
```javascript
const note = new Note(a, data);
console.log(await note.channel);
```