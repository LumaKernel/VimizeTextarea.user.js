// ==UserScript==
// @name         Vimize with CodeMirror
// @version      0.1
// @description  Make textarea CodeMirror by hitting ctrl+s
// @author       Luma
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/keymap/vim.min.js
// @resource     codemirrorCSS https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.54.0/codemirror.min.css
// ==/UserScript==

/* globals CodeMirror */

(function() {
    'use strict';
    document.querySelectorAll('textarea,input[type=text]').forEach(el => {
        const init = (ev) => {
            if (!(ev.key === 's' && ev.ctrlKey)) return;
            ev.preventDefault();
            el.removeEventListener('keydown', init);
            const styles = {};
            Array.from(getComputedStyle(el)).forEach(key => {
                styles[key] = getComputedStyle(el)[key];
            });

            const classList = el.classList
            const editor = CodeMirror.fromTextArea(el, {
                keyMap: 'vim',
            });
            const wrapper = editor.getWrapperElement()
            wrapper.classList.add(...classList);
            Object.entries(styles).forEach(([key, value]) => {
                try {
                    wrapper.style[key] = value;
                } finally {
                }
            });

            const evnames = "click mousedown mouseup focus blur keydown change dblclick mousemove mouseover mouseout mousewheel keydown keyup keypress textInput touchstart touchmove touchend touchcancel resize scroll zoom select change submit reset".split(" ");
            evnames.forEach(evname => {
                wrapper.addEventListener(evname, (ev) => {
                    const clonedEv = new Event(ev.type, ev);
                    el.dispatchEvent(clonedEv);
                });
            });
        };
        el.addEventListener('keydown', init);
    });
    const codemirrorCSS = GM_getResourceText("codemirrorCSS");
    GM_addStyle(codemirrorCSS);
})();
