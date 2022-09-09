import { PermissionFlagsBits, PermissionsString } from 'discord.js';

/** will compare obj2 to obj1, obj2 may extend obj1 */
export function compareObjects(
    obj1: any,
    obj2: any,
    defaultValue: [key: string, val: any][] = [], //intentionally not a map so "." can be used
    _KEY: string[] = []
): boolean {
    for (let key of Object.keys(obj1)) {
        const WholeKey = _KEY.concat(key);
        // loose false comparison
        const val1 = obj1[key],
            val2 = obj2[key];

        if (
            val1 &&
            val2 &&
            typeof val1 === 'object' &&
            typeof val2 === 'object'
        ) {
            if (!compareObjects(val1, val2, defaultValue, WholeKey)) {
                return false;
            }
        } else if (val1 !== val2) {
            let bool1 = Boolean(val1),
                bool2 = Boolean(val2);

            if (bool1 && typeof val1 === 'object') {
                bool1 = Object.keys(val1).length > 0;
            }
            if (bool2 && typeof val2 === 'object') {
                bool2 = Object.keys(val2).length > 0;
            }

            if (!bool1) {
                let def = defaultValue.find((v) => v[0] === WholeKey.join('.'));
                if (def) {
                    bool1 = def[1];
                }
            }
            if (!bool2) {
                let def = defaultValue.find((v) => v[0] === WholeKey.join('.'));
                if (def) {
                    bool2 = def[1];
                }
            }

            if (bool1 !== bool2) {
                let keystr = WholeKey.join('.'),
                    val1str = JSON.stringify(val1),
                    val2str = JSON.stringify(val2);
                console.log(
                    `compareObjects (${keystr}): different value; ${val1str} (${bool1}) !== ${val2str} (${bool2})`
                );
                return false;
            }
        }
    }

    return true;
}

export function BitfieldToString(bitfield: PermissionsString[]): string {
    return bitfield
        .map((perm) => PermissionFlagsBits[perm])
        .reduce((a, b) => a | b, BigInt(0))
        .toString();
}

export const removeLF = (s: string) => s.replace(/\n/g, '');
