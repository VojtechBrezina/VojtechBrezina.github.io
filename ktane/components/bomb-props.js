import '/ktane/components/serial-number.js';

const shadowHtml = await fetch('/ktane/components/bomb-props.html').then(r => r.text());

window.customElements.define(
    'ktane-bomb-props',
    class extends HTMLElement {
        constructor(){
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = shadowHtml;
        }
    }
);
