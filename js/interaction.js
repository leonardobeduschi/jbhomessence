// ======================
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const quizInicio = document.getElementById('inicio-quiz');
    if (quizInicio) {
        quizInicio.style.display = 'block';
    }

    // Carousel logic for the "Quem Somos" and "Serviços" sections
    // moved to js/quem-somos.js (keeps same functionality, scoped to the section IDs)


    function setupScrollAnimations(selector) {
        const elements = document.querySelectorAll(selector);
        
        function checkVisibility() {
            const triggerBottom = window.innerHeight * 0.8;
            elements.forEach(element => {
                if (element.getBoundingClientRect().top < triggerBottom) {
                    element.classList.add('visible');
                }
            });
        }

        window.addEventListener('scroll', checkVisibility);
        checkVisibility();
    }

    setupScrollAnimations('.cliente-card');
    setupScrollAnimations('.rodape-grid > div');
});

// Navbar logic moved to js/navbar.js
// Do not add navbar-related code here

// ======================
// Blog: botão "Ver mais" (expande cards extras dentro de cada categoria)
// ======================
function toggleVerMais(btn) {
    const section = btn.closest('.blog-category-section');
    const grid = section.querySelector('.blog-cards-grid');
    const expanded = grid.classList.toggle('expanded');
    btn.classList.toggle('expanded', expanded);
    btn.querySelector('.ver-mais-label').textContent = expanded ? 'Ver menos' : 'Ver mais';
}
window.toggleVerMais = toggleVerMais;