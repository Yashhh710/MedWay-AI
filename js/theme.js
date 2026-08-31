// MEDWAY AI — Theme toggle (light/dark), persisted in localStorage ("medway-theme").
(function () {
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        try {
            var bg = theme === 'dark' ? '#000000' : (document.getElementById('medwayShell') ? '#f8fafc' : '#eef0f3');
            document.documentElement.style.backgroundColor = bg;
            if (document.body) {
                document.body.style.backgroundColor = bg;
            }
        } catch (e) {
            // ignore
        }
    }

    function currentTheme() {
        return localStorage.getItem('medway-theme') || 'light';
    }

    function setTheme(theme) {
        localStorage.setItem('medway-theme', theme);
        applyTheme(theme);
        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            btn.setAttribute('aria-pressed', String(theme === 'dark'));
            const sun = btn.querySelector('.icon-sun');
            const moon = btn.querySelector('.icon-moon');
            if (sun) sun.style.display = theme === 'light' ? '' : 'none';
            if (moon) moon.style.display = theme === 'dark' ? '' : 'none';
        });
    }

    function toggleTheme() {
        setTheme(currentTheme() === 'dark' ? 'light' : 'dark');
    }

    window.medwayToggleTheme = toggleTheme;

    // Accent color handling
    function hexToRgb(hex){
        hex = (hex||'').replace('#','');
        if (hex.length===3) hex = hex.split('').map(h=>h+h).join('');
        const num = parseInt(hex,16) || 0;
        return { r: (num>>16)&255, g:(num>>8)&255, b:num&255 };
    }
    function mixWithWhite(hex, pct){
        const c = hexToRgb(hex);
        const r = Math.round(c.r + (255 - c.r) * pct);
        const g = Math.round(c.g + (255 - c.g) * pct);
        const b = Math.round(c.b + (255 - c.b) * pct);
        return '#' + [r,g,b].map(x=>x.toString(16).padStart(2,'0')).join('');
    }
    function applyAccent(hex){
        if (!hex) return;
        try{
            const accent2 = mixWithWhite(hex,0.45);
            document.documentElement.style.setProperty('--accent', hex);
            document.documentElement.style.setProperty('--accent-2', accent2);

            // Inject a small stylesheet to theme common Bootstrap classes so accent applies broadly
            const id = 'medway-accent-style';
            let s = document.getElementById(id);
            const darker = '#cc0000';
            const accentText = '#ffffff';
            const styleContent = `
                .text-primary { color: ${hex} !important; }
                .text-primary a { color: ${hex} !important; }
                .bg-primary, .badge.bg-primary { background-color: ${hex} !important; color: ${accentText} !important; }
                .btn-primary { background-color: ${hex} !important; border-color: ${hex} !important; color: ${accentText} !important; box-shadow: 0 6px 18px ${hex}22 !important; }
                .btn-primary:hover, .btn-primary:focus { background: linear-gradient(90deg, ${hex}, ${accent2}) !important; border-color: ${hex} !important; }
                .sidebar .navbar-nav .nav-link:hover, .sidebar .navbar-nav .nav-link.active { color: ${hex} !important; border-left-color: ${hex} !important; background-color: ${hex}11 !important; }
                .ai-badge { background: linear-gradient(90deg, ${hex}, ${accent2}) !important; color: #fff !important; }
            `;
            if (!s) {
                s = document.createElement('style');
                s.id = id;
                document.head.appendChild(s);
            }
            s.textContent = styleContent;
        }catch(e){console.warn(e)}
    }
    // expose globally so other scripts (settings page) can call it directly
    try { window.medwayApplyAccent = applyAccent; } catch (e) {}
    function currentAccent(){ return localStorage.getItem('medway-accent') || null; }

    document.addEventListener('DOMContentLoaded', function () {
        applyTheme(currentTheme());
        // apply stored accent if present
        try{ applyAccent(currentAccent()); }catch(e){}
        document.querySelectorAll('.theme-toggle-btn').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                toggleTheme();
            });
        });
    });

    window.addEventListener('storage', function (e) {
        if (e.key === 'medway-theme' && e.newValue) {
            setTheme(e.newValue);
        }
        if (e.key === 'medway-accent') {
            try{ applyAccent(e.newValue); }catch(e){}
        }
    });

    try { applyTheme(currentTheme()); } catch (e) {}
})();

