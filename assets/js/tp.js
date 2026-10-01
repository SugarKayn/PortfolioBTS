document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: .12 });
    document.querySelectorAll('.reveal-tp').forEach(element => observer.observe(element));
});
