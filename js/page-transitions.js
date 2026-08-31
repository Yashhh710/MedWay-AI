// MEDWAY AI — Smooth page transitions
// Fades the current page in once it is ready, and fades it out before
// following any internal link, so navigating between pages feels smooth
// instead of an abrupt flash-to-white/black reload.
(function () {
    "use strict";

    var EXIT_MS = 200;

    function showPage() {
        // Double rAF so the browser has painted the opacity:0 state first,
        // guaranteeing the fade-in transition actually runs.
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                document.body.classList.remove('mw-exit');
                document.body.classList.add('mw-ready');
            });
        });
    }

    if (document.body) {
        showPage();
    } else {
        document.addEventListener('DOMContentLoaded', showPage);
    }

    // If the page is restored from the back/forward cache, browsers can
    // skip re-running load logic — make sure it's visible immediately.
    window.addEventListener('pageshow', function (e) {
        if (e.persisted) {
            document.body.classList.remove('mw-exit');
            document.body.classList.add('mw-ready');
        }
    });

    function closest(el, selector) {
        while (el && el.nodeType === 1) {
            if (el.matches && el.matches(selector)) return el;
            el = el.parentNode;
        }
        return null;
    }

    function isTransitionable(link) {
        if (!link) return false;
        var rawHref = link.getAttribute('href');
        if (!rawHref || rawHref.indexOf('#') === 0) return false;
        if (/^(mailto:|tel:|javascript:)/i.test(rawHref)) return false;
        if (link.hasAttribute('download')) return false;
        if (link.hasAttribute('data-no-transition')) return false;
        if (link.target && link.target !== '' && link.target !== '_self') return false;
        if (link.origin !== window.location.origin) return false;
        return true;
    }

    document.addEventListener('click', function (e) {
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        var link = closest(e.target, 'a[href]');
        if (!isTransitionable(link)) return;

        var destination = link.href;
        if (destination === window.location.href) return;

        e.preventDefault();
        document.body.classList.remove('mw-ready');
        document.body.classList.add('mw-exit');

        window.setTimeout(function () {
            window.location.href = destination;
        }, EXIT_MS);
    }, true);

    // Safety net: if something goes wrong and the class never gets added
    // (e.g. this script errors before showPage runs), don't leave the
    // page permanently invisible.
    window.setTimeout(function () {
        if (document.body && !document.body.classList.contains('mw-ready')) {
            document.body.classList.add('mw-ready');
        }
    }, 1500);
})();
