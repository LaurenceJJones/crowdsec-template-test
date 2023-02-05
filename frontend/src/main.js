import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import '/src/assets/wasm_exec.js'

import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faGear, faQuestion, faXmark } from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faGear, faQuestion, faXmark)

const go = new Go();
WebAssembly.instantiateStreaming(fetch(import.meta.env.PROD ? '/assets/ctt.wasm' : '/src/assets/ctt.wasm'), go.importObject).then(({ instance }) => {
  go.run(instance);
  createApp(App).use({
    install(app) {
      //Inject golang functions so we can inject later for ease
      app.provide("formatWrapper", window.formatWrapper)
    }
  }).component('font-awesome-icon', FontAwesomeIcon).mount('#app')
})