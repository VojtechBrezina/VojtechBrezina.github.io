import { StorageWrapper } from '/modules/local-storage.js';

const TOOL_PREFIX = 'tool';
const ENABLED = 'enabled';
const DATA = 'data';

class Preferences extends StorageWrapper {
    constructor(){
        super('ktane');
    }

    /**
     * @param {string} name
     * @returns {string}
     */
    toolEnabled(name){
        return `${TOOL_PREFIX}.${name}.${ENABLED}`;
    }

    /**
     * @param {string} name
     * @param {string} key
     * @returns {string}
     */
    toolData(name, key){
        return `${TOOL_PREFIX}.${name}.${DATA}.${key}`;
    }
}

export default new Preferences();
