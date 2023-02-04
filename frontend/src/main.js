import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import '/src/assets/wasm_exec.js'
const go = new Go();
const { instance } = await WebAssembly.instantiateStreaming(fetch(import.meta.env.PROD ? '/assets/ctt.wasm' : '/src/assets/ctt.wasm'), go.importObject)
go.run(instance);
createApp(App).use({
  install(app) {
    //Inject golang functions so we can inject later for ease
    app.provide("formatWrapper", window.formatWrapper)
  }
}).mount('#app')
