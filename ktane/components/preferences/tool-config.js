import * as Modes from '/ktane/modes.js';

const shadowHtml = await fetch('/ktane/components/preferences/tool-config.html').then(r => r.text());

window.customElements.define(
    'ktane-tool-config',
    class extends HTMLElement {
        /** @type {HTMLInputElement} */
        enableInputElement;

        constructor(){
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = shadowHtml;

            const titleElement = this.shadowRoot.querySelector('#title');
            titleElement.textContent = this.getAttribute('title');
            Modes.setModeColor(titleElement, this.getAttribute('mode') ?? 'default');

            this.enableInputElement = this.shadowRoot.querySelector('#enable-input');

        }
    }
);
