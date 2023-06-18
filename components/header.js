const shadowHtml = await fetch('/components/header.html').then((r) => r.text());

window.customElements.define(
    'vb-header', 
    class extends HTMLElement {
        constructor(){
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = shadowHtml;

            this.shadowRoot.querySelector('#title').textContent =
                this.getAttribute('title') ?? document.title;

            if(window.location.pathname == '/'){
                this.shadowRoot.querySelector('#home-link').remove();
            }
        }
    }
);
