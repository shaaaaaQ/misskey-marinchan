const cjp = require('cjp');

const texts = [
    'うう'
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