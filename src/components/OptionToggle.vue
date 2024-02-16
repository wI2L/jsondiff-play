<script lang="ts" setup>
    import { computed } from 'vue'
    import { Switch } from '@headlessui/vue'

    const props = defineProps<{
        modelValue: boolean
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', value: typeof props.modelValue): void
    }>()

    const value = computed<boolean>({
        get() {
            return props.modelValue
        },
        set(value) {
            emit('update:modelValue', value)
        }
    })
</script>

<template>
    <Switch v-model="value" :class="value ? 'bg-blue-400' : 'bg-[#5E697B]'" class="inline-flex h-3.5 w-10 items-center rounded-full align-text-bottom">
        <span
            :class="value ? 'translate-x-5' : 'translate-x-1'"
            aria-hidden="true"
            class="inline-block h-2 w-4 rounded-full bg-white transition duration-200 ease-in-out" />
    </Switch>
</template>