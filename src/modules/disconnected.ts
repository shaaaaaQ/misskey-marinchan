import { stream } from '../misskey';

stream.on('_disconnected_', () => {
    console.log('disconnected');
});