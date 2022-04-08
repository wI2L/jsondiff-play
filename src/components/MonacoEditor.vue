<script setup lang="ts">
    import { onBeforeMount, onMounted, onUnmounted, ref, toRefs, watch } from 'vue'
    import { useStorage, useDebounceFn, useResizeObserver } from '@vueuse/core'
    import useDarkGlobal from '@/utils/dark'

    import { editor as editorapi } from 'monaco-editor/esm/vs/editor/editor.api'
    import 'monaco-editor/esm/vs/language/json/monaco.contribution.js'
    import nightOwl from '@/themes/night-owl.json'

    const isDark = useDarkGlobal()
    const container = ref<HTMLDivElement | null>(null)

    // Declare editor properties.
    // The 'name' property allows differentiating between
    // editors in the app, either "source" or "target".
    const props = defineProps<{
        name: string
        defaultValue: object | []
    }>()

    const { name, defaultValue } = toRefs(props)

    let editor: editorapi.IStandaloneCodeEditor

    const editorContent = useStorage<string>(name.value, JSON.stringify(defaultValue.value, null, 4))
    const editorObserver = useResizeObserver(container, () => {
        editor.layout()
    })
    const emit = defineEmits<(e: 'change', content: typeof editorContent.value) => void>()

    onBeforeMount(() => {
        editorapi.defineTheme('night-owl', nightOwl as editorapi.IStandaloneThemeData)
    })

    onMounted(() => {
        editor = editorapi.create(container.value!, {
            language: 'json',
            theme: isDark.value ? 'night-owl' : 'vs',
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
            fontLigatures: false,
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            minimap: {
                enabled: false,
            },
        })
        emit('change', editorContent.value)

        editor.onDidChangeModelContent(
            useDebounceFn(() => {
                if (editorContent.value !== editor.getValue()!) {
                    editorContent.value = editor.getValue()!
                    emit('change', editorContent.value)
                }
            }, 500)
        )
        // Set values from storage on load.
        if (editorContent.value) {
            editor.setValue(editorContent.value)
        }
    })

    watch(isDark, (value) => {
        editorapi.setTheme(value ? 'night-owl' : 'vs')
    })

    onUnmounted(() => {
        editor?.dispose()
        editorObserver.stop()
    })
</script>

<template>
    <div ref="container" style="height: 100%" />
</template>
