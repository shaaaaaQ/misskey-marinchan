import { stream } from '../misskey';

stream.on('_connected_', () => {
    console.log('connected');
});