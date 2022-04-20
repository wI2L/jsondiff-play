import { createApp } from 'vue'
import { useScriptTag } from "@vueuse/core"
import App from '@/App.vue'
import '@/assets/index.css'

if (!WebAssembly.instantiateStreaming) {
    WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer()
        return await WebAssembly.instantiate(source, importObject)
    }
}

const { load } = useScriptTag('/wasm_exec.js', undefined, { manual: true })

load(true).then(() => {
    const go = new Go()

    WebAssembly.instantiateStreaming(fetch('/jsondiff.wasm'), go.importObject).then(result => {
        go.run(result.instance)
        createApp(App).mount('#app')
    })
})