const cjp = require('cjp');
const { api } = require('../misskey');

const texts = [
    'うう',
    'お',
    ':seppuku:',

    () => {
        const hour = new Date().getHours();
        switch (true) {
            case 4 <= hour && hour < 11: return 'おはようございます…むにゃむにゃ……';
            case 11 <= hour && hour < 18: return 'こんにちは！(\\*^_^*)';
            case 18 <= hour || hour < 4: return 'こんばんは〜(\\*^_^*)';
        }
    }
];

function createNote() {
    let text = texts[Math.floor(Math.random() * texts.length)];
    if (typeof text === 'function') text = text();
    if (Math.floor(Math.random() * 5) === 0) text = cjp.generate(text);

    api.request('notes/create', { visibility: 'home', text: text });
}

setInterval(() => {
    createNote();
}, 1000 * 60 * 60);

module.exports = {
    event: '_connected_',
    listener: function() {
        createNote();
    }
};