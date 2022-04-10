<script lang="ts" setup>
    import { onMounted, ref, toRefs, watch } from "vue"
    import { useStorage, watchDebounced } from "@vueuse/core"

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
    }>(
        'jsondiff-options',
        {
            factorize: false,
            rationalize: false,
            invertible: false,
            equivalent: false
        }
    )

    const patchValue = ref<any>()
    const patchError = ref<string>('')

    function compare() {
        let result = jsondiffCompare(
            source.value,
            target.value,
            options.value.invertible,
            options.value.factorize,
            options.value.rationalize,
            options.value.equivalent
        )
        if (result.error) {
            patchError.value = result.error
            patchValue.value = undefined
        } else {
            patchError.value = ''
            patchValue.value = JSON.parse(result.patch)
        }
    }

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
    <div class="flex flex-col h-full">
        <div class="flex overflow-auto justify-end py-4 px-6 space-x-4 w-full min-h-[62px] text-sm dark:text-white border-b-2 border-b-[#eeeeed] dark:border-b-[#1f2834]">
            <div class="flex items-center">
                <label class="text-xs">Invertible
                    <OptionToggle v-model="options.invertible" class="ml-1" />
                </label>
            </div>
            <div class="flex items-center">
                <label class="text-xs">Factorize
                    <OptionToggle v-model="options.factorize" class="ml-1" />
                </label>
            </div>
            <div class="flex items-center">
                <label class="text-xs">Rationalize
                    <OptionToggle v-model="options.rationalize" class="ml-1" />
                </label>
            </div>
            <div class="flex items-center">
                <label class="text-xs">Equivalent
                    <OptionToggle v-model="options.equivalent" class="ml-1" />
                </label>
            </div>
        </div>
        <div class="overflow-auto w-full h-full scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-blue-100">
            <div v-if="patchValue" class="py-8 px-12 h-auto">
                <JSONTree :data="patchValue" :max-depth="2" root-key="patch" />
            </div>
            <div
                v-else-if="patchError"
                class="py-3 px-4 h-auto text-red-900 dark:text-white bg-gradient-to-b from-red-100 dark:from-[#374151] border-t-2 border-red-500 opacity-[.9]"
                role="alert">
                <div class="flex">
                    <div class="py-1">
                        <svg class="mr-5 w-6 h-6 text-red-500 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-bold">
                            An error has occurred
                        </p>
                        <p class="pt-1 pb-6 font-mono text-xs">
                            <code>{{ patchError }}</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>