import { Note } from 'misskey-js/built/entities';

type Callback = (note: Note) => void

type Command = {
    name: string
    aliases: string[]
    run: Callback
}

const commands: Command[] = [];

const register = (name: string, aliases: string[] = [], run: Callback) => {
    commands.push({
        name,
        aliases,
        run
    });
};

const get = (name: string) => {
    return commands.find(c => c.name === name || c.aliases.includes(name));
};

export default {
    register,
    get
};