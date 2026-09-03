// Loaded by every exercise page. Does nothing unless the page is embedded
// inside mix.html (Mix & Match), in which case the host owns the header,
// score and Finish button, and this script reports each answer to it.
(() => {
    const params = new URLSearchParams(window.location.search);
    const embedded = params.get('mix') === '1' && window.self !== window.top;
    if (!embedded) return;

    // Flag the document before the body renders so the page's own header
    // never flashes into view.
    document.documentElement.classList.add('mix-embedded');

    const post = (msg) => {
        try { window.parent.postMessage(msg, '*'); } catch (e) {}
    };

    document.addEventListener('DOMContentLoaded', () => {
        // Defer one tick so the page's own init has filled in its labels.
        setTimeout(() => {
            const answeredEl = document.getElementById('questionsAnswered');
            const correctEl  = document.getElementById('questionscorrect');
            const modeEl     = document.getElementById('modeIndicator');

            post({ type: 'mix:ready', label: modeEl ? modeEl.textContent : '' });
            if (!answeredEl || !correctEl) return;

            // Every page bumps these two counters when a question is answered,
            // so watching them is a page-agnostic "answered" signal.
            let lastAnswered = parseInt(answeredEl.textContent) || 0;
            let lastCorrect  = parseInt(correctEl.textContent)  || 0;

            const observer = new MutationObserver(() => {
                const answered = parseInt(answeredEl.textContent) || 0;
                const correct  = parseInt(correctEl.textContent)  || 0;
                if (answered > lastAnswered) {
                    post({ type: 'mix:answered', correct: correct > lastCorrect });
                }
                lastAnswered = answered;
                lastCorrect  = correct;
            });
            [answeredEl, correctEl].forEach(el =>
                observer.observe(el, { childList: true, characterData: true, subtree: true })
            );
        }, 0);
    });
})();
