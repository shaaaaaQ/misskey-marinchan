module.exports = async function () {
    this.connect('homeTimeline');
    this.connect('main');
    const i = await this.post('i');
    if (i) {
        console.log(`--------------------------------------------------
userId   : ${i.id}
username : ${i.username}
--------------------------------------------------`);
    }
};