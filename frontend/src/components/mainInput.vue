<template>
    <div class="outline-dashed outline-1 h-1/6">
        <editor-content :editor="editor" />
    </div>
    <div class="fixed top-0 right-0">
        <button class="mx-2" @click="copy">
            <font-awesome-icon icon="fa-solid fa-clipboard" size="xl" />
        </button>
        <modal title="config" @close="emit('modal', false)">
            <template #activator="{ on }">
                <button class="mx-2" @click="on(true); emit('modal', true)">
                    <font-awesome-icon icon="fa-solid fa-gear" size="xl" />
                </button>
            </template>
            <div class="flex flex-col">
                <editor-content :editor="jsonEditor" />
            </div>
        </modal>
        <modal title="help section" @close="emit('modal', false)">
            <template #activator="{ on }">
                <button class="mx-2" @click="on(true); emit('modal', true)">
                    <font-awesome-icon icon="fa-solid fa-question" size="xl" />
                </button>
            </template>
            <div class="text-2xl space-y-4">
                <p>Welcome to Crowdsec Template Tester (ctt) for short!</p>
                <p>Here you can test your template and see how it will look like!</p>
                <p>First, you can use the gear icon (<font-awesome-icon icon="fa-solid fa-gear" />) to configure the data or
                    use the default data!</p>
                <p>Then, you can use the editor to write your template, you can use the <a
                        href="https://golang.org/pkg/text/template/" target="_blank" rel="noopener noreferrer"
                        class="underline">golang template syntax</a></p>
                <p>Once you update the template it will by default run the templating process, you can confirm this by the
                    notifcation in the right hand corner</p>
                <p>Finally, you can use the copy button to copy the result of your template to your clipboard to paste
                    within your notification config.</p>
                <p>Made with &#10084;&#65039; from Laurence and the Crowdsec team!</p>
                <p>You can checkout the code via <a href="https://github.com/LaurenceJJones/crowdsec-template-test"
                        target="_blank" rel="noopener noreferrer" class="underline">github</a></p>
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
import { inject, ref, h } from 'vue'
const notification = inject("notification")
const format = inject("formatWrapper")
const emit = defineEmits(['format', 'modal'])
const localJson = ref(defaultJson)
let timeOut = null
let loading = null
const editor = useEditor({
    content: '{{range .}} {{. | toPrettyJson}} {{end}}',
    extensions: [
        StarterKit,
        Extension.create({
            name: "crowdsec",
            onCreate: () => {
                emit('format', format(JSON.stringify({ "formatString": '{{range .}} {{. | toPrettyJson}} {{end}}', "alerts": localJson.value })))
            },
            onUpdate: () => {
                if (!loading) {
                    loading = notification(h("div", ["Generating template", h("div", { class: "mx-4 inline-block w-4 h-4 border-t-8 border-t-white-500 rounded-full animate-spin" })]), {
                        duration: 10000
                    })
                }
                if (timeOut !== null) {
                    clearTimeout(timeOut)
                }
                timeOut = setTimeout(() => {
                    emit('format', format(JSON.stringify({
                        "formatString": editor.value.getText({ blockSeparator: "\n" }),
                        "alerts": localJson.value
                    })))
                    loading()
                    loading = null
                    timeOut = null
                }, 1000)
            },
        }),
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-3 flex-none focus:outline-none max-h-44 overflow-y-scroll',
        },
    },
})
const jsonEditor = useEditor({
    content: JSON.stringify(localJson.value[0], null, 2),
    extensions: [
        StarterKit,
        Extension.create({
            name: "json",
            onUpdate: () => {
                try {
                    if (Array.isArray(JSON.parse(jsonEditor.value.getText()))) {
                        localJson.value = JSON.parse(jsonEditor.value.getText())
                    } else {
                        localJson.value = [JSON.parse(jsonEditor.value.getText())]
                    }
                    emit('format', format(JSON.stringify({
                        "formatString": editor.value.getText({ blockSeparator: "" }),
                        "alerts": localJson.value
                    })))
                } catch (error) {
                    notification("Could not parse JSON", { error: true })
                }
            },
        }),
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl p-3 flex-none focus:outline-none',
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
