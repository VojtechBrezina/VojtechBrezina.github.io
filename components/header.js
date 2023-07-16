import * as Component from '/modules/components.js'

await Component.create(
    'vb-header',
    '/components/header.html',
    helper => class extends helper {
        constructor(){
            super();

            this.shadowRoot.querySelector('#title').textContent =
                this.getAttribute('title') ?? document.title;

            if(window.location.pathname == '/'){
                this.shadowRoot.querySelector('#home-link').remove();
            }
        }
    }
);
