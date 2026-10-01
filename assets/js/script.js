document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();

    const loader = document.querySelector('.site-loader');
    const loaderStartedAt = performance.now();
    const revealPage = () => {
        const remainingTime = Math.max(0, 2200 - (performance.now() - loaderStartedAt));
        window.setTimeout(() => loader?.classList.add('is-hidden'), remainingTime);
    };
    if (document.readyState === 'complete') revealPage();
    else window.addEventListener('load', revealPage, { once: true });

    const nav = document.querySelector('.site-nav');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = [...document.querySelectorAll('.nav-links a')];
    const closeMenu = () => {
        navLinks?.classList.remove('is-open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Ouvrir le menu');
    };

    menuToggle?.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fermer le menu' : 'Ouvrir le menu');
    });
    navItems.forEach(link => link.addEventListener('click', closeMenu));

    const navSections = navItems.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const updateNavigation = () => {
        nav?.classList.toggle('is-scrolled', window.scrollY > 20);
        const current = navSections.findLast(section => window.scrollY >= section.offsetTop - 160);
        navItems.forEach(link => link.classList.toggle('is-active', link.getAttribute('href') === `#${current?.id}`));
    };
    window.addEventListener('scroll', updateNavigation, { passive: true });
    updateNavigation();

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && window.matchMedia('(pointer: fine)').matches) {
        const resetOrbit = () => {
            ['far', 'mid', 'near'].forEach(depth => {
                heroVisual.style.setProperty(`--${depth}-x`, '0px');
                heroVisual.style.setProperty(`--${depth}-y`, '0px');
            });
        };
        heroVisual.addEventListener('pointermove', event => {
            const bounds = heroVisual.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - .5;
            const y = (event.clientY - bounds.top) / bounds.height - .5;
            heroVisual.style.setProperty('--far-x', `${x * 5}px`);
            heroVisual.style.setProperty('--far-y', `${y * 5}px`);
            heroVisual.style.setProperty('--mid-x', `${x * 11}px`);
            heroVisual.style.setProperty('--mid-y', `${y * 11}px`);
            heroVisual.style.setProperty('--near-x', `${x * 18}px`);
            heroVisual.style.setProperty('--near-y', `${y * 18}px`);
        });
        heroVisual.addEventListener('pointerleave', resetOrbit);
        resetOrbit();
    }

    const orbitPlanets = [...document.querySelectorAll('.orbit-planet')];
    const orbitFocus = document.querySelector('.orbit-focus');
    const orbitFocusTitle = orbitFocus?.querySelector('h3');
    const orbitFocusDescription = orbitFocus?.querySelector('.orbit-focus-description');
    const resetPlanetFocus = () => {
        heroVisual?.classList.remove('is-focused');
        orbitPlanets.forEach(planet => {
            planet.classList.remove('is-focused', 'is-muted');
            planet.style.removeProperty('--focus-x');
            planet.style.removeProperty('--focus-y');
            planet.setAttribute('aria-pressed', 'false');
        });
        orbitFocus?.classList.remove('is-visible');
    };
    orbitPlanets.forEach(planet => {
        planet.setAttribute('aria-pressed', 'false');
        planet.addEventListener('click', () => {
            if (planet.classList.contains('is-focused')) {
                resetPlanetFocus();
                return;
            }
            const visualBounds = heroVisual.getBoundingClientRect();
            const planetBounds = planet.getBoundingClientRect();
            const deltaX = visualBounds.left + visualBounds.width / 2 - (planetBounds.left + planetBounds.width / 2);
            const deltaY = visualBounds.top + visualBounds.height / 2 - (planetBounds.top + planetBounds.height / 2);
            orbitPlanets.forEach(item => {
                item.classList.toggle('is-focused', item === planet);
                item.classList.toggle('is-muted', item !== planet);
                item.setAttribute('aria-pressed', String(item === planet));
            });
            planet.style.setProperty('--focus-x', `${deltaX}px`);
            planet.style.setProperty('--focus-y', `${deltaY}px`);
            orbitFocusTitle.textContent = planet.dataset.title;
            orbitFocusDescription.textContent = planet.dataset.description;
            heroVisual.classList.add('is-focused');
            orbitFocus.classList.add('is-visible');
        });
    });
    document.addEventListener('click', event => {
        if (heroVisual?.classList.contains('is-focused') && !event.target.closest('.orbit-planet')) resetPlanetFocus();
    });

    const dialog = document.getElementById('detail-dialog');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogDetail = document.getElementById('dialog-detail');
    const openDetail = (title, detail, icon) => {
        dialogTitle.textContent = title;
        dialogDetail.textContent = detail;
        document.querySelector('.dialog-icon').innerHTML = `<i data-lucide="${icon || 'sparkles'}"></i>`;
        if (typeof lucide !== 'undefined') lucide.createIcons();
        dialog.showModal();
    };
    document.querySelectorAll('[data-skill], .project-detail').forEach(button => {
        button.addEventListener('click', () => openDetail(button.dataset.skill || button.dataset.project, button.dataset.detail, button.dataset.icon));
    });
    const closeDialog = () => dialog?.close();
    document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
    document.querySelector('.dialog-done')?.addEventListener('click', closeDialog);
    dialog?.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });

    const track = document.querySelector('.carousel-track');
    const certificateCards = [...document.querySelectorAll('.certificate-card')];
    const carouselCount = document.querySelector('.carousel-progress b');
    let activeCertificate = 0;
    const showCertificate = index => {
        if (!track || certificateCards.length === 0) return;
        activeCertificate = (index + certificateCards.length) % certificateCards.length;
        track.style.transform = `translateX(-${activeCertificate * 100}%)`;
        carouselCount.textContent = String(activeCertificate + 1).padStart(2, '0');
    };
    document.querySelector('[data-carousel="prev"]')?.addEventListener('click', () => showCertificate(activeCertificate - 1));
    document.querySelector('[data-carousel="next"]')?.addEventListener('click', () => showCertificate(activeCertificate + 1));

    const contactForm = document.getElementById('contact-form');
    const status = document.getElementById('contact-status');
    contactForm?.addEventListener('submit', async event => {
        event.preventDefault();
        const button = contactForm.querySelector('.btn-submit');
        const originalContent = button.innerHTML;
        button.disabled = true;
        button.innerHTML = '<span>Envoi en cours…</span>';
        try {
            const response = await fetch(contactForm.action, { method: contactForm.method, body: new FormData(contactForm), headers: { Accept: 'application/json' } });
            if (!response.ok) throw new Error('Formulaire indisponible');
            status.textContent = 'Merci, votre message a bien été envoyé !';
            status.className = 'status-message success';
            contactForm.reset();
        } catch {
            status.textContent = 'L’envoi a échoué. Vous pouvez me contacter directement par e-mail.';
            status.className = 'status-message error';
        } finally {
            button.disabled = false;
            button.innerHTML = originalContent;
        }
    });

    const year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
});
