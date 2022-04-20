<script lang="ts" setup>
    import { editor as editorapi } from 'monaco-editor/esm/vs/editor/editor.api'

    import Navbar from '@/components/Navbar.vue'
    import Editor from '@/components/Editor.vue'

    import darkTheme from '@/themes/dark.json'
    import lightTheme from '@/themes/light.json'

    editorapi.defineTheme('dark', darkTheme as editorapi.IStandaloneThemeData)
    editorapi.defineTheme('light', lightTheme as editorapi.IStandaloneThemeData)
</script>

<template>
    <Navbar />
    <Editor />
</template>
