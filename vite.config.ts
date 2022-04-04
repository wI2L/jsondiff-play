import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monaco from 'vite-plugin-monaco-editor'

// noinspection JSUnusedGlobalSymbols
export default defineConfig({
    plugins: [
        vue(),
        monaco({
            languageWorkers: ['json', 'editorWorkerService'],
        }),
    ],
})