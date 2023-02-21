import { createApp, h } from "vue";
import "./index.css";
import "simplebar/dist/simplebar.min.css";
import App from "./App.vue";
import "/src/assets/wasm_exec.js";

import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
    faClipboard,
    faGear,
    faQuestion,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faGear, faQuestion, faXmark, faClipboard);
const notification = (message, opts = {}) => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    let timeOut = null;
    let toastApp = createApp({
        render() {
            return h(
                "div",
                {
                    class: "fixed bottom-0 right-0 m-4",
                },
                [
                    h(
                        "div",
                        {
                            class: `${
                                opts.error ? `bg-red-500` : `bg-blue-500`
                            } px-4 py-2 rounded-xl`,
                        },
                        message
                    ),
                ]
            );
        },
    });
    toastApp.mount(container);
    const remove = () => {
        if (!toastApp) return;
        clearTimeout(timeOut);
        toastApp.unmount();
        toastApp = undefined;
        document.body.removeChild(container);
    };
    timeOut = setTimeout(remove, opts.duration || 3000);
    return remove;
};
const preload = notification(
    h("div", [
        "Loading wasm module please wait....",
        h("div", {
            class: "mx-4 inline-block w-4 h-4 border-t-8 border-t-white-500 rounded-full animate-spin",
        }),
    ]),
    {
        duration: 1000000,
    }
);
const go = new Go();
WebAssembly.instantiateStreaming(
    fetch(import.meta.env.PROD ? "/assets/ctt.wasm" : "/src/assets/ctt.wasm"),
    go.importObject
).then(({ instance }) => {
    preload();
    go.run(instance);
    createApp(App)
        .use({
            install(app) {
                //Inject golang functions so we can inject later for ease
                app.provide("formatWrapper", window.formatWrapper);
                app.provide("notification", notification);
            },
        })
        .component("font-awesome-icon", FontAwesomeIcon)
        .mount("#app");
});
