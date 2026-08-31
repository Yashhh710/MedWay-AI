// MEDWAY AI — Common Layout Injector
// Adds the same sidebar, top navbar (with Back button + theme toggle) and
// footer used on explore.html to standalone detail pages (doctor / hospital
// pages) that live under /data/docter/ and /data/hospitals/.
// This script is safe to include from any page two folders deep from the
// project root (adjust ROOT below if used elsewhere).

(function () {
    var ROOT = '../../';

    function ensureCSS(href) {
        if (document.querySelector('link[href="' + href + '"]')) return;
        var link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        document.head.appendChild(link);
    }

    function ensureScript(src, cb) {
        var existing = document.querySelector('script[src="' + src + '"]');
        if (existing) { if (cb) cb(); return; }
        var s = document.createElement('script');
        s.src = src;
        if (cb) s.onload = cb;
        document.body.appendChild(s);
    }

    function goBack() {
        if (document.referrer && document.referrer.indexOf(window.location.host) !== -1) {
            history.back();
        } else {
            window.location.href = ROOT + 'explore.html';
        }
    }

    function sidebarHTML() {
        return '' +
        '<div class="sidebar pe-3 pb-3">' +
            '<nav class="navbar navbar-dark">' +
                '<div class="w-100">' +
                    '<a href="' + ROOT + 'index.html" class="navbar-brand mx-4 mb-1 d-flex align-items-center">' +
                        '<img src="https://img.icons8.com/?size=100&id=4aUvAATdDLe5&format=png&color=000000" alt="MEDWAY AI Logo" class="sidebar-brand-logo">' +
                        '<h3 class="text-primary mb-0">MEDWAY AI</h3>' +
                    '</a>' +
                    '<p class="text-muted small mx-4 mb-3" style="font-size: 0.75rem;">Healthcare, wherever you travel.</p>' +
                    '<div class="d-flex align-items-center ms-4 mb-4">' +
                        '<div class="position-relative">' +
                            '<img class="rounded-circle" src="' + ROOT + 'img/user.jpg" alt="" style="width: 40px; height: 40px;">' +
                            '<div class="bg-success rounded-circle border border-2 border-white position-absolute end-0 bottom-0 p-1"></div>' +
                        '</div>' +
                        '<div class="ms-3">' +
                            '<h6 class="mb-0 text-white">Jhon Doe</h6>' +
                            '<span class="text-muted">Admin</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="navbar-nav w-100">' +
                        '<div class="sidebar-section-title">MAIN</div>' +
                        '<a href="' + ROOT + 'index.html" class="nav-item nav-link">' +
                            '<img src="https://img.icons8.com/?size=100&id=1iF9PyJ2Thzo&format=png&color=000000" alt="Home Icon" class="nav-icon-img"><span class="nav-label">Home</span>' +
                        '</a>' +
                        '<a href="' + ROOT + 'explore.html" class="nav-item nav-link" data-nav="explore">' +
                            '<img src="https://img.icons8.com/?size=100&id=85961&format=png&color=000000" alt="Explore Icon" class="nav-icon-img"><span class="nav-label">Explore Healthcare</span>' +
                        '</a>' +
                        '<a href="' + ROOT + 'assistant.html" class="nav-item nav-link">' +
                            '<img src="https://img.icons8.com/?size=100&id=FSHNDH2JxIqv&format=png&color=000000" alt="AI Icon" class="nav-icon-img"><span class="nav-label">AI Assistant</span>' +
                        '</a>' +
                        '<div class="sidebar-section-title">TOOLS</div>' +
                        '<a href="' + ROOT + 'prescription.html" class="nav-item nav-link">' +
                            '<img src="https://img.icons8.com/?size=100&id=112400&format=png&color=000000" alt="Prescription Icon" class="nav-icon-img"><span class="nav-label">Prescription Reader</span>' +
                        '</a>' +
                        '<a href="' + ROOT + 'translator.html" class="nav-item nav-link">' +
                            '<img src="https://img.icons8.com/?size=100&id=OsD06LrQr6NQ&format=png&color=000000" alt="Translator Icon" class="nav-icon-img"><span class="nav-label">Live Translator</span>' +
                        '</a>' +
                        '<a href="' + ROOT + 'pharmacy.html" class="nav-item nav-link">' +
                            '<img src="https://img.icons8.com/?size=100&id=M7wxHhzIYL1S&format=png&color=000000" alt="Pharmacy Icon" class="nav-icon-img"><span class="nav-label">Pharmacy Finder</span>' +
                        '</a>' +
                        '<div class="sidebar-section-title">EMERGENCY</div>' +
                        '<a href="' + ROOT + 'emergency.html" class="nav-item nav-link fw-bold">' +
                            '<img src="https://img.icons8.com/?size=100&id=kRmlY0QWDXDB&format=png&color=000000" alt="Emergency Icon" class="nav-icon-img"><span class="nav-label">Emergency Help</span>' +
                        '</a>' +
                    '</div>' +
                '</div>' +
                '<div class="sidebar-bottom-section">' +
                    '<div class="sidebar-divider"></div>' +
                    '<div class="location-info-box">' +
                        '<span class="pulse-dot" id="location-dot"></span>' +
                        '<span id="current-location" class="location-text">Detecting Location...</span>' +
                    '</div>' +
                    '<a href="' + ROOT + 'settings.html" class="nav-item nav-link">' +
                        '<img src="https://img.icons8.com/?size=100&id=2969&format=png&color=000000" alt="Settings Icon" class="nav-icon-img"><span class="nav-label">Settings</span>' +
                    '</a>' +
                '</div>' +
            '</nav>' +
        '</div>';
    }

    function topbarHTML(pageTitle) {
        return '' +
        '<nav class="navbar navbar-expand navbar-dark sticky-top px-4 py-0">' +
            '<a href="' + ROOT + 'index.html" class="navbar-brand d-flex d-lg-none me-4">' +
                '<h2 class="text-primary mb-0"><i class="fa fa-user-edit"></i></h2>' +
            '</a>' +
            '<a href="#" class="sidebar-toggler flex-shrink-0">' +
                '<i class="fa fa-bars"></i>' +
            '</a>' +
            '<button type="button" id="medwayBackBtn" class="btn btn-sm btn-primary ms-4" style="border-radius: 50px; padding: 6px 16px;">' +
                '<i class="fa fa-arrow-left me-1"></i> Back' +
            '</button>' +
            '<span class="text-white ms-3 d-none d-md-inline fw-semibold">' + (pageTitle || '') + '</span>' +
            '<div class="navbar-nav align-items-center ms-auto">' +
                '<button type="button" class="theme-toggle-btn" id="medwayThemeToggleBtn" aria-label="Toggle light / dark theme" aria-pressed="false">' +
                    '<i class="fa fa-sun icon-sun"></i>' +
                    '<i class="fa fa-moon icon-moon"></i>' +
                '</button>' +
                '<div class="nav-item dropdown">' +
                    '<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">' +
                        '<i class="fa fa-bell me-lg-2"></i>' +
                        '<span class="d-none d-lg-inline-flex">Notification</span>' +
                    '</a>' +
                    '<div class="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">' +
                        '<a href="#" class="dropdown-item"><h6 class="fw-normal mb-0">Profile updated</h6><small>15 minutes ago</small></a>' +
                        '<hr class="dropdown-divider">' +
                        '<a href="#" class="dropdown-item"><h6 class="fw-normal mb-0">New user added</h6><small>15 minutes ago</small></a>' +
                        '<hr class="dropdown-divider">' +
                        '<a href="#" class="dropdown-item text-center">See all notifications</a>' +
                    '</div>' +
                '</div>' +
                '<div class="nav-item dropdown">' +
                    '<a href="#" class="nav-link dropdown-toggle" data-bs-toggle="dropdown">' +
                        '<img class="rounded-circle me-lg-2" src="' + ROOT + 'img/user.jpg" alt="" style="width: 40px; height: 40px;">' +
                        '<span class="d-none d-lg-inline-flex">John Doe</span>' +
                    '</a>' +
                    '<div class="dropdown-menu dropdown-menu-end bg-secondary border-0 rounded-0 rounded-bottom m-0">' +
                        '<a href="#" class="dropdown-item">My Profile</a>' +
                        '<a href="' + ROOT + 'settings.html" class="dropdown-item">Settings</a>' +
                        '<a href="#" class="dropdown-item">Log Out</a>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</nav>';
    }

    function footerHTML() {
        return '' +
        '<footer class="site-footer">' +
            '<div class="row">' +
                '<div class="col-12 col-sm-6 text-center text-sm-start">&copy; <a href="#">MEDWAY AI</a>, All Rights Reserved.</div>' +
                '<div class="col-12 col-sm-6 text-center text-sm-end">Designed By <a href="https://myprojects-yash.vercel.app/">Yash</a></div>' +
            '</div>' +
        '</footer>';
    }

    function init() {
        if (document.getElementById('medwayShell')) return; // avoid double-init

        var body = document.body;
        var pageTitle = document.title ? document.title.replace(/^MEDWAY AI\s*-\s*/i, '') : '';

        // Move all existing body content into an inner wrapper.
        var pageContent = document.createElement('div');
        pageContent.className = 'medway-page-content';
        while (body.firstChild) {
            pageContent.appendChild(body.firstChild);
        }

        var shell = document.createElement('div');
        shell.id = 'medwayShell';
        shell.className = 'container-fluid position-relative d-flex p-0';
        shell.innerHTML = sidebarHTML() + '<div class="content"></div>';

        var contentDiv = shell.querySelector('.content');
        contentDiv.insertAdjacentHTML('afterbegin', topbarHTML(pageTitle));
        contentDiv.appendChild(pageContent);
        contentDiv.insertAdjacentHTML('beforeend', footerHTML());

        body.appendChild(shell);

        var backToTop = document.createElement('a');
        backToTop.href = '#';
        backToTop.className = 'btn btn-lg btn-primary btn-lg-square back-to-top';
        backToTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
        shell.appendChild(backToTop);

        // Required styles for the injected layout.
        ensureCSS('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.10.0/css/all.min.css');
        ensureCSS('https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css');
        ensureCSS(ROOT + 'css/bootstrap.min.css');
        ensureCSS(ROOT + 'css/style.css');
        ensureCSS(ROOT + 'css/theme.css');
        ensureCSS(ROOT + 'css/common-layout.css');
        ensureCSS(ROOT + 'css/page-transitions.css');
        ensureScript(ROOT + 'js/page-transitions.js');

        // Apply the globally saved theme immediately (in case theme.js
        // hasn't run yet / isn't present on this page).
        var savedTheme = localStorage.getItem('medway-theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (document.body) document.body.setAttribute('data-theme', savedTheme);
        var initBg = savedTheme === 'light' ? '#f8fafc' : '#000000';
        document.documentElement.style.backgroundColor = initBg;
        if (document.body) document.body.style.backgroundColor = initBg;

        // Required scripts for the sidebar toggle / dropdowns / theme toggle.
        ensureScript('https://code.jquery.com/jquery-3.4.1.min.js', function () {
            ensureScript('https://cdn.jsdelivr.net/npm/bootstrap@5.0.0/dist/js/bootstrap.bundle.min.js', function () {
                ensureScript(ROOT + 'js/main.js');
                ensureScript(ROOT + 'js/auth.js');
            });
        });
        ensureScript(ROOT + 'js/theme.js');

        var backBtn = document.getElementById('medwayBackBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function (e) {
                e.preventDefault();
                goBack();
            });
        }

        // Global theme toggle: works standalone (does not depend on
        // js/theme.js having loaded / bound first), and stays in sync with
        // every other page via the shared 'medway-theme' localStorage key.
        function setGlobalTheme(theme) {
            localStorage.setItem('medway-theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
            if (document.body) document.body.setAttribute('data-theme', theme);
            var bg = theme === 'light' ? '#f8fafc' : '#000000';
            document.documentElement.style.backgroundColor = bg;
            if (document.body) document.body.style.backgroundColor = bg;
            document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
                btn.setAttribute('aria-pressed', String(theme === 'dark'));
                var sun = btn.querySelector('.icon-sun');
                var moon = btn.querySelector('.icon-moon');
                if (sun) sun.style.display = theme === 'light' ? '' : 'none';
                if (moon) moon.style.display = theme === 'dark' ? '' : 'none';
            });
        }
        window.medwayToggleTheme = function () {
            var current = localStorage.getItem('medway-theme') || 'light';
            setGlobalTheme(current === 'dark' ? 'light' : 'dark');
        };
        var themeBtn = document.getElementById('medwayThemeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.medwayToggleTheme();
            });
        }
        // Keep tabs in sync if the theme is changed on another page.
        window.addEventListener('storage', function (e) {
            if (e.key === 'medway-theme' && e.newValue) {
                setGlobalTheme(e.newValue);
            }
        });

        var backToTopBtn = shell.querySelector('.back-to-top');
        if (backToTopBtn) {
            backToTopBtn.addEventListener('click', function (e) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
