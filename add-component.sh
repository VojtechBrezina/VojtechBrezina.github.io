#!/bin/sh

path=$1
name=$2

if [ ! -d $(dirname $path) ]; then mkdir $(dirname $path); fi

echo '@import url('"'/styles/base.css'"');' > "${path}.css"

echo '<style>@import url('"'/${path}.css'"');</style>' > "${path}".html

echo 'const shadowHtml = await fetch('"'/${path}.html'"').then(r => r.text());' > "${path}.js"
echo '' >> "${path}.js"
echo 'window.customElements.define(' >> "${path}.js"
echo '    '"'${name}'"',' >> "${path}.js"
echo '    class extends HTMLElement {' >> "${path}.js"
echo '        constructor(){' >> "${path}.js"
echo '            super();' >> "${path}.js"
echo '' >> "${path}.js"
echo '            this.attachShadow({ mode: '"'open'"' });' >> "${path}.js"
echo '            this.shadowRoot.innerHTML = shadowHtml;' >> "${path}.js"
echo '        }' >> "${path}.js"
echo '    }' >> "${path}.js"
echo ');' >> "${path}.js"

