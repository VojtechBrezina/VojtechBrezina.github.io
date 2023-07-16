const shadowHtml = await fetch('/ktane/components/serial-number.html').then(r => r.text());

window.customElements.define(
    'ktane-serial-number',
    class extends HTMLElement {
        /** @type {HTMLInputElement} */
        inputElement;

        /** @type {HTMLSpanElement} */
        displayElement;

        /** @type {string} */
        value;

        constructor(){
            super();

            this.attachShadow({ mode: 'open' });
            this.shadowRoot.innerHTML = shadowHtml;

            this.inputElement = this.shadowRoot.querySelector('#input');
            this.displayElement = this.shadowRoot.querySelector('#display');

            this.inputElement.style.display = 'none';

            this.displayElement.addEventListener('click', () => {
                this.inputElement.style.display = null;
                this.displayElement.style.display = 'none';
                this.inputElement.setSelectionRange(
                    this.inputElement.value.length,
                    this.inputElement.value.length
                );
                this.inputElement.focus();
                this.updateSize();
            });

            this.inputElement.addEventListener('keyup', ({key}) => {
                if(key == 'Enter')
                    this.inputElement.blur();
            });

            this.inputElement.addEventListener('blur', () => {
                this.inputElement.style.display = 'none';
                this.displayElement.style.display = null;
                this.setValue(this.inputElement.value);
            });

            this.inputElement.addEventListener('input', () => this.updateSize());
        }

        updateSize(){
            this.inputElement.style.width = 0;
            this.inputElement.style.width = `${Math.max(50, this.inputElement.scrollWidth)}px`;
        }

        /**
         * @param {string} newValue
         */
        setValue(newValue){

            this.value = '';
            this.displayElement.textContent = '';

            let pos = 0;
            const insertDash = () => {
                if(pos && !(pos % 3)){
                    const dash = document.createElement('span');
                    this.displayElement.appendChild(dash);
                    dash.textContent = '-';
                    dash.style.color = getComputedStyle(dash).getPropertyValue('--c-dim');
                }
                pos++;
            }

            for(let i = 0; i < newValue.length; i++){
                if(newValue.charAt(i).match(/[a-z]|[A-Z]/)){
                    insertDash();
                    this.value += newValue.charAt(i).toUpperCase();
                    const colored = document.createElement('span');
                    this.displayElement.appendChild(colored);
                    colored.textContent = newValue.charAt(i).toUpperCase();
                    colored.style.color = getComputedStyle(colored).getPropertyValue('--c-white');
                } else if(newValue.charAt(i).match(/[0-9]/)){
                    insertDash();
                    const colored = document.createElement('span');
                    this.value += newValue.charAt(i);
                    this.displayElement.appendChild(colored);
                    colored.textContent = newValue.charAt(i);
                    colored.style.color = getComputedStyle(colored).getPropertyValue('--c-cyan');
                }
            }

            this.inputElement.value = this.displayElement.textContent;
            if(!this.displayElement.textContent.length)
                this.displayElement.textContent = ' ';
        }

        static get observedAttributes() { return ['value']; }
        attributeChangedCallback(name, _oldValue, newValue){
            switch(name){
                case 'value': this.setValue(newValue); break;
            }
        }
    }
);
