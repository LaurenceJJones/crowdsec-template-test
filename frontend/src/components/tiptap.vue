<template>
    <editor-content :editor="editor" />
    <pre><code>{{ dataView }}</code></pre>
</template>

<script setup>
    import {
        ref
    } from 'vue'
    import {
        useEditor,
        EditorContent
    } from '@tiptap/vue-3'
    import {
        Extension
    } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import jsonData from '../assets/testData.json'
    let dataView = ref("")
    const fetchFormat = async () => {
        const res = await fetch("/api/v1/format", {
            body: JSON.stringify({
                "formatString": editor.value.getText(),
                "alerts": jsonData
            }),
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST"
        })
        dataView.value = await res.text()
    }
    const CustomExtension = Extension.create({
        name: "crowdsec",

        addKeyboardShortcuts() {
            return {
                "Mod-Enter": fetchFormat
            }
        }
    })

    const editor = useEditor({
        content: '{{range .}} {{. | toPrettyJson}} {{end}}',
        extensions: [
            StarterKit,
            CustomExtension,
        ],
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-3 outline outline-offset-2 outline-blue-300',
            },
        },
    })
</script>