<script setup lang="ts">
    import { computed, toRefs } from 'vue'
    import JSONViewItem from './JSONViewItem.vue'
    import { TreeNode } from './@types/TreeNode'

    interface Props {
        data: any
        rootKey?: string
        maxDepth?: number
        colorScheme?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        rootKey: 'root',
        maxDepth: 1,
        colorScheme: 'light'
    })
    const { data, rootKey, maxDepth, colorScheme } = toRefs(props)

    const parsed = computed(() => {
        if (typeof props.data === 'object') {
            return build(rootKey.value, data.value, 0, '', true) as TreeNode
        }
        return {
            key: props.rootKey,
            type: 'value',
            path: '',
            depth: 0,
            value: data.value
        } as TreeNode
    })

    function build(key: string, val: any, depth: number, path: string, includeKey: boolean): object {
        if (isObject(val)) {
            let children = []

            for (let [childKey, childValue] of Object.entries(val)) {
                children.push(build(childKey, childValue, depth + 1, includeKey ? `${path}${key}.` : `${path}`, true))
            }
            return {
                key: key,
                type: 'object',
                depth: depth,
                path: path,
                length: children.length,
                children: children
            } as TreeNode
        } else if (isArray(val)) {
            let children = []

            for (let i = 0; i < val.length; i++) {
                children.push(build(i.toString(), val[i], depth + 1, includeKey ? `${path}${key}[${i}].` : `${path}`, false))
            }
            return {
                key: key,
                type: 'array',
                depth: depth,
                path: path,
                length: children.length,
                children: children
            } as TreeNode
        } else {
            return {
                key: key,
                type: 'value',
                path: includeKey ? path + key : path.slice(0, -1),
                depth: depth,
                value: val
            } as TreeNode
        }
    }

    function isObject(val: any) {
        return typeof val === 'object' && val !== null && !isArray(val)
    }

    function isArray(val: any) {
        return Array.isArray(val)
    }
</script>

<template>
    <JSONViewItem :class="[{ 'root-item': true, dark: colorScheme === 'dark' }]" :data="parsed" :max-depth="maxDepth" />
</template>


<!--suppress CssUnusedSymbol -->
<style lang="scss" scoped>
.root-item {
    --vjc-key-color: #0977e6;
    --vjc-valueKey-color: #073642;
    --vjc-string-color: #268bd2;
    --vjc-number-color: #2aa198;
    --vjc-boolean-color: #cb4b16;
    --vjc-null-color: #6c71c4;
    --vjc-arrow-size: 6px;
    --vjc-arrow-color: #444;
    --vjc-hover-color: rgba(0, 0, 0, 0.2);
}

.root-item.dark {
    --vjc-key-color: #80d8ff;
    --vjc-valueKey-color: #fdf6e3;
    --vjc-hover-color: rgba(255, 255, 255, 0.2);
    --vjc-arrow-color: #fdf6e3;
}
</style>