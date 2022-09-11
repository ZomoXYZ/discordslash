type JsonObject = { [key: string]: any };

type FnSelf<T> = (fn: T) => T;
export type optionsTypePart<T, U> = T | U | FnSelf<U>;
export type optionsType<T, U> = optionsTypePart<T, U> | optionsTypePart<T, U>[];

/**
 * Combines a types and its generator into one: `T | U | (T | U)[]` -> `T[]`
 *
 * Assumes
 *  - `method` arg does not exist on type `T`
 *  - `method` arg exists on type `U`
 *  - `method` arg on type `U` is a function
 *  - function `method` on type `U` returns `T`
 */
export function normalizeOption<
    Json extends JsonObject,
    Generator extends JsonObject
>(
    option: optionsType<Json, Generator>,
    cls: new () => Generator,
    method = 'toJson'
): Json[] {
    const options: Json[] = [];

    if (!Array.isArray(option)) {
        option = [option];
    }
    if (option.length > 0) {
        return option.map((opt) => {
            if (opt instanceof Function) {
                opt = opt(new cls());
            }
            if (method in opt && opt[method] instanceof Function) {
                return opt[method]();
            } else {
                return opt;
            }
        });
    }

    return options;
}
