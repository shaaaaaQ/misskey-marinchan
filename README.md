## Misskey用のBot(作りかけ)
ここから下はメモ

#### 送信
```javascript
ws.send(JSON.stringify({
    "type": "api",
    "body": {
        "id": id,
        "endpoint": "notes/create",
        "data": {
            "text": "WebSocketで送信に成功",
            "visibility": "home"
        }
    }
}));
```

#### 設定
```json
{
    "i": "",
    "url": "msk.seppuku.club"
}
```