"use strict";
const fs = require(`fs`);
//Reads environmental variable passed in (which is supposed to point to a Switch Config JSON file), reads
//the file and returns as JSON object
class GlobalSwitchConfig {
    obj;
    location;
    constructor(env_var = "SwitchConfig") {
        this.location = process.env[env_var] || "";
        if (!this.location) {
            throw Error(`Environmental variable "${env_var}" is not set!`);
        }
        try {
            this.obj = JSON.parse(fs.readFileSync(this.location, "utf-8"));
        }
        catch (e) {
            throw `Invalid JSON file format referred from "${env_var}" environmental variable, location "${this.location}"! Original error: "${e}"`;
        }
    }
    get(path) {
        let result = this.obj;
        for (const segment of path) {
            if (typeof result === "string" || result === undefined) {
                result = undefined;
                break;
            }
            result = result[segment];
        }
        return result;
    }
    getString(path) {
        const result = this.get(path);
        if (result === undefined) {
            throw new Error(`Global switch config file "${this.location}" does not contain path (file["${path.join(`"]["`)}"])! Result is "undefined".`);
        }
        if (typeof result !== "string") {
            throw new Error(`Path (file["${path.join(`"]["`)}"]) in global switch config file located in "${this.location}" doesn't end with a string!`);
        }
        return result;
    }
    getAny(path) {
        return this.get(path);
    }
}
module.exports = { GlobalSwitchConfig };
//# sourceMappingURL=main.js.map