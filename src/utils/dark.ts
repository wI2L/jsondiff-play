import { createGlobalState, useDark } from '@vueuse/core'

const useDarkGlobal = createGlobalState(() =>
    useDark({
        selector: 'html',
        attribute: 'class',
        valueDark: 'dark',
        valueLight: 'light',
    })
)

export default useDarkGlobal
