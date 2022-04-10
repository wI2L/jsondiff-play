import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'

export const enum EditorLayout {
    TwoCols,
    ThreeCols
}

export const useLayoutGlobal = createGlobalState(() => {
    return ref<EditorLayout>(EditorLayout.TwoCols)
})