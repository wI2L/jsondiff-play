import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monaco from 'vite-plugin-monaco-editor'
import { resolve } from 'path'

export default defineConfig({
    plugins: [
        vue(),
        monaco({
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
