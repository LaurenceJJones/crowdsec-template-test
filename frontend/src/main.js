import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import '/src/assets/wasm_exec.js'
const go = new Go();
WebAssembly.instantiateStreaming(fetch(import.meta.env.PROD ? '/assets/ctt.wasm' : '/src/assets/ctt.wasm'), go.importObject).then(result => {
  go.run(result.instance);
});
createApp(App).mount('#app')
