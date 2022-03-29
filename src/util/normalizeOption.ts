type JsonObject = { [key: string]: any };

export type optionsType<T, U> = T | U | T[] | U[];

export function normalizeOption<T extends JsonObject, U extends { toJson: () => JsonObject }>(option: optionsType<T, U>): T[] {

    const options: T[] = [];

    if (Array.isArray(option)) {
        if (option.length > 0) {

            if ('toJson' in option[0] && option[0].toJson instanceof Function)
                return option.map(opt => opt.toJson());
            else
                return option as T[];

        }
    } else {

        if ('toJson' in option && option.toJson instanceof Function)
            return [option.toJson()];
        else
            return [option] as T[];

    }

    return options;

}