import { Note } from 'misskey-js/built/entities';

type Callback = (note: Note, args: string[]) => void

type Command = {
    name: string
    aliases: string[]
    description: string
    run: Callback
}

const commands: Command[] = [];

const register = (name: string, aliases: string[] = [], description: string = 'none', callback: Callback) => {
    commands.push({
        name,
        aliases,
        description,
        run: callback
    });
};

const get = (name: string) => {
    return commands.find(c => c.name === name || c.aliases.includes(name));
};

const getAll = () => {
    return commands;
};

export default {
    register,
    get,
    getAll
};