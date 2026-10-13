document.addEventListener('DOMContentLoaded', function () {
    var root = document.documentElement;

    // ─── Tema claro/escuro ────────────────────────────────────────────────
    var themeBtn = document.getElementById('theme-toggle');
    function syncThemeIcon() {
        var dark = root.getAttribute('data-theme') === 'dark';
        themeBtn.innerHTML = '<i class="fa-solid ' + (dark ? 'fa-sun' : 'fa-moon') + '" aria-hidden="true"></i>';
    }
    themeBtn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}
        syncThemeIcon();
    });
    syncThemeIcon();

    // ─── Menu mobile ──────────────────────────────────────────────────────
    var menuBtn = document.getElementById('menu-toggle');
    var navLinks = document.getElementById('nav-links');
    menuBtn.addEventListener('click', function () {
        var open = navLinks.classList.toggle('open');
        menuBtn.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
            navLinks.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // ─── Barra de progresso + link ativo ─────────────────────────────────
    var progress = document.getElementById('scroll-progress');
    var sections = document.querySelectorAll('main section[id]');
    function onScroll() {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
        var current = '';
        sections.forEach(function (s) { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
        navLinks.querySelectorAll('a').forEach(function (a) {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ─── Animação de entrada + contadores ─────────────────────────────────
    function countUp(el) {
        var target = parseInt(el.getAttribute('data-count'), 10), n = 0;
        var step = Math.max(1, Math.ceil(target / 30));
        var t = setInterval(function () {
            n = Math.min(target, n + step);
            el.textContent = n + (n === target && el.hasAttribute('data-plus') ? '+' : '');
            if (n === target) clearInterval(t);
        }, 40);
    }
    var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');
            e.target.querySelectorAll('[data-count]').forEach(countUp);
            io.unobserve(e.target);
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

    // ─── Portfólio: filtros ───────────────────────────────────────────────
    var works = document.querySelectorAll('.work');
    document.querySelectorAll('.filter').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var f = btn.getAttribute('data-filter');
            document.querySelectorAll('.filter').forEach(function (b) {
                b.classList.toggle('active', b === btn);
                b.setAttribute('aria-pressed', String(b === btn));
            });
            works.forEach(function (w) {
                w.classList.toggle('hidden', f !== 'all' && w.getAttribute('data-cat') !== f);
            });
        });
    });

    // ─── Lightbox com os 18 slides do portfólio (1.jpg … 18.jpg) ──
    var TOTAL = 18, current = 1;
    var lb = document.getElementById('lightbox');
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.lightbox-caption');
    function show(n) {
        current = ((n - 1 + TOTAL) % TOTAL) + 1;
        lbImg.src = '' + current + '.jpg';
        lbImg.alt = 'Slide ' + current + ' do portfólio';
        lbCap.textContent = current + ' / ' + TOTAL;
        lb.hidden = false;
        new Image().src = '' + (current % TOTAL + 1) + '.jpg';
    }
    document.querySelectorAll('[data-slide]').forEach(function (el) {
        var n = parseInt(el.getAttribute('data-slide'), 10);
        el.addEventListener('click', function () { show(n); });
        el.addEventListener('keydown', function (e) { if (e.key === 'Enter') show(n); });
    });
    document.getElementById('open-deck').addEventListener('click', function () { show(1); });
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(current - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(current + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target.closest('.lightbox-close')) lb.hidden = true; });
    document.addEventListener('keydown', function (e) {
        if (lb.hidden) return;
        if (e.key === 'Escape') lb.hidden = true;
        if (e.key === 'ArrowRight') show(current + 1);
        if (e.key === 'ArrowLeft') show(current - 1);
    });

    document.querySelectorAll('[data-goto-filter]').forEach(function (a) {
        a.addEventListener('click', function () {
            var b = document.querySelector('.filter[data-filter="' + a.getAttribute('data-goto-filter') + '"]');
            if (b) b.click();
        });
    });

    document.getElementById('year').textContent = new Date().getFullYear();
});
