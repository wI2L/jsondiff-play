<script lang="ts" setup>
    import { onMounted, ref, toRefs, watch } from "vue"
    import { useMagicKeys, useScroll, useStorage, useToggle, watchDebounced, whenever } from "@vueuse/core"

    import MonacoEditor from '@/components/MonacoEditor.vue'
    import OptionToggle from '@/components/OptionToggle.vue'
    import JSONTree from '@/components/JSONTree.vue'

    const props = defineProps<{
        source: string
        target: string
    }>()
    const { source, target } = toRefs(props)

    const options = useStorage<{
        factorize: boolean
        rationalize: boolean
        invertible: boolean
        equivalent: boolean
        lcs: boolean
    }>(
        'jsondiff-options',
        {
            factorize: false,
            rationalize: false,
            invertible: false,
            equivalent: false,
            lcs: false,
        }
    )

    const patchValue = ref<string>('')
    const patchObject = ref<any | undefined>(undefined)
    const patchError = ref<string | undefined>(undefined)

    function compare() {
        let result = jsondiffCompare(
            source.value,
            target.value,
            options.value.invertible,
            options.value.factorize,
            options.value.rationalize,
            options.value.equivalent,
            options.value.lcs,
        )
        if (result.error) {
            patchError.value = result.error
            patchObject.value = undefined
            patchValue.value = ''
        } else {
            patchError.value = undefined
            const obj = JSON.parse(result.patch)
            patchObject.value = obj
            patchValue.value = JSON.stringify(obj, null, 4)
        }
    }

    const treeView = ref<boolean>(false)
    const toggleTreeView = useToggle(treeView)

    const keys = useMagicKeys()

    whenever(keys.ctrl_v, () => {
        toggleTreeView()
    })

    const container = ref<HTMLElement | null>(null)
    const { arrivedState } = useScroll(container)
    const { top } = toRefs(arrivedState)

    onMounted(() => {
        watch(options, () => {
            compare()
        }, {
            immediate: true,
            deep: true
        })

        // Watch editors content with a debounce
        // to avoid too frequent patch updates.
        watchDebounced([source, target], () => {
            compare()
        }, {
            debounce: 500
        })
    })
</script>

<template>
    <div class="flex size-full flex-col">
        <div class="flex min-h-fit w-full shrink-0 flex-row items-center overflow-hidden border-b-2 border-b-[#eeeeed] px-6 py-4 text-xs dark:border-b-[#1f2834] dark:text-white mobile:justify-end mobile:space-x-4 mobile:space-y-0">
            <label class="text-center" title="Longest Common Subsequences">LCS
                <OptionToggle v-model="options.lcs" class="ml-1 align-middle" />
            </label>
            <label class="text-center">Invertible
                <OptionToggle v-model="options.invertible" class="ml-1 align-middle" />
            </label>
            <label class="text-center">Factorize
                <OptionToggle v-model="options.factorize" class="ml-1 align-middle" />
            </label>
            <label class="text-center">Rationalize
                <OptionToggle v-model="options.rationalize" class="ml-1 align-middle" />
            </label>
            <label class="text-center">Equivalent
                <OptionToggle v-model="options.equivalent" class="ml-1 align-middle" />
            </label>
        </div>
        <div
            ref="container"
            class="size-full overflow-auto text-xs scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-blue-100 sm:text-sm lg:text-base"
            :class="!top ? 'dark:[box-shadow:inset_#000000_0_6px_6px_-6px] [box-shadow:inset_#dddddd_0_6px_6px_-6px]' : ''">
            <div
                v-if="patchError"
                class="h-auto border-t-2 border-red-500 bg-gradient-to-b from-red-100 px-4 py-3 text-red-900 opacity-[.9] dark:from-[#374151] dark:text-white"
                role="alert">
                <div class="flex">
                    <div class="py-1">
                        <svg class="mr-5 size-6 fill-current text-red-500" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-bold">
                            An error has occurred
                        </p>
                        <p class="pb-6 pt-1 font-mono text-xs">
                            <code>{{ patchError }}</code>
                        </p>
                    </div>
                </div>
            </div>
            <div v-else class="size-full">
                <JSONTree v-if="treeView" :data="patchObject" :max-depth="2" root-key="patch" class="h-auto w-full p-6 sm:px-12 sm:py-8" />
                <MonacoEditor v-else v-model="patchValue" :read-only="true" class="overflow-hidden border-0" />
            </div>
        </div>
    </div>
</template>