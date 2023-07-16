import Preferences from '/ktane/preferences.js';
import '/ktane/components/preferences/tool-config.js';

const shadowHtml = await fetch('/ktane/components/preferences.html').then(r => r.text());

window.customElements.define(
    'ktane-preferences',
    class extends HTMLElement {
        /** @type {HTMLDialogElement} */
        dialog;

        /** @type {HTMLButtonElement} */
        closeButton;

        /** @type {Map<string, HTMLDivElement>} */
        sections;

        constructor(){
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = shadowHtml;

            this.dialog = this.shadowRoot.querySelector('#dialog');
            this.closeButton = this.shadowRoot.querySelector('#close');

            this.closeButton.addEventListener('click', () => this.dialog.close());

            this.shadowRoot.querySelectorAll('.item').forEach(item => {
                item.addEventListener('click', event => {
                    if(event.target.classList.contains('active'))
                        return;

                    this.shadowRoot.querySelector('#content > .active').classList.remove('active');
                    this.shadowRoot.querySelector('.active').classList.remove('active');

                    event.target.classList.add('active');
                    this.sections.get(event.target.dataset.tag).classList.add('active');
                })
            })

            this.sections = new Map();
            this.shadowRoot.querySelectorAll('#content > div').forEach(section => {
                this.sections.set(section.dataset.tag, section);
            });
            console.log(this.sections)

            this.sections.get(
                this.shadowRoot.querySelector('.item.active').dataset.tag
            ).classList.add('active');
        }

        open(){
            this.dialog.showModal();
        }
    }
);
