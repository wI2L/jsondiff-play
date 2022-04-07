import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import monaco from 'vite-plugin-monaco-editor'
import * as path from 'path'

export default defineConfig({
    plugins: [
        vue(),
        monaco({
            languageWorkers: ['json', 'editorWorkerService'],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        }
    }
})