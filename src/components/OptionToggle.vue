<script setup lang="ts">
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
    <Switch v-model="value" :class="value ? 'bg-blue-400' : 'bg-[#5E697B]'" class="inline-flex items-center w-11 h-4 align-middle rounded-full">
        <span
            :class="value ? 'translate-x-6' : 'translate-x-1'"
            aria-hidden="true"
            class="inline-block w-4 h-3 bg-white rounded-full transition duration-200 ease-in-out" />
    </Switch>
</template>