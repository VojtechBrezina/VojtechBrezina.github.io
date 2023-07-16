class Mode {
    /** @type string */
    name;

    /** @type string */
    color;

    /**
     * @param {string} name
     * @param {string} color
     */
    constructor(name, color){
        this.name = name;
        this.color = color;
    }
};

export const clean = new Mode("clean", "white");
export const harmless = new Mode("harmless", "green");
export const discutable = new Mode("discutable", "yellow");
export const unfair = new Mode("unfair", "orange");
export const cheat = new Mode("cheat", "red");

/**
 * @param {HTMLElement} element
 * @param {Mode} mode
 */
export function setModeColor(element, mode){
    element.style.color = window.getComputedStyle(element).getPropertyValue('--c-' + mode.color);
}
