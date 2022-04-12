import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints(breakpointsTailwind)

const textSmall = breakpoints.smaller('sm')
const textMedium = breakpoints.between('sm', 'lg')
const textLarge = breakpoints['lg']
const forceOneCloLayout = breakpoints.smaller('md')

export {
    textSmall,
    textMedium,
    textLarge,
    forceOneCloLayout
}