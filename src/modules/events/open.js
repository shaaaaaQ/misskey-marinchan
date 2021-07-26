module.exports = {
    event: 'open',
    listener: async function () {
        this.connect('homeTimeline');
        this.connect('main');

        console.log('--------------------------------------------------');
        const meta = await this.post('meta');
        if (meta) {
            console.log('<インスタンス情報>');
            console.log(` name: ${meta.name}`);
            console.log(` uri : ${meta.uri}`);
        }

        const i = await this.post('i');
        if (i) {
            this.username = i.username;
            this.userId = i.id;
            console.log('<アカウント情報>');
            console.log(` username : ${i.username}`);
            console.log(` userId   : ${i.id}`);
            console.log(` follower : ${i.followersCount}`);
            console.log(` following: ${i.followingCount}`);
        }

        const followedChannel = await this.post('channels/followed', { limit: 100 });
        if (followedChannel.length) {
            console.log('<フォロー中のチャンネル>');
            followedChannel.forEach(ch => {
                console.log(` ${ch.name}`);
            });
        }
        console.log('--------------------------------------------------');
    }
};