<template>
    <editor-content :editor="editor" />
</template>

<script setup>
    import {
        ref,
        defineEmits,
    } from 'vue'
    import {
        useEditor,
        EditorContent,
    } from '@tiptap/vue-3'
    import {
        Extension
    } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'

    const emit = defineEmits(['fetchFormat'])
    const CustomExtension = Extension.create({
        name: "crowdsec",

        addKeyboardShortcuts() {
            return {
                "Mod-Enter": () => {
                    emit('fetchFormat', editor.value.getText({
                        blockSeparator: "\n"
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