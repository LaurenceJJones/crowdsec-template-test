<template>
    <div class="flex flex-col h-full">
        <editor-content :editor="editor" />
        <div class="w-screen overflow-y-scroll flex-1">
            <pre><code>{{ dataView }}</code></pre>
        </div>
    </div>
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
                "formatString": editor.value.getText({
                    blockSeparator: "\n"
                }),
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
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-3 outline-dashed outline-1 flex-none max-h-48 overflow-y-scroll',
            },
        },
    })
</script>