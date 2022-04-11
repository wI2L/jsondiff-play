import { computed } from "vue"
import { createGlobalState, useStorage } from '@vueuse/core'

export const enum EditorLayout {
    OneCol,
    TwoCols,
    ThreeCols
}

const source = useStorage<EditorLayout>('jsondiff-layout', EditorLayout.TwoCols)

const value = computed({
    get() {
        if (!source.value || source.value < EditorLayout.OneCol || source.value > EditorLayout.ThreeCols) {
            return EditorLayout.TwoCols
        }
        return source.value
    },
    set(value: EditorLayout) {
        source.value = value
    },
})

export const useLayoutGlobal = createGlobalState(() => value)