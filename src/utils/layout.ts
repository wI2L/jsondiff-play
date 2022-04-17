import { computed } from "vue"
import { createGlobalState, useEventBus, useStorage } from '@vueuse/core'
import { forceOneColLayout, wideScreen } from '@/utils/breakpoints'

export enum EditorLayout {
    OneCol,
    TwoCols,
    ThreeCols
}

function initialLayout(): EditorLayout {
    if (wideScreen.value) {
        return EditorLayout.ThreeCols
    } else if (forceOneColLayout.value) {
        return EditorLayout.OneCol
    }
    return EditorLayout.TwoCols
}

const source = useStorage<EditorLayout>('jsondiff-layout', initialLayout())

const value = computed({
    get: (): EditorLayout => {
        if (!(source.value in EditorLayout)) {
            return EditorLayout.TwoCols
        }
        return source.value
    },
    set: (value: EditorLayout) => {
        source.value = value
    }
})

export const useLayoutGlobal = createGlobalState(() => value)

export const layoutBus = useEventBus<boolean>("layout-bus")