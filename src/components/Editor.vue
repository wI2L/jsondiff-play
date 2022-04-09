<script setup lang="ts">
    import { onMounted, reactive, ref, watch } from 'vue'
    import { useStorage } from '@vueuse/core'

    import MonacoEditor from '@/components/MonacoEditor.vue'
    import OptionToggle from '@/components/OptionToggle.vue'
    import JSONTree from '@/components/JSONTree.vue'

    import Split from 'split.js'

    import source from '@/examples/source.json'
    import target from '@/examples/target.json'

    const content = reactive<{
        source: string
        target: string
    }>({
        source: JSON.stringify(source, null, 4),
        target: JSON.stringify(target, null, 4)
    })

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

    const patchObject = ref<any>()
    const patchErr = ref<string>('')

    function compare() {
        let result = jsondiffCompare(
            content.source,
            content.target,
            options.value.invertible,
            options.value.factorize,
            options.value.rationalize,
            options.value.equivalent
        )
        if (result.error) {
            patchErr.value = result.error
            patchObject.value = undefined
        } else {
            patchErr.value = ''
            patchObject.value = JSON.parse(result.patch)
        }
    }

    onMounted(() => {
        Split(['#content', '#output'], {
            snapOffset: 0,
            minSize: 750,
        })
        Split(['#editor-source', '#editor-target'], {
            direction: 'vertical',
            snapOffset: 0,
            minSize: 350,
        })
    })

    watch([content, options], () => {
        compare()
    }, {
        immediate: true,
        deep: true
    })
</script>

<template>
    <main class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-row h-full bg-[#fffffe] dark:bg-[#0e172a]">
            <div id="content" class="flex flex-col w-full">
                <div id="editor-source" class="w-full h-full border-0">
                    <MonacoEditor v-model="content.source" name="source" />
                </div>
                <div id="editor-target" class="w-full h-full border-0">
                    <MonacoEditor v-model="content.target" name="target" />
                </div>
            </div>
            <div id="output" class="flex flex-col font-sans">
                <div class="flex overflow-auto justify-end py-4 px-6 space-x-4 w-full h-[62px] text-sm dark:text-white border-b-2 border-b-[#eeeeed] dark:border-b-[#1f2834]">
                    <div class="flex items-center">
                        <label class="pr-2">Invertible
                            <OptionToggle v-model="options.invertible" />
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Factorize
                            <OptionToggle v-model="options.factorize" />
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Rationalize
                            <OptionToggle v-model="options.rationalize" />
                        </label>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Equivalent
                            <OptionToggle v-model="options.equivalent" />
                        </label>
                    </div>
                </div>
                <div class="overflow-auto w-full h-full scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-blue-100">
                    <div v-if="patchObject" class="py-8 px-12">
                        <JSONTree :data="patchObject" :max-depth="2" root-key="patch" />
                    </div>
                    <div
                        v-else-if="patchErr"
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
                                    <code>{{ patchErr }}</code>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<style lang="scss" scoped>
    main {
        height: calc(100vh - var(--nav-height));
    }
</style>

<style lang="scss">
    .gutter {
        &.gutter-horizontal {
            cursor: col-resize;
            position: relative;
            width: 16px;

            @apply border-x-2;
            @apply dark:border-x-[#1F2834];
            @apply border-x-[#eeeeed];

            &::before {
                border-left: 1px solid transparent;
                left: 50%;
                transform: translateX(-50%);
                height: 100%;
                content: "";
                position: absolute;
            }

            &::after {
                background-color: #94A3B8;

                @apply dark:bg-[#374151];

                width: 4px;
                height: 200px;
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-radius: 4px;
            }

            &:hover,
            &:active {
                &::before {
                    border-color: rgb(96 165 250);
                    transition: border-color 0.3s ease-in-out 0s;
                }

                &::after {
                    background-color: rgb(96 165 250) !important;
                    transition: background-color 0.3s ease-in-out 0s;
                }
            }
        }

        &.gutter-vertical {
            cursor: row-resize;
            position: relative;
            height: 16px;

            @apply border-y-2;
            @apply dark:border-y-[#1f2834];
            @apply border-y-[#eeeeed];

            &::before {
                border-top: 1px solid transparent;
                top: 50%;
                transform: translateY(-50%);
                width: 100%;
                content: "";
                position: absolute;
            }

            &::after {
                background-color: #94A3B8;

                @apply dark:bg-[#374151];

                height: 4px;
                width: 200px;
                content: "";
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                border-radius: 4px;
            }

            &:hover,
            &:active {
                &::before {
                    border-color: rgb(96 165 250);
                    transition: border-color 0.3s ease-in-out 0s;
                }

                &::after {
                    background-color: rgb(96 165 250) !important;
                    transition: background-color 0.3s ease-in-out 0s;
                }
            }
        }
    }
</style>
