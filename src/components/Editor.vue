<script lang="ts" setup>
    import { ref, onMounted, watch, reactive } from 'vue';
    import { useDebounceFn } from '@vueuse/core'
    import { useDarkGlobal } from '../utils/dark'
    import { Switch } from '@headlessui/vue'

    import Split from 'split.js'
    import MonacoEditor from './MonacoEditor.vue'
    import JSONView from './JSONView.vue'

    import source from '../examples/source.json'
    import target from '../examples/target.json'

    const isDark = useDarkGlobal()

    const sourceName = "source"
    const targetName = "target"

    const params = reactive<{
        source: string,
        target: string,
        factorize: boolean,
        rationalize: boolean,
        invertible: boolean,
        equivalent: boolean,
    }>({
        source: JSON.stringify(source),
        target: JSON.stringify(target),
        factorize: false,
        rationalize: false,
        invertible: false,
        equivalent: false,
    })

    const updateSource = useDebounceFn((source: string): void => {
        params.source = source
    }, 500, { maxWait: 5000 })

    const updateTarget = useDebounceFn((target: string): void => {
        params.target = target
    }, 500, { maxWait: 5000 })

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
            minSize: 750
        })
        Split(['#editor-source', '#editor-target'], {
            direction: 'vertical',
            snapOffset: 0,
            minSize: 350
        })

    })
</script>

<template>
    <main :class="isDark ? 'dark' : 'light'" class="border-t border-gray-200 dark:border-gray-700">
        <div class="flex flex-row h-full">
            <div id="content" class="flex flex-col w-full">
                <div id="editor-source" class="border-0 w-full h-full">
                    <MonacoEditor :default-value="source" :name="sourceName" @change="updateSource" />
                </div>
                <div id="editor-target" class="border-0 w-full h-full">
                    <MonacoEditor :default-value="target" :name="targetName" @change="updateTarget" />
                </div>
            </div>
            <div id="output" :class="isDark ? 'dark' : 'light'" class="flex flex-col">
                <div class="w-full px-6 py-4 flex justify-end space-x-4 text-sm dark:text-white h-[62px] overflow-auto border-b-2 dark:border-b-[#1f2834] border-b-[#eeeeed]">
                    <div class="flex items-center">
                        <label class="pr-2">Invertible</label>
                        <Switch v-model="params.invertible" :class="params.invertible ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center h-4 rounded-full w-11">
                            <span class="sr-only">Invertible</span>
                            <span aria-hidden="true" :class="params.invertible ? 'translate-x-6' : 'translate-x-1'" class="inline-block w-4 h-3 transform bg-white rounded-full transition duration-200 ease-in-out transform" />
                        </Switch>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Factorize</label>
                        <Switch v-model="params.factorize" :class="params.factorize ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center h-4 rounded-full w-11">
                            <span class="sr-only">Factorize</span>
                            <span aria-hidden="true" :class="params.factorize ? 'translate-x-6' : 'translate-x-1'" class="inline-block w-4 h-3 transform bg-white rounded-full transition duration-200 ease-in-out transform" />
                        </Switch>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Rationalize</label>
                        <Switch v-model="params.rationalize" :class="params.rationalize ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center h-4 rounded-full w-11">
                            <span class="sr-only">Rationalize</span>
                            <span aria-hidden="true" :class="params.rationalize ? 'translate-x-6' : 'translate-x-1'" class="inline-block w-4 h-3 transform bg-white rounded-full transition duration-200 ease-in-out transform" />
                        </Switch>
                    </div>
                    <div class="flex items-center">
                        <label class="pr-2">Equivalent</label>
                        <Switch v-model="params.equivalent" :class="params.equivalent ? 'bg-blue-400' : 'bg-[#515C6E]'" class="inline-flex items-center h-4 rounded-full w-11">
                            <span class="sr-only">Equivalent</span>
                            <span aria-hidden="true" :class="params.equivalent ? 'translate-x-6' : 'translate-x-1'" class="inline-block w-4 h-3 transform bg-white rounded-full transition duration-200 ease-in-out transform" />
                        </Switch>
                    </div>
                </div>
                <div class="h-full w-full overflow-auto scrollbar scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-200 dark:scrollbar-thumb-blue-100 dark:scrollbar-track-gray-700">
                    <div v-if="patchObject" class="px-12 py-8">
                        <JSONView :color-scheme="isDark ? 'dark' : 'light'" :data="patchObject" :max-depth="2" class="tree" root-key="patch" />
                    </div>
                    <div v-else-if="patchErr" class="bg-gradient-to-b from-red-100 dark:from-[#374151] border-t-2 border-red-500 text-red-900 dark:text-white h-auto px-4 py-3 opacity-[.9]" role="alert">
                        <div class="flex">
                            <div class="py-1">
                                <svg class="fill-current h-6 w-6 text-red-500 mr-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-bold">
                                    An error has occurred
                                </p>
                                <p class="text-sm font-mono pt-1 pb-6 text-xs">
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

<!--suppress CssUnusedSymbol -->
<style lang="scss">

main {
  height: calc(100vh - var(--nav-height));

  .gutter {
    @apply dark:bg-[#0e172a] bg-no-repeat;
    background-position: 50%;
  }

  .gutter.gutter-horizontal {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==');
    cursor: col-resize;
    @apply border-x-2;
    @apply dark:border-x-[#1f2834];
    @apply border-x-[#eeeeed];
  }

  .gutter.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
    cursor: row-resize;
    @apply border-y-2;
    @apply dark:border-y-[#1f2834];
    @apply border-y-[#eeeeed];
  }
}

#output {
  font-size: 1em;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "HelveticaNeue-Light", system-ui, "Ubuntu", "Droid Sans", sans-serif;

  &.dark {
    background-color: rgb(14, 23, 42);
    &.options {
      border-bottom: 1px solid #374151;
    }
  }

  &.light {
    background-color: rgb(255, 255, 254);
    &.options {
      border-bottom: 1px solid #000;
    }
  }
}
</style>

<!--suppress CssUnusedSymbol -->
<style lang="scss" scoped>
.tree {
  background-color: rgb(255, 255, 254);
  --vjc-key-color: #000000;
  --vjc-valueKey-color: #a31515;
  --vjc-string-color: #0451a5;
  --vjc-number-color: #098658;
  --vjc-boolean-color: #0451a5;
  --vjc-null-color: #0451a5;
}

.tree.dark {
  background-color: rgb(14, 23, 42);
  --vjc-key-color: #dcdcdc;
  --vjc-valueKey-color: #9cdcfe;
  --vjc-string-color: #ce9178;
  --vjc-number-color: #b5cea8;
  --vjc-boolean-color: #ce9178;
  --vjc-null-color: #ce9178;
}
</style>