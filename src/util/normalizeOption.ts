type JsonObject = { [key: string]: any };

export type optionsType<T, U> = T | U | (T | U)[];

/**
 * Combines a types and its generator into one: `T | U | (T | U)[]` -> `T[]`
 *
 * Assumes
 *  - `method` arg does not exist on type `T`
 *  - `method` arg exists on type `U`
 *  - `method` arg on type `U` is a function
 *  - function `method` on type `U` returns `T`
 */
export function normalizeOption<T extends JsonObject, U extends JsonObject>(
    option: optionsType<T, U>,
    method = 'toJson'
): T[] {
    const options: T[] = [];

    if (Array.isArray(option)) {
        if (option.length > 0) {
            return option.map((opt) => {
                if (method in opt && opt[method] instanceof Function)
                    return opt[method]();
                else return opt;
            });
        }
    } else {
        if (method in option && option[method] instanceof Function)
            return [option[method]()];
        else return [option] as T[];
    }

    return options;
}
