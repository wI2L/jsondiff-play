<script setup lang="ts">
    import { ref, onMounted, watch, reactive } from 'vue'
    import { useDebounceFn } from '@vueuse/core'
    import { Switch } from '@headlessui/vue'

    import Split from 'split.js'
    import MonacoEditor from '@/components/MonacoEditor.vue'
    import JSONView from '@/components/JSONTree.vue'

    import source from '@/examples/source.json'
    import target from '@/examples/target.json'

    const sourceName = 'source'
    const targetName = 'target'

    const params = reactive<{
        source: string
        target: string
        factorize: boolean
        rationalize: boolean
        invertible: boolean
        equivalent: boolean
    }>({
        source: JSON.stringify(source),
        target: JSON.stringify(target),
        factorize: false,
        rationalize: false,
        invertible: false,
        equivalent: false,
    })

    const updateSource = useDebounceFn(
        (source: string): void => {
            params.source = source
        },
        500,
        { maxWait: 5000 }
    )

    const updateTarget = useDebounceFn(
        (target: string): void => {
            params.target = target
        },
        500,
        { maxWait: 5000 }
    )

    const patchObject = ref<any>()
    const patchErr = ref<string>('')

    watch(params, (v) => {
        let ret = jsondiffCompare(v.source, v.target, v.invertible, v.factorize, v.rationalize, v.equivalent)

        if (ret.error) {
            patchErr.value = ret.error
            patchObject.value = undefined
        } else {
            patchErr.value = ''
            patchObject.value = JSON.parse(ret.patch)
        }
    })

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
</script>

<template>
    <main class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-row h-full bg-[#fffffe] dark:bg-[#0e172a]">
            <div id="content" class="flex flex-col w-full">
                <div id="editor-source" class="w-full h-full border-0">
                    <MonacoEditor :default-value="source" :name="sourceName" @change="updateSource" />
                </div>
                <div id="editor-target" class="w-full h-full border-0">
                    <MonacoEditor :default-value="target" :name="targetName" @change="updateTarget" />
                </div>
            </div>
            <div id="output" class="flex flex-col font-sans">
                <div class="flex overflow-auto justify-end py-4 px-6 space-x-4 w-full h-[62px] text-sm dark:text-white border-b-2 border-b-[#eeeeed] dark:border-b-[#1f2834]">
                    <div class="flex items-center">
                        <label class="pr-2">Invertible</label>
                        <Switch v-model="params.invertible" :class="params.invertible ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center w-11 h-4 rounded-full">
                            <span class="sr-only">Invertible</span>
                            <span
                                :class="params.invertible ? 'translate-x-6' : 'translate-x-1'"
                                aria-hidden="true"
                                class="inline-block w-4 h-3 bg-white rounded-full transition duration-200 ease-in-out" />
                        </Switch>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Factorize</label>
                        <Switch v-model="params.factorize" :class="params.factorize ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center w-11 h-4 rounded-full">
                            <span class="sr-only">Factorize</span>
                            <span
                                :class="params.factorize ? 'translate-x-6' : 'translate-x-1'"
                                aria-hidden="true"
                                class="inline-block w-4 h-3 bg-white rounded-full transition duration-200 ease-in-out" />
                        </Switch>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Rationalize</label>
                        <Switch v-model="params.rationalize" :class="params.rationalize ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center w-11 h-4 rounded-full">
                            <span class="sr-only">Rationalize</span>
                            <span
                                :class="params.rationalize ? 'translate-x-6' : 'translate-x-1'"
                                aria-hidden="true"
                                class="inline-block w-4 h-3 bg-white rounded-full transition duration-200 ease-in-out" />
                        </Switch>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Equivalent</label>
                        <Switch v-model="params.equivalent" :class="params.equivalent ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center w-11 h-4 rounded-full">
                            <span class="sr-only">Equivalent</span>
                            <span
                                :class="params.equivalent ? 'translate-x-6' : 'translate-x-1'"
                                aria-hidden="true"
                                class="inline-block w-4 h-3 bg-white rounded-full transition duration-200 ease-in-out" />
                        </Switch>
                    </div>
                </div>
                <div
                    class="overflow-auto w-full h-full scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-track-gray-700 dark:scrollbar-thumb-blue-100">
                    <div v-if="patchObject" class="py-8 px-12">
                        <JSONView :data="patchObject" :max-depth="2" root-key="patch" />
                    </div>
                    <div
                        v-else-if="patchErr"
                        class="py-3 px-4 h-auto text-red-900 dark:text-white bg-gradient-to-b from-red-100 dark:from-[#374151] border-t-2 border-red-500 opacity-[.9]"
                        role="alert">
                        <div class="flex">
                            <div class="py-1">
                                <svg class="mr-5 w-6 h-6 text-red-500 fill-current" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
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
        background-repeat: no-repeat;
        background-position: 50%;

        &.gutter-horizontal {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
            cursor: col-resize;
            @apply border-x-2;
            @apply dark:border-x-[#1f2834];
            @apply border-x-[#eeeeed];
        }

        &.gutter-vertical {
            background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
            cursor: row-resize;
            @apply border-y-2;
            @apply dark:border-y-[#1f2834];
            @apply border-y-[#eeeeed];
        }
    }
</style>
