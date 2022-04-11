<script lang="ts" setup>
    import { onBeforeMount, onMounted, onUnmounted, ref, watch } from 'vue'
    import { useResizeObserver, useStorage } from '@vueuse/core'
    import useDarkGlobal from '@/utils/dark'

    import { editor as editorapi } from 'monaco-editor/esm/vs/editor/editor.api'
    import 'monaco-editor/esm/vs/language/json/monaco.contribution.js'

    import darkTheme from '@/themes/dark.json'
    import lightTheme from '@/themes/light.json'

    const isDark = useDarkGlobal()
    const container = ref<HTMLDivElement | null>(null)

    let editor: editorapi.IStandaloneCodeEditor

    // The name property allows differentiating
    // between editors in the app. It is also used
    // as the key of the local storage element
    // that persist the current editor's value.
    const props = defineProps<{
        name: string
        modelValue: string
    }>()

    const storagePrefix = 'jsondiff-editor-'

    const content = useStorage<string>(storagePrefix+props.name, props.modelValue)

    const observer = useResizeObserver(container, () => {
        editor.layout()
    })

    const emit = defineEmits<{
        (e: 'update:modelValue', value: typeof content.value): void
    }>()

    onBeforeMount(() => {
        editorapi.defineTheme('dark', darkTheme as editorapi.IStandaloneThemeData)
        editorapi.defineTheme('light', lightTheme as editorapi.IStandaloneThemeData)
    })

    onMounted(() => {
        editor = editorapi.create(container.value!, {
            language: 'json',
            theme: isDark.value ? 'dark' : 'light',
            scrollBeyondLastLine: false,
            fontSize: 14,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
            fontLigatures: false,
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            minimap: {
                enabled: false,
            },
            scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8
            }
        })
        // Emit once the editor is created with the
        // current stored content, to allow the parent
        // to compute the patch once it has been mounted.
        emit('update:modelValue', content.value)

        // Initialize a debounced event handler that emit
        // the updated model value when the editor's
        // content is modified.
        editor.onDidChangeModelContent(() => {
            const currentValue = editor.getValue()!
            if (content.value !== currentValue) {
                content.value = currentValue
                emit('update:modelValue', content.value)
            }
        })

        // Set editor value on load.
        // This will either the initial default value
        // of the component or the value loaded from
        // local storage.
        if (content.value) {
            editor.setValue(content.value)
        }
    })

    onUnmounted(() => {
        editor?.dispose()
        observer.stop()
    })

    watch(isDark, (value) => {
        editorapi.setTheme(value ? 'dark' : 'light')
    })
</script>

<template>
    <div ref="container" class="h-full" />
</template>

<style>
    .monaco-editor * {
        border-style: none;
    }
</style>
