var CMTV_Code = window.CMTV_Code || {};

((window, document) =>
{
    "use strict";

    CMTV_Code.CodeBlock = XF.Element.newHandler({
        expand: null,
        collapse: null,
        codeContainer: null,
        pre: null,
        code: null,

        eCodeBlockH: null,
        resizerH: null,

        resizeButtons: {},

        maxHeight: null,
        minHeight: null,

        init: function ()
        {
            this.expand = this.target.querySelector('.action--expand');
            this.collapse = this.target.querySelector('.action--collapse');
            this.codeContainer = this.target.querySelector('.bbCodeBlock-content');
            this.pre = this.target.querySelector('pre');
            this.code = this.target.querySelector('code');

            this.eCodeBlockH = XF.Element.getHandler(this.pre, 'CMTV-code-block-extend');
            this.resizerH = XF.Element.getHandler(
                this.target.querySelector('[data-xf-init="CMTV-code-block-resizer"]'),
                'CMTV-code-block-resizer'
            );

            this.resizeButtons = {
                expand: this.expand,
                collapse: this.collapse
            };

            this.registerVisibleCatcher();
        },

        skipInit: false,
        visibleInit: function ()
        {
            if (this.target.offsetHeight <= 0)
            {
                return;
            }

            if (this.skipInit)
            {
                return;
            }

            //

            this.eCodeBlockH.init();

            if (this.getHeight(this.pre) > this.getHeight(this.codeContainer))
            {
                var scrollbarAdd = (this.getWidth(this.code) > this.getWidth(this.pre)) ? 15 : 0;

                this.maxHeight = this.getHeight(this.pre) + this.getPadding(this.codeContainer).vertical + scrollbarAdd;
                this.minHeight = this.getHeight(this.codeContainer, true);

                this.codeContainer.css({
                    height:         this.getHeight(this.codeContainer, true) + 'px',
                    'min-height':   this.minHeight + 'px',
                    'max-height':   this.maxHeight + 'px'
                });

                this.resizeButtons.expand.classList.remove('action--hidden');
                this.resizerH.visibleInit();
            }

            //

            this.skipInit = true;
        },

        registerVisibleCatcher: function ()
        {
            var hidden = null;
            var current = this.target.parentElement;

            while (current)
            {
                if (current.offsetParent === null)
                {
                    hidden = current;
                }

                current = current.parentElement;
            }

            if (hidden)
            {
                new MutationObserver(this.visibleInit.bind(this)).observe(hidden, { attributes: true });
            }
            else
            {
                this.visibleInit();
            }
        },

        // Heights

        getHeight: function (element, inner = false)
        {
            if (inner)
            {
                return element.clientHeight;
            }
            else
            {
                return element.offsetHeight;
            }
        },

        getWidth: function (element, inner = false)
        {
            if (inner)
            {
                return element.clientWidth;
            }
            else
            {
                return element.offsetWidth;
            }
        },

        getPadding: function ($element)
        {
            var vP = 0, hP = 0;

            vP = this.getHeight($element, true) - this.getHeight($element);
            hP = this.getWidth($element, true) - this.getWidth($element);

            return {
                vertical: vP,
                horizontal: hP
            }
        }
    });

    CMTV_Code.CodeBlockExtend = XF.extend(XF.CodeBlock, {
        __backup: {
            'init': '_init'
        },

        init: function ()
        {
            this._init();

            let code = this.target.querySelector('code');
            Prism.highlightElement(code);

            var preWidth = this.target.offsetWidth,
                codeWidth = code.offsetWidth,
                lineHighlight = this.target.querySelector('.line-highlight'),
                targetWidth = codeWidth + this.target.offsetWidth - preWidth;

            if (lineHighlight != null)
            {
                lineHighlight.style.minWidth = targetWidth + 'px';

                if (codeWidth > preWidth)
                {
                    lineHighlight.style.width = targetWidth + 'px';
                }
            }
        }
    });

    XF.Element.register('CMTV-code-block', 'CMTV_Code.CodeBlock');
    XF.Element.register('CMTV-code-block-extend', 'CMTV_Code.CodeBlockExtend');
})(window, document)