import { Command, CommandOption, CommandTypes } from "../../types/commands";
import optionNormal from "../../util/optionNormal";
import CommandOptionsGenerator from "./options";

export default class CommandGenerator {
    name: string;
    description: string;
    options: CommandOption[];
    /**
     * default: true
     */
    default_permission?: boolean;
    type?: CommandTypes;

    constructor() {
        this.name = "";
        this.description = "";
        this.options = [];
        this.default_permission = true;
        this.type = CommandTypes.CHAT_INPUT;
    }

    setName(name: string) {
        this.name = name;
        return this;
    }
    setDescription(description: string) {
        this.description = description;
        return this;
    }
    addOption(option: CommandOption | CommandOptionsGenerator | CommandOption[] | CommandOptionsGenerator[]) {
        this.options.push(...optionNormal(option));
        return this;
    }
    setDefaultPermission(permission: boolean) {
        this.default_permission = permission;
        return this;
    }
    setType(type: CommandTypes) {
        this.type = type;
        return this;
    }

    toJson(): Command {
        return {
            name: this.name,
            description: this.description,
            options: this.options,
            default_permission: this.default_permission,
            type: this.type
        }
    }

}