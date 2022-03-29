import { Command } from "../types/commands";
import { normalizeOption, optionsType } from "../util/normalizeOption";
import { CommandGenerator } from "./generator/command";
import { CommandOptionGenerator } from "./generator/option";

const Commands: Command[] = [];

export function add(command: optionsType<Command, CommandGenerator>) {
    Commands.push(...normalizeOption(command));
}

export {
    CommandGenerator,
    CommandOptionGenerator
}