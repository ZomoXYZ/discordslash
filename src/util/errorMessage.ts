var emsgShim: null | {get: (str: string) => string} = null;

/**
 * use the emsg() function instead
 */
export class errorMessage {
    public content: string;
    public ephemeral: boolean;

    constructor(content: string, ephemeral = true) {
        this.content = content;
        this.ephemeral = ephemeral;
    }
}

/**
 * a simple class to contain an error message and related data
 * @param msg error message
 * @param ephemeral (default=true)
 * @param noShim (defualt=false) skip the shim
 * @returns new errorMessage
 */
export const emsg = (msg: string, ephemeral = true, noShim = false) => new errorMessage(emsgShim && !noShim ? emsgShim.get(`error.${msg}`) : msg, ephemeral);

/**
 * @param shim probably `Lang` (github:ZomoXYZ/lang)
 */
export const setEmsgShim = (shim: {get: (str: string) => string}) => emsgShim = shim;