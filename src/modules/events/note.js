const cjp = require('cjp');

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

module.exports = {
    event: 'open',
    listener: async function () {
        const createNote = (text) => {
            this.post('notes/create', {
                text: text,
                visibility: 'home'
            });
        };
        createNote('起動');
        setInterval(() => {
            let text = texts[Math.floor(Math.random() * texts.length)];
            if (typeof text === 'function') text = text();
            if (Math.floor(Math.random() * 5) === 0) text = cjp.generate(text);
            createNote(text);
        }, 1000 * 60 * 60);
    }
};