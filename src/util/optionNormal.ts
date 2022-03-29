type JsonObject = { [key: string]: any };

export default function<T extends JsonObject, U extends { toJson: () => JsonObject}>(option: T | U | T[] | U[]): T[] {

    const options: T[] = [];

    if (Array.isArray(option)) {
        if (option.length > 0) {

            if ('toJson' in option[0] && option[0].toJson instanceof Function)
                this.options.push(...option.map(opt => opt.toJson()));
            else
                this.options.push(...option)

        }
    } else {

        if ('toJson' in option[0] && option[0].toJson instanceof Function)
            this.options.push(option.toJson());
        else
            this.options.push(option)

    }

    return options;

}