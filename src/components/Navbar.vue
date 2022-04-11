<script lang="ts" setup>
    import { useToggle } from '@vueuse/shared'
    import useDarkGlobal from '@/utils/dark'
    import { useLayoutGlobal, EditorLayout } from '@/utils/layout'

    const isDark = useDarkGlobal()
    const toggleDark = useToggle(isDark)
    const layout = useLayoutGlobal()
</script>

<template>
    <nav class="bg-slate-200 dark:bg-gray-900 border-b border-b-slate-400 dark:border-b-[#374151]">
        <div class="flex justify-between items-center py-3 px-6 mx-auto h-full">
            <div class="flex justify-between items-center">
                <div>
                    <a class="font-lato text-lg font-semibold text-gray-900 dark:text-white">JSONDiff Playground</a>
                </div>
            </div>
            <div class="flex items-center mt-0">
                <div class="flex items-center px-1 ml-6 h-9 bg-gray-100 dark:bg-gray-800 rounded-md ring-1 ring-gray-300 dark:ring-gray-700">
                    <svg :class="layout === EditorLayout.TwoCols ? 'active' : 'inactive'" class="mx-1 w-6 h-5 cursor-pointer" stroke-width="1" @click.prevent="layout = EditorLayout.TwoCols">
                        <path d="M 3 11 H 3 V 5 a 2 2 0 0 1 2 -2 h 8 v 8 H 3 Z" />
                        <path d="M 3 11 H 3 V 11 h 10 v 8 H 5 a 2 2 0 0 1 -2 -2 Z" />
                        <path d="M12 3h9a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-9" fill="none" />
                    </svg>
                    <svg :class="layout === EditorLayout.ThreeCols ? 'active' : 'inactive'" class="mx-1 w-6 h-5 cursor-pointer" stroke-width="1" @click.prevent="layout = EditorLayout.ThreeCols">
                        <path d="M 9 3 h 6 v 16 h -6 M 3 17 V 5 a 2 2 0 0 1 2 -2 h 4 v 16 H 5 a 2 2 0 0 1 -2 -2 Z M 9 3" />
                        <path d="M 12 3 h 9 Z M 12 3 h 9 a 2 2 0 0 1 2 2 v 12 a 2 2 0 0 1 -2 2 h -9" fill="none" />
                    </svg>
                </div>
                <div class="mx-4 w-px h-6 bg-gray-300 dark:bg-gray-700" />
                <div class="flex items-center px-1 h-9 bg-gray-100 dark:bg-gray-800 rounded-md ring-1 ring-gray-300 dark:ring-gray-700">
                    <span class="mx-1 w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 cursor-pointer" @click.prevent="toggleDark()">
                        <svg v-if="isDark" class="w-full h-full" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke-linecap="round" stroke-linejoin="round" stroke-width="1" />
                        </svg>
                        <svg v-else class="w-full h-full" fill="none" preserveAspectRatio="xMidYMid meet" stroke="currentColor" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
                            <path d="M216.7 152.6A91.9 91.9 0 0 1 103.4 39.3a92 92 0 1 0 113.3 113.3Z" fill="currentColor" opacity=".2" />
                            <path d="M248 88a8 8 0 0 1-8 8h-16v16a8 8 0 0 1-16 0V96h-16a8 8 0 0 1 0-16h16V64a8 8 0 0 1 16 0v16h16a8 8 0 0 1 8 8Zm-96-40h8v8a8 8 0 0 0 16 0v-8h8a8 8 0 0 0 0-16h-8v-8a8 8 0 0 0-16 0v8h-8a8 8 0 0 0 0 16Zm72.3 102.1a7.9 7.9 0 0 1 0 4.8A100 100 0 1 1 101.1 31.7a7.8 7.8 0 0 1 5.2.2a8 8 0 0 1 5 7.9a5.7 5.7 0 0 1-.3 1.8A84 84 0 0 0 214.3 145l2.2-.4a8.2 8.2 0 0 1 7.8 5.5Zm-20 13.1A99.9 99.9 0 0 1 92.8 51.7a84 84 0 1 0 111.5 111.5Z" fill="currentColor" />
                        </svg>
                    </span>
                    <a class="mx-1 w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100" href="https://github.com/wI2L/jsondiff-play" target="_blank">
                        <svg class="w-full h-full" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.026 2C7.13295 1.99937 2.96183 5.54799 2.17842 10.3779C1.395 15.2079 4.23061 19.893 8.87302 21.439C9.37302 21.529 9.55202 21.222 9.55202 20.958C9.55202 20.721 9.54402 20.093 9.54102 19.258C6.76602 19.858 6.18002 17.92 6.18002 17.92C5.99733 17.317 5.60459 16.7993 5.07302 16.461C4.17302 15.842 5.14202 15.856 5.14202 15.856C5.78269 15.9438 6.34657 16.3235 6.66902 16.884C6.94195 17.3803 7.40177 17.747 7.94632 17.9026C8.49087 18.0583 9.07503 17.99 9.56902 17.713C9.61544 17.207 9.84055 16.7341 10.204 16.379C7.99002 16.128 5.66202 15.272 5.66202 11.449C5.64973 10.4602 6.01691 9.5043 6.68802 8.778C6.38437 7.91731 6.42013 6.97325 6.78802 6.138C6.78802 6.138 7.62502 5.869 9.53002 7.159C11.1639 6.71101 12.8882 6.71101 14.522 7.159C16.428 5.868 17.264 6.138 17.264 6.138C17.6336 6.97286 17.6694 7.91757 17.364 8.778C18.0376 9.50423 18.4045 10.4626 18.388 11.453C18.388 15.286 16.058 16.128 13.836 16.375C14.3153 16.8651 14.5612 17.5373 14.511 18.221C14.511 19.555 14.499 20.631 14.499 20.958C14.499 21.225 14.677 21.535 15.186 21.437C19.8265 19.8884 22.6591 15.203 21.874 10.3743C21.089 5.54565 16.9181 1.99888 12.026 2Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </nav>
</template>

<style scoped>
    nav {
        height: var(--nav-height);
    }

    .active {
        @apply fill-sky-200;
        @apply stroke-sky-600;
        @apply dark:fill-sky-800;
        @apply dark:stroke-sky-400;
    }

    .inactive {
        @apply fill-gray-200;
        @apply hover:fill-gray-300;
        @apply stroke-gray-400;
        @apply hover:stroke-gray-500;
        @apply dark:fill-gray-700;
        @apply dark:hover:fill-gray-600;
        @apply dark:stroke-gray-500;
        @apply dark:hover:stroke-gray-400;
    }
</style>
