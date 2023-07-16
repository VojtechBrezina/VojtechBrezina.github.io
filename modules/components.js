/**
 * @callback ComponentLogic
 * @param {class extends HTMLElement} helper
 * @return {class extends HTMLElement}
 */

/**
 * @param {string} name
 * @param {string} template
 * @param {ComponentLogic} logic
 */
export async function create(name, template, logic){
    await fetch(template)
        .then((r) => r.text())
        .then((shadowHtml) => {
            window.customElements.define(
                name,
                logic(class extends HTMLElement {
                    constructor(){
                        super();

                        this.attachShadow({ mode: 'open' });
                        this.shadowRoot.innerHTML = shadowHtml;
                    }
                })
            )
        });
}
