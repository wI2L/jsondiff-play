import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monaco from 'vite-plugin-monaco-editor'
import { resolve } from 'path'

// https://github.com/vdesjs/vite-plugin-monaco-editor/issues/21
const isObjectWithDefaultFunction = (module: unknown): module is { default: typeof monaco } => (
    module != null &&
    typeof module === 'object' &&
    'default' in module &&
    typeof module.default === 'function'
)

const monacoEditorPlugin = isObjectWithDefaultFunction(monaco)
    ? monaco.default
    : monaco

export default defineConfig({
    plugins: [
        vue(),
        monacoEditorPlugin({
            languageWorkers: ['json', 'editorWorkerService'],
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
    server: {
        host: true
    }
})