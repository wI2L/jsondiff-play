<script setup lang="ts">
    import { computed, toRefs } from 'vue'
    import JSONTreeItem from '@/components/JSONTreeItem.vue'
    import TreeNode from '@/@types/TreeNode'

    interface Props {
        data: any
        rootKey?: string
        maxDepth?: number
    }

    const props = withDefaults(defineProps<Props>(), {
        rootKey: 'root',
        maxDepth: 1,
    })
    const { data, rootKey, maxDepth } = toRefs(props)

    const parsed = computed(() => {
        if (typeof props.data === 'object') {
            return build(rootKey.value, data.value, 0, '', true) as TreeNode
        }
        return {
            key: props.rootKey,
            type: 'value',
            path: '',
            depth: 0,
            value: data.value,
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
                children: children,
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
                children: children,
            } as TreeNode
        } else {
            return {
                key: key,
                type: 'value',
                path: includeKey ? path + key : path.slice(0, -1),
                depth: depth,
                value: val,
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
    <div class="json-tree">
        <JSONTreeItem :data="parsed" :max-depth="maxDepth" class="root" />
    </div>
</template>

<style lang="scss">
    :root {
        --vjc-key-color: #000;
        --vjc-value-key-color: #A31515;
        --vjc-string-color: #0451A5;
        --vjc-number-color: #098658;
        --vjc-boolean-color: #0451A5;
        --vjc-null-color: #0451A5;

        &.dark {
            --vjc-key-color: #DCDCDC;
            --vjc-value-key-color: #9CDCFE;
            --vjc-string-color: #CE9178;
            --vjc-number-color: #B5CEA8;
            --vjc-boolean-color: #CE9178;
            --vjc-null-color: #CE9178;
        }
    }
</style>
