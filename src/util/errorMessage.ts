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
 * @returns new errorMessage
 */
// export const emsg = (msg: string, ephemeral = true) => new errorMessage(Lang.get(`error.${msg}`), ephemeral);
export const emsg = (msg: string, ephemeral = true) => new errorMessage(msg, ephemeral);