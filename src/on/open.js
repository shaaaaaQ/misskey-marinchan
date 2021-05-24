module.exports = async function () {
    this.connect('homeTimeline');
    this.connect('main');
    const i = await this.post('i');
    const followedChannel = await this.post('channels/followed', { limit: 100 });
    console.log('--------------------------------------------------');
    if (i) {
        console.log('<アカウント情報>');
        console.log(` userId   : ${i.id}`);
        console.log(` username : ${i.username}`);
        console.log(` follower : ${i.followersCount}`);
        console.log(` following: ${i.followingCount}`);
    }
    if (followedChannel.length) {
        console.log('<フォロー中のチャンネル>');
        followedChannel.forEach(ch => {
            console.log(` ${ch.name}`);
        });
    }
    console.log('--------------------------------------------------');
};