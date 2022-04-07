<script setup lang="ts">
    import { computed, ref, toRefs } from 'vue'
    import { TreeNode } from './@types/TreeNode'

    interface Props {
        data: TreeNode
        maxDepth?: number
    }

    const props = withDefaults(defineProps<Props>(), {
        maxDepth: 1,
    })
    const { data, maxDepth } = toRefs(props)
    const open = ref<boolean>(data.value.depth < maxDepth.value)

    const dataValue = computed(() => {
        if (typeof data.value.value === 'undefined') {
            return 'undefined'
        }
        return JSON.stringify(data.value.value)
    })

    function toggleOpen() {
        open.value = !open.value
    }

    function getKey(value: any) {
        if (!isNaN(value.key)) {
            return value.key + ':'
        } else {
            return '"' + value.key + '":'
        }
    }

    function getValueStyle(value: any) {
        const type = typeof value

        switch (type) {
        case 'string':
            return { color: 'var(--vjc-string-color)' }
        case 'number':
            return { color: 'var(--vjc-number-color)' }
        case 'boolean':
            return { color: 'var(--vjc-boolean-color)' }
        case 'object':
            return { color: 'var(--vjc-null-color)' }
        case 'undefined':
            return { color: 'var(--vjc-null-color)' }
        default:
            return { color: 'var(--vjc-valueKey-color)' }
        }
    }

</script>

<template>
    <div class="item">
        <div v-if="data.type === 'object' || data.type === 'array'" class="expendable">
            <button :aria-expanded="open ? 'true' : 'false'" class="data-key" @click.stop="toggleOpen">
                <span v-if="open" class="arrow">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" fill-rule="evenodd" />
                    </svg>
                </span>
                <span v-else class="arrow">
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path clip-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" fill-rule="evenodd" />
                    </svg>
                </span>
                <span class="key font-semibold">{{ data.key }}:</span>
                <span class="properties">[{{ data.length }}] (<span class="italic">{{ data.type }}</span>)</span>
            </button>
            <JSONViewItem v-for="child in data.children" v-show="open" :key="getKey(child)" :data="child" :max-depth="maxDepth" />
        </div>
        <div v-if="data.type === 'value'">
            <span class="value-key font-normal">{{ data.key }}</span>
            <span class="dark:text-white">:</span>
            <span v-if="data.key === 'op'">
                <span v-if="data.value === 'add'" class="align-middle ml-1 inline-flex items-center rounded-md bg-green-200 px-[6px] text-xs font-semibold text-green-700 h-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span class="pb-[1px]">{{ data.value }}</span>
                </span>
                <span v-if="data.value === 'remove'" class="align-middle ml-1 inline-flex items-center rounded-md bg-red-200 px-[6px] text-xs font-semibold text-red-700 h-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span class="pb-[1px]">{{ data.value }}</span>
                </span>
                <span v-if="data.value === 'replace'" class="align-middle ml-1 inline-flex items-center rounded-md bg-orange-200 px-[6px] text-xs font-semibold text-orange-700 h-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span class="pb-[1px]">{{ data.value }}</span>
                </span>
                <span v-if="data.value === 'test'" class="align-middle ml-1 inline-flex items-center rounded-md bg-purple-200 px-[6px] text-xs font-semibold text-purple-700 h-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="pb-[1px]">{{ data.value }}</span>
                </span>
                <span v-if="data.value === 'move'" class="align-middle ml-1 inline-flex items-center rounded-md bg-blue-200 px-[6px] text-xs font-semibold text-blue-700 h-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    <span class="pb-[1px]">{{ data.value }}</span>
                </span>
                <span v-if="data.value === 'copy'" class="align-middle ml-1 inline-flex items-center rounded-md bg-blue-200 px-[6px] text-xs font-semibold text-blue-700 h-[16px]">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-[3px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span class="pb-[1px]">{{ data.value }}</span>
                </span>
            </span>
            <span v-else class="value-val" :style="getValueStyle(data.value)">
                {{ dataValue }}
            </span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.item:not(.root) {
  margin-left: 35px;
  & > .expendable {
    margin-left: -16px;
  }
}

.value-key {
  color: var(--vjc-valueKey-color);
  white-space: nowrap;

  &.can-select {
    cursor: pointer;

    &:hover {
      background-color: rgba(0, 0, 0, 0.08);
    }

    &:focus {
      outline: 2px solid var(--vjc-hover-color);
    }
  }
}

.value-val {
  margin-left: 5px;
}

.data-key {
  font-size: 100%;
  font-family: inherit;
  border: 0;
  color: var(--vjc-key-color);
  display: flex;
  align-items: center;
  cursor: pointer;
  white-space: nowrap;

  &::-moz-focus-inner {
    border: 0;
  }

  .properties {
    font-weight: 300;
    opacity: 0.9;
    margin-left: 4px;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    font-size: 0.92em;
  }

  .arrow {
    margin-left: -5px;
    svg{
      display: inline-block;
    }
  }
}
</style>