import { createApp } from 'vue'
import App from '@/App.vue'
import '@/assets/index.css'

const go = new Go()

WebAssembly.instantiateStreaming(fetch('/jsondiff.wasm'), go.importObject).then(result => {
    go.run(result.instance)
    createApp(App).mount('#app')
})