const shadowHtml = await fetch('/components/page.html').then((r) => r.text());

window.customElements.define(
    'vb-page', 
    class extends HTMLDivElement {
        constructor(){
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = shadowHtml;
        }
    },
    { extends: 'div' }
);
