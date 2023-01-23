const fs = require(`fs`);

type returnValue = {
    [p: string]: returnValue | string | undefined
}

interface globalDataGetter {
    getString: (path: string[]) => string,
    getAny: (path: string[]) => returnValue | string | undefined
}

//Reads environmental variable passed in (which is supposed to point to a Switch Config JSON file), reads
//the file and returns as JSON object
class GlobalSwitchConfig implements globalDataGetter{
    private readonly obj: returnValue;
    private readonly location: string;

    constructor(env_var: string = "SwitchConfig") {
        this.location = process.env[env_var] || "";

        if (!this.location) {
            throw Error(`Environmental variable "${env_var}" is not set!`)
        }

        try {
            this.obj =  JSON.parse(fs.readFileSync(this.location, "utf-8"))
        } catch (e) {
            throw `Invalid JSON file format referred from "${env_var}" environmental variable, location "${this.location}"! Original error: "${e}"`
        }
    }

    private get(path: string[]): returnValue | string | undefined {
        let result: returnValue | string | undefined = this.obj;

        for (const segment of path) {
            if (typeof result === "string" || result === undefined) {
                result = undefined
                break
            }

            result = result[segment]
        }

        return result
    }

    public getString(path: string[]): string {
        const result = this.get(path);

        if (result === undefined) {
            throw new Error(`Global switch config file "${this.location}" does not contain path (file["${path.join(`"]["`)}"])! Result is "undefined".`)
        }

        if (typeof result !== "string") {
            throw new Error(`Path (file["${path.join(`"]["`)}"]) in global switch config file located in "${this.location}" doesn't end with a string!`)
        }

        return result
    }

    public getAny(path: string[]): returnValue | string | undefined {
        return this.get(path)
    }
}

module.exports = {GlobalSwitchConfig}