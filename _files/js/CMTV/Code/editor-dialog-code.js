((window, document) =>
{
    "use strict";

    XF.EditorDialogCode = XF.extend(XF.EditorDialogCode, {
        __backup: {
            '_init': '__init',
            'show': '_show'
        },

        CMTV_Code_switcherH: null,
        CMTV_Code_defaultLanguage: null,
        CMTV_Code_init: true,

        show: function (ed)
        {
            this._show(ed);

            if (!this.CMTV_Code_init)
            {
                this.setDefaultLanguage();
            }
        },

        afterShow: function (overlay) {},

        _init: function (overlay)
        {
            this.__init(overlay);

            var switcherAttr = '[data-xf-init="code-editor-switcher-container"]';
            var switcherAttrElement = overlay.container.querySelector(switcherAttr);

            this.CMTV_Code_switcherH = XF.Element.getHandler(switcherAttrElement, 'code-editor-switcher-container');
            this.CMTV_Code_defaultLanguage = document.getElementById('editor_code_type').value;
            this.CMTV_Code_init = false;

            XF.on(switcherAttrElement, 'code-editor:init', this.setDefaultLanguage.bind(this))
        },

        submit: function (e)
        {
            //
            // COPIED FROM editor.js !!!
            //

            e.preventDefault();

            const ed = this.ed;
            const overlay = this.overlay;

            const codeMirror = overlay.container.querySelector('.CodeMirror');
            if (codeMirror)
            {
                const instance = codeMirror.CodeMirror;
                const doc = instance.getDoc();

                instance.save();
                doc.setValue('');

                instance.setOption('mode', '');
            }

            const type = document.querySelector('#editor_code_type'),
                code = document.querySelector('#editor_code_code'),
                title = document.querySelector('#editor_code_title'),
                highlight = document.querySelector('#editor_code_title');

            ed.selection.restore();
            XF.EditorHelpers.insertCode(ed, type.value, code.value, {
                title: title.value.trim(),
                highlight: highlight.value.trim()
            });

            overlay.hide();

            code.value = '';
            type.value = this.CMTV_Code_defaultLanguage;
            title.value = '';
            highlight.value = '';
        },

        setDefaultLanguage: function ()
        {
            const codeEditor = this.overlay.container.querySelector('[data-xf-init="code-editor"]');
            codeEditor.setAttribute('data-lang', '');
            codeEditor.focus();

            this.CMTV_Code_switcherH.change();
        }
    });

    XF.EditorHelpers.insertCode = function (ed, type, code, extra)
    {
        //
        // COPIED FROM editor.js !!!
        //

        let tag;
        let lang;
        let output;

        switch (type.toLowerCase())
        {
            case '':
                tag = 'CODE';
                lang = '';
                break;
            default:
                tag = 'CODE';
                lang = type.toLowerCase();
                break;
        }

        code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                   .replace(/\t/g, '    ')
                   .replace(/\n /g, '\n&nbsp;')
                   .replace(/ {2}/g, '&nbsp; ')
                   .replace(/ {2}/g, ' &nbsp;') // need to do this twice to catch a situation where there are an odd number of spaces
                   .replace(/\n/g, '</p><p>');

        if (!extra.title && !extra.highlight)
        {
            output = '[' + tag + (lang ? '=' + lang : '') + ']' + code + '[/' + tag + ']';
        }
        else
        {
            output = '[' + tag + (lang ? ' lang="' + lang + '"' : '') + (extra.title ? ' title="' + extra.title + '"' : '') + (extra.highlight ? ' highlight="' + extra.highlight + '"' : '') + ']' + code + '[/' + tag + ']';
        }

        if (output.match(/<\/p>/i))
        {
            output = '<p>' + output + '</p>';
            output = output.replace(/<p><\/p>/g, '<p><br></p>');
        }

        ed.undo.saveStep();
        ed.html.insert(output);
        ed.undo.saveStep();

        XF.EditorHelpers.normalizeAfterInsert(ed);
    }
})(window, document)