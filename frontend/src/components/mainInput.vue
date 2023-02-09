<template>
    <div class="outline-dashed outline-1 h-1/6">
        <editor-content :editor="editor" />
    </div>
    <div class="fixed top-0 right-0">
        <button class="mx-2" @click="copy">
            <font-awesome-icon icon="fa-solid fa-clipboard" size="xl" />
        </button>
        <modal title="config">
            <template #activator="{ on }">
                <button class="mx-2" @click="on(true)">
                    <font-awesome-icon icon="fa-solid fa-gear" size="xl" />
                </button>
            </template>
            <div class="flex flex-col">
                
            </div>
        </modal>
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
    </div>
</template>

<script setup>
    import defaultJson from '../assets/testData.json'
    import modal from './modal.vue'
    import {
        useEditor,
        EditorContent,
    } from '@tiptap/vue-3'
    import {
        Extension
    } from '@tiptap/core'
    import StarterKit from '@tiptap/starter-kit'
    import { inject, ref } from 'vue'
    const notification = inject("notification")
    const emit = defineEmits(['format'])
    const localJson = ref(defaultJson)
    const CustomExtension = Extension.create({
        name: "crowdsec",

        addKeyboardShortcuts() {
            return {
                "Mod-Enter": () => {
                    emit('format', JSON.stringify({
                        "formatString" : editor.value.getText({ blockSeparator: "\n" }),
                        "alerts": localJson.value
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
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-3 flex-none focus:outline-none max-h-44 overflow-y-scroll',
            },
        },
    })
    const copy = (opts = {}) => {
        try {
            navigator.clipboard.writeText(editor.value.getText(opts))
            notification("Copied to clipboard!")
        } catch (error) {
            notification("Could not copy value to clipboard", { error: true })
        }
    }
</script>