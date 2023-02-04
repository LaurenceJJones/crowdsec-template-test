<template>
    <editor-content :editor="editor" />
</template>

<script setup>
    import jsonData from '../assets/testData.json'
    import {
        useEditor,
        EditorContent,
    } from '@tiptap/vue-3'
    import {
        Extension
    } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'

    const emit = defineEmits(['format'])
    const CustomExtension = Extension.create({
        name: "crowdsec",

        addKeyboardShortcuts() {
            return {
                "Mod-Enter": () => {
                    emit('format', JSON.stringify({
                        "formatString" : editor.value.getText({ blockSeparator: "\n" }),
                        "alerts": jsonData
                    }))
                return true
                }
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