<template>
    <div class="outline-dashed outline-1">
        <editor-content :editor="editor" />
        <div class="flex flex-row-reverse">
            <modal title="help">
                <template #activator="{ on }">
                    <button class="mx-2" @click="on(true)">
                        <font-awesome-icon icon="fa-solid fa-question" size="xl" />
                    </button>
                </template>
                <div>
                    Help body
                </div>
            </modal>
            <modal title="config">
                <template #activator="{ on }">
                    <button class="mx-2" @click="on(true)">
                        <font-awesome-icon icon="fa-solid fa-gear" size="xl" />
                    </button>
                </template>
                <div>
                    Config body
                </div>
            </modal>
            <button class="mx-2" @click="copy">
                <font-awesome-icon icon="fa-solid fa-clipboard" size="xl" />
            </button>
        </div>
    </div>
</template>

<script setup>
    import jsonData from '../assets/testData.json'
    import modal from './modal.vue'
    import {
        useEditor,
        EditorContent,
    } from '@tiptap/vue-3'
    import {
        Extension
    } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import { inject } from 'vue'
    const setError = inject("setError")
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
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-3 flex-none focus:outline-none max-h-48 overflow-y-scroll',
            },
        },
    })
    const copy = () => {
        try {
            navigator.clipboard.writeText(editor.value.getText())
        } catch (error) {
            setError("Could not copy value to clipboard")
        }
    }
</script>