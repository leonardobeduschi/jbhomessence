// Carousel logic for Quem Somos and Nossos Serviços sections
// Extracted from js/interaction.js and scoped to the two sections

document.addEventListener('DOMContentLoaded', function() {
    const selectors = '#quem-somos .carrossel-container, #servicos .carrossel-container';
    document.querySelectorAll(selectors).forEach(container => {
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

        btnNext.addEventListener('click', () => showCard((currentIndex + 1) % cards.length));
        btnPrev.addEventListener('click', () => showCard((currentIndex - 1 + cards.length) % cards.length));

        showCard(0);
    });
});
