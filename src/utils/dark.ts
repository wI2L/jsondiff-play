import { createGlobalState, useDark } from '@vueuse/core'

const useDarkGlobal = createGlobalState(
    () => useDark({
        selector: 'html',
        attribute: 'class',
        valueDark: 'dark',
        valueLight: ''
    })
)

export default useDarkGlobal