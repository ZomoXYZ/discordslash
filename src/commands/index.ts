import { Command } from "../types/commands";
import SlashCommand from "./generator/command";

const Commands: Command[] = [];

export function add(command: Command) {
    Commands.push(command);
}