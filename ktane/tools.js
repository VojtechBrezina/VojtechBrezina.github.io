import * as Modes from '/ktane/modes.js'

class Tool {
    /** @type string */
    key;

    /** @type string */
    mode;

    /** @type string | null */
    description;

    /**
     * @param {string} key
     * @param {string} mode
     * @param {string?} description
     */
    constructor(key, mode, description){
        this.key = key;
        this.mode = mode;
        this.description = description ?? null;
    }
};

class Section {
    /** @type string */
    key;

    /** @type string */
    title;

    /** @type string | null */
    description;

    /** @type Tool[] */
    tools;

    /**
     * @param {string} key
     * @param {string} title
     * @param {string?} description
     * @param {Tool[]} tools
     */
    constructor(key, title, description, tools){
        this.key = key;
        this.title = title;
        this.description = description ?? null;
        this.tools = tools;
    }
};

export const definitions = [
    new Section(
        'serial',
        'Serial number',
        'Making the serial number easier to work with.',
        [
            new Tool(
                "separator",
                "Separator",
                "Automatically group the number into chunks."
            ),
            new Tool(
                'colors',
                'Colors',
                'Highlight important parts of the serial number.'
            )
        ]
    )
];
