var CMTV_Code = window.CMTV_Code || {};

((window, document) =>
{
    "use strict";

    CMTV_Code.CodeBlock_Resizer = XF.Element.newHandler({
        codeBlockH: null,

        gripPos: null,

        init: function ()
        {
            this.codeBlockH = XF.Element.getHandler(this.target.closest('.bbCodeBlock--code'), 'CMTV-code-block');
        },

        visibleInit: function ()
        {
            this.target.classList.remove('resizer--hidden');

            XF.on(this.target, 'mousedown', this.onResizeBegin.bind(this));
            XF.on(this.target, 'touchstart', this.onResizeBegin.bind(this));
        },

        onResizeBegin: function (e)
        {
            document.body.classList.add('CMTV_Code_resizing');

            const cursorY = this.getCursorPos(e);

            const container = this.codeBlockH.codeContainer;
            const containerRect = container.getBoundingClientRect();
            const containerTop = containerRect.top + window.scrollY;
            const containerHeight = container.offsetHeight;

            this.gripPos = cursorY - containerTop - containerHeight;

            window.addEventListener('mousemove', this, false);
            window.addEventListener('mouseup', this, false);

            window.addEventListener('touchmove', this, { passive: false });
            window.addEventListener('touchend', this, { passive: false });
        },

        onResizeMove: function (e)
        {
            e.preventDefault();

            var cursorY = this.getCursorPos(e);

            this.codeBlockH.$codeContainer.css('height', cursorY - this.codeBlockH.$codeContainer.offset().top - this.gripPos + 'px');
        },

        handleEvent: function (e)
        {
            switch (e.type)
            {
                case 'mousemove':
                case 'touchmove':
                    this.onResizeMove(e);
                    break;

                case 'mouseup':
                case 'touchend':
                    document.body.classList.remove('CMTV_Code_resizing');

                    window.removeEventListener('mousemove', this, false);
                    window.removeEventListener('mouseup', this, false);

                    window.removeEventListener('touchmove', this, { passive: false });
                    window.removeEventListener('touchend', this, { passive: false });

                    if (this.codeBlockH.getHeight(this.codeBlockH.$codeContainer) > this.codeBlockH.minHeight)
                    {
                        this.codeBlockH.resizeButtons.$collapse.removeClass('action--hidden');
                    }
                    else
                    {
                        this.codeBlockH.resizeButtons.$collapse.addClass('action--hidden');
                    }

                    if (this.codeBlockH.getHeight(this.codeBlockH.$codeContainer, true) < this.codeBlockH.maxHeight)
                    {
                        this.codeBlockH.resizeButtons.$expand.removeClass('action--hidden');
                    }
                    else
                    {

                        this.codeBlockH.resizeButtons.$expand.addClass('action--hidden');
                    }

                    break;
            }
        },

        getCursorPos: function (e)
        {
            return (['mousedown', 'mousemove'].includes(e.type)) ? e.pageY : e.touches[0].pageY;
        }
    });

    XF.Element.register('CMTV-code-block-resizer', 'CMTV_Code.CodeBlock_Resizer');
})(window, document)