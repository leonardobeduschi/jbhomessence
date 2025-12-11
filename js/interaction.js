// ======================
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const quizInicio = document.getElementById('inicio-quiz');
    if (quizInicio) {
        quizInicio.style.display = 'block';
    }

    document.querySelectorAll('.carrossel-container').forEach(container => {
        const cards = container.querySelectorAll('.carousel-item-card');
        const btnPrev = container.querySelector('.carrossel-seta-esquerda');
        const btnNext = container.querySelector('.carrossel-seta-direita');
        const indicadores = container.querySelectorAll('.carrossel-indicadores .indicador');
        let currentIndex = 0;
        let isTransitioning = false;

        function updateIndicadores(index) {
            indicadores.forEach((indicador, i) => {
                indicador.classList.toggle('active', i === index);
            });
        }

        function showCard(index) {
            if (isTransitioning) return;
            isTransitioning = true;
            
            cards[currentIndex].classList.remove('active');
            currentIndex = index;
            cards[currentIndex].classList.add('active');
            updateIndicadores(currentIndex);
            
            setTimeout(() => isTransitioning = false, 600);
        }

        indicadores.forEach((indicador, index) => {
            indicador.addEventListener('click', () => {
                showCard(index);
            });
        });

        btnNext.addEventListener('click', () => 
            showCard((currentIndex + 1) % cards.length));
        
        btnPrev.addEventListener('click', () => 
            showCard((currentIndex - 1 + cards.length) % cards.length));

        showCard(0);
    });

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