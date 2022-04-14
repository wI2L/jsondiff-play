import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const textSmall = breakpoints.smaller('sm')
const textMedium = breakpoints.between('sm', 'lg')
const textLarge = breakpoints['lg']
const forceOneColLayout = breakpoints.smaller('md')
const wideScreen = breakpoints.greater('xl')

export {
    textSmall,
    textMedium,
    textLarge,
    forceOneColLayout,
    wideScreen
}