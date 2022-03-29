import { Command } from "../types/commands";
import { normalizeOption, optionsType } from "../util/normalizeOption";
import CommandGenerator from "./generator/command";

const Commands: Command[] = [];

export function add(command: optionsType<Command, CommandGenerator>) {
    Commands.push(...normalizeOption(command));
}

export * from "./generator/command";
export * from "./generator/option";