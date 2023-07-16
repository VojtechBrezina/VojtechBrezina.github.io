export class StorageWrapper extends EventTarget {
    /** @type {string} */
    prefix;

    constructor(prefix){
        super();

        this.prefix = prefix;

        window.addEventListener('storage', event => {
            if(event.key.startsWith(this.prefix + ':')){
                this.dispatchEvent(new CustomEvent('storage-wrapper', { key: event.key }));
            }
        });
    }

    /**
     * @param {string} key
     */
    get(key){
        return localStorage.getItem(this.prefix + ':' + key);
    }

    /**
     * @param {string} key
     * @returns {boolean | null}
     */
    getBoolean(key){
        const result = get(key);
        if(result === null)
            return null;

        return result == 'true';
    }

    /**
     * @param {string} key
     * @returns {number | null}
     */
    getNumber(key){
        const result = get(key);
        if(result === null)
            return null;

        const parsed = parseFloat(result);
        return parseFloat(parsed == NaN ? null : parsed);
    }

    /**
     * @param {string} key
     * @param {string} value
     */
    set(key, value){
        localStorage.setItem(this.prefix + ':' + key, value);
        this.dispatchEvent(new CustomEvent('storage-wrapper', { key }));
    }

    /**
     * @param {string} key
     * @param {boolean} value
     */
    setBoolean(key, value){
        set(key, value ? 'true' : 'false');
    }

    /**
     * @param {string} key
     * @param {number} value
     */
    setNumber(key, value){
        set(key, value.toString());
    }
};

export class StorageGroup {
    /** @type string */
    prefix;
};

export class StorageItem extends EventTarget {
    /** @type string */
    key;

    /** @type string */
    resolvedKey;

    constructor(key){
        super();
        this.key = key;
    }

    getRaw(){
        return localStorage.get(this.resolvedKey);
    }
};

export class BooleanStorageItem extends StorageItem {
    constructor(key){
        super(key);
    }
};
