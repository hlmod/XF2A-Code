var CMTV_Code = window.CMTV_Code || {};

((window, document) =>
{
    "use strict";

    // ############################## EXPAND ACTION ##############################

    CMTV_Code.CodeBlock_Expand = XF.Event.newHandler({
        eventNameSpace: 'CMTV_CodeCodeBlock_Expand',

        codeBlockH: null,
        
        init: function ()
        {
            this.codeBlockH = XF.Element.getHandler(this.target.closest('.bbCodeBlock--code'), 'CMTV-code-block');
        },
        
        click: function ()
        {
            this.codeBlockH.resizeButtons.expand.classList.add('action--hidden');
            this.codeBlockH.resizeButtons.collapse.classList.remove('action--hidden');

            const el = this.codeBlockH.codeContainer;
            const targetHeight = this.codeBlockH.maxHeight;
            const duration = 200;

            const startHeight = el.offsetHeight;
            const startTime = performance.now();

            function animateHeight(time)
            {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentHeight = startHeight + (targetHeight - startHeight) * progress;
                el.style.height = currentHeight + 'px';

                if (progress < 1)
                {
                    requestAnimationFrame(animateHeight);
                }
                else
                {
                    el.style.height = targetHeight + 'px';
                }
            }

            requestAnimationFrame(animateHeight);
        }
    });

    // ############################## COLLAPSE ACTION ##############################

    CMTV_Code.CodeBlock_Collapse = XF.Event.newHandler({
        eventNameSpace: 'CMTV_CodeCodeBlock_Collapse',
        
        codeBlockH: null,
        
        init: function ()
        {
            this.codeBlockH = XF.Element.getHandler(this.target.closest('.bbCodeBlock--code'), 'CMTV-code-block');
        },
        
        click: function ()
        {
            this.codeBlockH.resizeButtons.expand.classList.add('action--hidden');
            this.codeBlockH.resizeButtons.collapse.classList.remove('action--hidden');

            const el = this.codeBlockH.codeContainer;
            const targetHeight = this.codeBlockH.maxHeight;
            const duration = 200;

            const startHeight = el.offsetHeight;
            const startTime = performance.now();

            function animateHeight(time)
            {
                const elapsed = time - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const currentHeight = startHeight + (targetHeight - startHeight) * progress;
                el.style.height = currentHeight + 'px';

                if (progress < 1)
                {
                    requestAnimationFrame(animateHeight);
                }
                else
                {
                    el.style.height = targetHeight + 'px';
                }
            }

            requestAnimationFrame(animateHeight);
        }
    });

    // ############################## REGISTERING ##############################

    XF.Event.register('click', 'CMTV-code-block-expand', 'CMTV_Code.CodeBlock_Expand');
    XF.Event.register('click', 'CMTV-code-block-collapse', 'CMTV_Code.CodeBlock_Collapse');
})(window, document)