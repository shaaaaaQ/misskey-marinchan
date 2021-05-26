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

    run() {
        if ('_ws' in this) return;

        this._ws = new WebSocket(`${this.url.replace('http', 'ws')}/streaming?i=${this.i}`);
        this.id = {
            homeTimeline: v4(),
            main: v4()
        };

        this._ws.on('open', () => {
            this.emit('open');
        });

        this._ws.on('message', (json) => {
            const data = JSON.parse(json);
            this.emit('message', data);
            if (!data.body) return;
            if (data.body.error) return this.emit('error', data.body.error);
            if (data.type === 'channel') {
                switch (data.body.id) {
                    case this.id.homeTimeline: return this.emit('homeTimeline', data.body.body);
                    case this.id.main: return this.emit(data.body.type, data.body.body);
                }
            }
        });
    }

    post(endpoint, params) {
        return axios.post(`${this.url}/api/${endpoint}`, {
            i: this.i,
            ...params
        })
            .then((res) => { return res.data; })
            .catch(() => { return; });
    }

    connect(channel) {
        this._ws.send(JSON.stringify({
            type: 'connect',
            body: {
                channel: channel,
                id: this.id[channel]
            }
        }));
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
        return this.data?.createdAt && new Date(this.data.createdAt);
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

    async getChannel() {
        return this.data?.channel?.id && new Channel(this.api, await this.api.post('channels/show', { channelId: this.data.channel.id }));
    }

    async getUser() {
        return this.data?.userId && new User(this.api, await this.api.post('users/show', { userId: this.data.userId }));
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

    deleteFollow() {
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