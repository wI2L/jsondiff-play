<script lang="ts" setup>
    import { onMounted, onUnmounted, ref, toRef, watch } from 'vue'
    import { useResizeObserver, useStorage } from '@vueuse/core'
    import useDarkGlobal from '@/utils/dark'
    import { textSmall, textMedium, textLarge } from '@/utils/breakpoints'

    import { editor as editorapi } from 'monaco-editor/esm/vs/editor/editor.api'
    import 'monaco-editor/esm/vs/language/json/monaco.contribution.js'

    const isDark = useDarkGlobal()
    const container = ref<HTMLDivElement | null>(null)

    let editor: editorapi.IStandaloneCodeEditor

    // The name property allows differentiating
    // between editors in the app. It is also used
    // as the key of the local storage element
    // that persist the current editor's value.
    const props = defineProps<{
        modelValue: string
        name?: string
        readOnly?: boolean
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', value: string): void
    }>()

    const storagePrefix = 'jsondiff-editor-'
    const content = !props.readOnly ? useStorage<string>(storagePrefix+props.name, props.modelValue) : toRef(props, 'modelValue')

    const observer = useResizeObserver(container, () => {
        editor.layout()
    })

    onMounted(() => {
        editor = editorapi.create(container.value!, {
            language: 'json',
            theme: isDark.value ? 'dark' : 'light',
            value: content.value,
            scrollBeyondLastLine: false,
            fontSize: 11,
            fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace',
            fontLigatures: false,
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
            readOnly: props.readOnly,
            domReadOnly: props.readOnly,
            minimap: {
                enabled: false,
            },
            scrollbar: {
                verticalScrollbarSize: 8,
                horizontalScrollbarSize: 8
            }
        })
        // Watch breakpoints to adjust the font size of the
        // editor. 'immediate' is used to ensure that we use
        // the right size on first render.
        watch(textSmall, () => {
            if (textSmall.value) {
                editor.updateOptions({ fontSize: 11 })
                editor.render(true)
            }
        },{ immediate: true })

        watch(textMedium, () => {
            if (textMedium.value) {
                editor.updateOptions({ fontSize: 12 })
                editor.render(true)
            }
        },{ immediate: true })

        watch(textLarge, () => {
            if (textLarge.value) {
                editor.updateOptions({ fontSize: 13 })
                editor.render(true)
            }
        },{ immediate: true })

        if (!props.readOnly) {
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
        } else {
            watch(content, () => {
                editor.setValue(content.value)
            })
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
    <div ref="container" class="size-full" />
</template>