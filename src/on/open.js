module.exports = async function () {
    this.connect('homeTimeline');
    this.connect('main');
    console.log('起動');
};