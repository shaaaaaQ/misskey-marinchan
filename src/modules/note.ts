import cjp from 'cjp';
import { stream, api } from '../misskey';

const texts = [
    'うう',
    'お',
    ':seppuku:',

    () => {
        const hour = new Date().getHours();
        switch (true) {
            case 4 <= hour && hour < 11: return 'おはようございます…むにゃむにゃ……';
            case 11 <= hour && hour < 18: return 'こんにちは！(\\*^_^*)';
            default: return 'こんばんは〜(\\*^_^*)';
        }
    }
];

function createNote(text: string) {
    api.request('notes/create', { visibility: 'home', text: text });
}

function pick() {
    const text = texts[Math.floor(Math.random() * texts.length)]
    if (typeof text === 'function') return text()
    return text
}

function post() {
    let text = pick()
    if (Math.floor(Math.random() * 5) === 0) text = cjp.generate(text);

    createNote(text);
}

stream.on('_connected_', () => {
    createNote('お');

    setInterval(() => {
        post();
    }, 1000 * 60 * 60);
});