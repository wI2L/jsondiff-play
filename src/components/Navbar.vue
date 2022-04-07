<script setup lang="ts">
    import { useToggle } from '@vueuse/shared'
    import useDarkGlobal from '../utils/dark'

    const isDark = useDarkGlobal()
    const toggleDark = useToggle(isDark)
</script>

<template>
    <nav class="bg-slate-200 dark:bg-gray-900 border-b border-b-slate-400 dark:border-b-[#374151]">
        <div class="px-6 py-4 mx-auto flex justify-between items-center h-full">
            <div class="flex items-center justify-between">
                <div>
                    <a class="text-lg font-['Lato'] font-semibold text-gray-900 dark:text-white" href="#">JSONDiff Playground</a>
                </div>
            </div>
            <div class="flex justify-center lg:flex lg:mt-0 lg:-mx-2">
                <a class="mx-2 relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" href="#" @click.prevent="toggleDark()">
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path v-if="isDark" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                        <path v-else d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
                    </svg>
                </a>
                <a class="mx-2 relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" href="https://github.com/wI2L/jsondiff-play" target="_blank">
                    <svg class="w-6 h-6 fill-current" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z" />
                    </svg>
                </a>
            </div>
        </div>
    </nav>
</template>

<style scoped>
nav {
    height: var(--nav-height);
}
</style>