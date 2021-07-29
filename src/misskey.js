const { EventEmitter } = require('events');
const WebSocket = require('ws');
const axios = require('axios');
const { v4 } = require('uuid');

class Api extends EventEmitter {
    constructor(url, i) {
        super();
        this.url = url;
        this.i = i;
    }

    _emit(name, ...args) {
        try {
            this.emit(name, ...args);
        } catch (e) {
            this.emit('error', e);
        }
    }

    run() {
        if ('_ws' in this) return;

        const conn = {
            homeTimeline: v4(),
            main: v4()
        };

        const _connect = () => {
            this._ws = new WebSocket(`${this.url.replace('http', 'ws')}/streaming?i=${this.i}`);

            this._ws.on('open', () => {
                console.log('ws: open');

                Object.keys(conn).forEach(c => {
                    this.send({
                        type: 'connect',
                        body: {
                            channel: c,
                            id: conn[c]
                        }
                    });
                });

                // 再接続したときはここまで
                if (this.isConnected) return;

                this._emit('open');
                this.isConnected = true;
            });

            this._ws.on('message', (json) => {
                const data = JSON.parse(json);
                this._emit('message', data);
                if (!data.body) return;
                if (data.body.error) return this._emit('error', data.body.error);
                if (data.type === 'channel') {
                    switch (data.body.id) {
                        case conn.homeTimeline: return this._emit('homeTimeline', data.body.body);
                        case conn.main: return this._emit(data.body.type, data.body.body);
                    }
                }
            });

            this._ws.on('close', () => {
                console.log('ws: close');
                this._ws.removeAllListeners();

                // 再接続する
                _connect();
            });
        };
        _connect();
    }

    send(data) {
        if (!('_ws' in this)) return;
        this._ws.send(JSON.stringify(data));
    }

    post(endpoint, params) {
        return axios.post(`${this.url}/api/${endpoint}`, {
            i: this.i,
            ...params
        })
            .then((res) => { return res.data; })
            .catch(() => { return; });
    }
}

class Note {
    constructor(api, data) {
        this.api = api;
        this.data = data;

        if (data) {
            this.id = data.id;
            this.text = data.text;
            this.cw = data.cw;
            this.visibility = data.visibility;
        }
    }

    get createdAt() {
        const date = this.data?.createdAt && new Date(this.data.createdAt);
        if (!date) throw new Error('ノートを作成した時間取得できなかった');
        return date;
    }

    renote(params) {
        return this.api.post('notes/create', {
            renoteId: this.id,
            ...params
        });
    }

    reply(params) {
        return this.api.post('notes/create', {
            replyId: this.id,
            ...params
        });
    }

    delete() {
        return this.api.post('notes/delete', {
            noteId: this.id
        });
    }

    react(reaction) {
        return this.api.post('notes/reactions/create', {
            noteId: this.id,
            reaction: reaction
        });
    }

    deleteReact() {
        return this.api.post('notes/reactions/delete', {
            noteId: this.id
        });
    }

    async fetchChannel() {
        const channel = await this.api.post('channels/show', { channelId: this.data?.channel?.id });
        if (!channel) throw 'チャンネル取得できなかった';
        return new Channel(this.api, channel);
    }

    async fetchUser() {
        const user = await this.api.post('users/show', { userId: this.data?.userId });
        if (!user) throw 'ユーザー取得できなかった';
        return new User(this.api, user);
    }
}

class User {
    constructor(api, data) {
        this.api = api;
        this.data = data;

        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.username = data.username;
            this.avatarUrl = data.avatarUrl;
            this.isModerator = data.isModerator;
            this.isBot = data.isBot;
            this.isCat = data.isCat;
            this.isFollowing = data.isFollowing;
            this.isFollowed = data.isFollowed;
        }
    }

    follow() {
        return this.api.post('following/create', {
            userId: this.id
        });
    }

    unfollow() {
        return this.api.post('following/delete', {
            userId: this.id
        });
    }
}

class Channel {
    constructor(api, data) {
        this.api = api;
        this.data = data;

        if (data) {
            this.id = data.id;
            this.name = data.name;
            this.description = data.description;
            this.bannerUrl = data.bannerUrl;
            this.notesCount = data.notesCount;
            this.usersCount = data.usersCount;
            this.isFollowing = data.isFollowing;
            this.userId = data.userId;
        }
    }

    follow() {
        return this.api.post('channels/follow', {
            channelId: this.id
        });
    }
}

module.exports = {
    Api: Api,
    Note: Note,
    User: User,
    Channel: Channel
};