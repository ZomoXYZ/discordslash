import { PermissionFlagsBits, PermissionsString } from 'discord.js';

/** will compare val2 to val1, if they are objects, val2 may extend val1
 * @param defaultTrue list of keys that should be true by default if they don't exist (nonexistent keys equate to false so there is no reason to include them)
 */
export function compareValues(
    val1: any,
    val2: any,
    defaultTrue: string[] = [],
    _KEY: string[] = []
) {
    if (typeof val1 !== typeof val2) {
        return false;
    }

    if (typeof val1 === 'object') {
        if (Array.isArray(val1) !== Array.isArray(val2)) return false;

        for (let key of Object.keys(val1)) {
            if (!looseBoolean(val1[key])) continue;

            if (!(key in val2)) return false;

            const WholeKey = _KEY.concat(key);
            const compare = compareValues(
                val1[key],
                val2[key],
                defaultTrue,
                WholeKey
            );
            if (!compare) return false;
        }
    } else {
        let bool1 = looseBoolean(val1),
            bool2 = looseBoolean(val2);

        if (val1 === undefined || val1 === null) {
            if (defaultTrue.includes(_KEY.join('.'))) {
                bool1 = true;
            }
        }
        if (val2 === undefined || val2 === null) {
            if (defaultTrue.includes(_KEY.join('.'))) {
                bool2 = true;
            }
        }

        if (bool1 !== bool2) return false;
    }

    return true;
}

export function looseBoolean(value: any): boolean {
    const bool = Boolean(value);
    if (!bool) return false;
    if (Object.keys(value).length === 0) return false;
    return true;
}

export function BitfieldToString(bitfield: PermissionsString[]): string {
    return bitfield
        .map((perm) => PermissionFlagsBits[perm])
        .reduce((a, b) => a | b, BigInt(0))
        .toString();
}

export const removeLF = (s: string) => s.replace(/\n/g, '');
