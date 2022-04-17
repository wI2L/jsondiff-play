<script lang="ts" setup>
    import { reactive, watch } from 'vue'

    import Patch from '@/components/Patch.vue'
    import MonacoEditor from '@/components/MonacoEditor.vue'
    import { EditorLayout, useLayoutGlobal, layoutBus } from '@/utils/layout'
    import { forceOneColLayout, forceTwoColLayout } from "@/utils/breakpoints"

    import Split from 'split.js'

    import sourceJSON from '@/examples/source.json'
    import targetJSON from '@/examples/target.json'

    const content = reactive<{
        source: string
        target: string
    }>({
        source: JSON.stringify(sourceJSON, null, 4),
        target: JSON.stringify(targetJSON, null, 4)
    })

    // Custom directive to split the children of an
    // HTML element with split.js. The configuration
    // of the split is taken from the directive's
    // binding value, and MUST be an object.
    const vSplit = {
        mounted: (el: HTMLElement, binding: any) => {
            let ids = [...el.children].map(e => {
                return '#'+e.id
            })
            Split(ids, binding.value)
        }
    }
    const layout = useLayoutGlobal()

    let savedLayout = layout.value // initialize with default

    // Create an event handler to refresh the saved
    // layout every time the user manually changes it.
    layoutBus.on(() => {
        savedLayout = layout.value
    })

    watch([forceOneColLayout, forceTwoColLayout], ([n1, n2], [o1]) => {
        if (n1) {
            // Override saved layout only if it wasn't
            // already saved by the previous layout override.
            if (savedLayout !== EditorLayout.ThreeCols) {
                savedLayout = layout.value
            }
            layout.value = EditorLayout.OneCol
        } else if (n2) {
            if (!o1) {
                // If the previous layout was not forced to
                // one column, then we're shrinking, and we
                // save the current layout to restore it later.
                savedLayout = layout.value
            }
            // Do not force layout to two columns if the
            // current layout already fit while shrinking,
            // or if the saved layout is one column while
            // expanding.
            if ((!o1 && layout.value !== EditorLayout.OneCol) || (o1 && savedLayout != EditorLayout.OneCol)) {
                layout.value = EditorLayout.TwoCols
            }
        } else if (!n1 && !n2) {
            // Restore layout to what it was before override,
            // or to the latest user's selection.
            layout.value = savedLayout
        }
    }, { immediate: true })
</script>

<template>
    <main class="w-full h-full bg-[#fffffe] dark:bg-[#111A2D] border-t border-gray-200 dark:border-gray-700">
        <div v-if="layout === EditorLayout.OneCol" v-split="{direction:'vertical',sizes:[20,20,60],snapOffset:0}" class="flex flex-col w-full h-full">
            <MonacoEditor id="editor-source" v-model="content.source" name="source" class="w-full h-full border-0" />
            <MonacoEditor id="editor-target" v-model="content.target" name="target" class="w-full h-full border-0" />
            <Patch id="patch-1c" :source="content.source" :target="content.target" />
        </div>
        <div v-if="layout === EditorLayout.TwoCols" v-split="{direction:'horizontal',sizes:[50,50],minSize:325,snapOffset:0}" class="flex flex-row w-full h-full">
            <div id="split-editors-vertical" v-split="{direction:'vertical',sizes:[50,50]}" class="flex flex-col w-full h-full">
                <MonacoEditor id="editor-source-h" v-model="content.source" name="source" class="w-full h-full border-0" />
                <MonacoEditor id="editor-target-h" v-model="content.target" name="target" class="w-full h-full border-0" />
            </div>
            <Patch id="patch-2c" :source="content.source" :target="content.target" />
        </div>
        <div v-if="layout === EditorLayout.ThreeCols" v-split="{direction:'horizontal',sizes:[33,33,33],minSize:400,snapOffset:0}" class="flex flex-row w-full h-full">
            <MonacoEditor id="editor-source-v" v-model="content.source" name="source" class="w-full h-full border-0" />
            <MonacoEditor id="editor-target-v" v-model="content.target" name="target" class="w-full h-full border-0" />
            <Patch id="patch-3c" :source="content.source" :target="content.target" />
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
                @apply dark:bg-[#374151];

                background-color: #94A3B8;
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
                &::after {
                    background-color: rgb(96 165 250) !important;
                    transition: background-color 0.2s ease-in-out 0s;
                }
            }

            // Doesn't work on Firefox.
            // Split.js registers an event handler that
            // invoke preventDefault() when the gutter
            // is clicked. See the following discussion:
            // https://bugzilla.mozilla.org/show_bug.cgi?id=771241
            &:active,
            &:focus {
                &::before {
                    border-color: rgb(96 165 250);
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
                @apply dark:bg-[#374151];

                background-color: #94A3B8;
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
                &::after {
                    background-color: rgb(96 165 250) !important;
                    transition: background-color 0.2s ease-in-out 0s;
                }
            }

            &:active,
            &:focus,
            &:focus-within {
                &::before {
                    border-color: rgb(96 165 250);
                }
            }
        }
    }
</style>
