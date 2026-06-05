// Dados de exemplo
const feedbacksData = [
    {
        name: "Rogerio Quinto",
        date: "12/09/2025",
        rating: 5,
        comment: "Um ótimo atendimento, do início ao fim, a equipe da JB foi muito atenciosa e prestou um ótimo serviço. Usei os seus aromas no meu escritório, que por sinal fez muito sucesso com meus clientes.",
        avatar: "img/testimonials/cliente-rogerio-quinto-depoimento.webp"
    },
    {
        name: "Lucas Henrique",
        date: "29/09/2025",
        rating: 5,
        comment: "Simplesmente maravilhoso! Me ajudaram na escolha do presente e também comprei um kit com difusor de aromas e sabonete líquido muito cheiroso aqui pra casa",
        avatar: "img/testimonials/cliente-lucas-henrique-depoimento.webp"
    },
    {
        name: "Betina Pezzini da Veiga",
        date: "02/10/2025",
        rating: 5,
        comment: "Estava procurando aromatizadores e essências para usar aqui para casa e encontrei a JB. Os cheirinhos são maravilhosos e fixam bastante. Super indico!",
        avatar: "img/testimonials/cliente-betina-pezzini-depoimento.webp"
    },
    {
        name: "Eduarda Schnaider",
        date: "10/06/2025",
        rating: 5,
        comment: "Qualidade dos produtos são de outro mundo, a fixação é perfeita e o atendimento incrível, fui muito bem atendida, já comprei duas vezes e continuarei comprando!!!",
        avatar: "img/testimonials/cliente-eduarda-schnaider-depoimento.webp"
    },
    {
        name: "GIO",
        date: "25/06/2025",
        rating: 5,
        comment: "Viajei de São Paulo até Balneário e uma das maiores surpresas foi esta loja, com um atendimento tão atencioso e delicado como os aromas que eles nos trazem. Nunca imaginei o tamanho da importância olfativa para diferentes ambientes até então.",
        avatar: "img/testimonials/cliente-GIO-depoimento.webp"
    },
    {
        name: "Emília Wetter",
        date: "10/06/2024",
        rating: 5,
        comment: "Produtos de qualidade impecÃ¡vel e atendimento excelente!",
        avatar: "img/testimonials/cliente-emilia-wetter-depoimento.webp"
    }
];

// manter feedbacksData como você forneceu
// const feedbacksData = [ ... ];

class FeedbackCarousel {
    constructor() {
        this.currentIndex = 0;
        this.cardsPerView = this.getCardsPerView();
        this.autoplayInterval = 5000;
        this.autoplayTimer = null;

        // elementos serão atribuídos após render
        this.carousel = document.querySelector('.feedback-carousel');
        this.track = document.getElementById('google-feedbacks');
        this.cards = [];
        this.total = 0;
        this.gap = 0;
        this.cardWidth = 0;

        this.touch = {
            startX: 0,
            isTouching: false
        };

        this.init();
    }

    init() {
        this.renderFeedbacks();
        this.attachResize();
        this.startAutoPlay();
        this.enableTouchOnMobile();
    }

    getCardsPerView() {
        return window.innerWidth <= 768 ? 1 : 3;
    }

    renderFeedbacks() {
        // renderiza cards
        this.track.innerHTML = feedbacksData.map((f, i) => `
            <div class="feedback-card" data-index="${i}">
                <div class="feedback-icon">
                    <img src="img/testimonials/google-reviews-logo.webp" alt="Google" class="google-icon">
                </div>
                <div class="feedback-header">
                    <img src="${f.avatar || 'img/avatar-anonimo.webp'}" alt="Foto de ${f.name}" class="client-avatar" onerror="this.src='img/avatar-anonimo.webp'">
                    <div class="client-info">
                        <div class="client-name">${f.name}</div>
                        <div class="feedback-date">${f.date}</div>
                    </div>
                </div>
                    <div class="stars">
                    ${Array.from({ length: 5 }).map((_, i) => `<span class="star">${i < f.rating ? '★' : '☆'}</span>`).join('')}
                </div>
                <div class="feedback-text">"${f.comment}"</div>
            </div>
        `).join('');

        // atualizar referÃªncias e medidas
        this.cards = Array.from(this.track.querySelectorAll('.feedback-card'));
        this.total = this.cards.length;
        // garante cardsPerView <= total
        this.cardsPerView = Math.min(this.getCardsPerView(), Math.max(1, this.total));

        // pequena pausa para garantir que estilos foram aplicados e offsets calculÃ¡veis
        requestAnimationFrame(() => {
            this.calculateMeasurements();
            this.currentIndex = 0;
            this.updateCarouselPosition(true);
        });
    }

    calculateMeasurements() {
        // referÃªncias
        this.carousel = document.querySelector('.feedback-carousel');
        this.track = document.getElementById('google-feedbacks');

        // gap entre itens (fallback 0)
        const computedGap = getComputedStyle(this.track).gap;
        this.gap = computedGap ? parseFloat(computedGap) : 0;

        // largura do card (assume todos tÃªm mesma largura)
        this.cardWidth = this.cards[0] ? this.cards[0].offsetWidth : 0;
    }

    // centraliza o bloco visÃ­vel de cards conforme cardsPerView e currentIndex
    updateCarouselPosition(noTransition = false) {
        if (!this.track) return;
        this.cardsPerView = Math.min(this.getCardsPerView(), Math.max(1, this.total));
        this.calculateMeasurements();

        // largura do bloco visÃ­vel (N cards + gaps entre eles)
        const visibleWidth = (this.cardWidth * this.cardsPerView) + (Math.max(0, this.cardsPerView - 1) * this.gap);
        const carouselWidth = this.carousel ? this.carousel.clientWidth : visibleWidth;

        // deslocamento para centralizar o bloco visÃ­vel dentro do container
        const leftOffset = (carouselWidth - visibleWidth) / 2;

        // index mÃ¡ximo vÃ¡lido para nÃ£o deixar espaÃ§o vazio (quando nÃ£o queremos wrap dentro da posiÃ§Ã£o)
        const maxStartIndex = Math.max(0, this.total - this.cardsPerView);

        // se o index atualmente estÃ¡ alÃ©m do Ãºltimo bloco, volta para 0 (deduzido para comportamento de loop)
        if (this.currentIndex > maxStartIndex) {
            // permitimos currentIndex = 0 quando chegamos no final (loop)
            // sÃ³ para exibir corretamente; o autoplay/lÃ³gica de next jÃ¡ cuida do wrap
            this.currentIndex = this.currentIndex > maxStartIndex ? 0 : this.currentIndex;
        }

        // cÃ¡lculo em px: deslocar pela largura do item + gap vezes currentIndex, e ajustar leftOffset
        const translateX = -(this.currentIndex * (this.cardWidth + this.gap)) + leftOffset;

        // aplica transformaÃ§Ã£o
        if (noTransition) {
            this.track.style.transition = 'none';
        } else {
            this.track.style.transition = 'transform 0.45s cubic-bezier(.22,.9,.31,1)';
        }
        this.track.style.transform = `translateX(${translateX}px)`;
        // depois de aplicar sem transiÃ§Ã£o, restaura transiÃ§Ã£o padrÃ£o
        if (noTransition) {
            // forÃ§ar reflow e restaurar
            void this.track.offsetWidth;
            this.track.style.transition = 'transform 0.45s cubic-bezier(.22,.9,.31,1)';
        }
    }

    // avanÃ§a um "grupo" â€” para desktop: AvanÃ§a em blocos naturais mantendo centralizaÃ§Ã£o.
    next() {
        const maxStartIndex = Math.max(0, this.total - this.cardsPerView);
        if (this.currentIndex < maxStartIndex) {
            this.currentIndex++;
        } else {
            // loop: volta ao primeiro
            this.currentIndex = 0;
        }
        this.updateCarouselPosition();
    }

    prev() {
        const maxStartIndex = Math.max(0, this.total - this.cardsPerView);
        if (this.currentIndex > 0) {
            this.currentIndex--;
        } else {
            // loop para o final
            this.currentIndex = maxStartIndex;
        }
        this.updateCarouselPosition();
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.autoplayTimer = setInterval(() => {
            this.next();
        }, this.autoplayInterval);
    }

    stopAutoPlay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
    }

    attachResize() {
        window.addEventListener('resize', () => {
            // atualiza cardsPerView e mediÃ§Ãµes e reposiciona (sem animaÃ§Ã£o brusca)
            this.cardsPerView = Math.min(this.getCardsPerView(), Math.max(1, this.total));
            // recalcula medidas e reposiciona sem transiÃ§Ã£o para nÃ£o causar animaÃ§Ã£o estranha no resize
            this.calculateMeasurements();
            this.updateCarouselPosition(true);
        });
    }

    enableTouchOnMobile() {
        // somente touch quando for mobile width
        const track = this.track;
        if (!track) return;

        // touchstart
        track.addEventListener('touchstart', (e) => {
            if (window.innerWidth > 768) return; // evita no desktop
            this.touch.isTouching = true;
            this.touch.startX = e.touches[0].clientX;
            // pausa autoplay enquanto arrasta
            this.stopAutoPlay();
        }, { passive: true });

        // touchmove -> apenas previne comportamento padrÃ£o se precisar
        track.addEventListener('touchmove', (e) => {
            if (!this.touch.isTouching) return;
            // nÃ£o fazemos transform dinÃ¢mico aqui para simplificar; apenas aguardamos o fim do gesto
        }, { passive: true });

        // touchend
        track.addEventListener('touchend', (e) => {
            if (!this.touch.isTouching) return;
            this.touch.isTouching = false;
            const endX = e.changedTouches[0].clientX;
            const diff = endX - this.touch.startX;
            const threshold = 50; // px mÃ­nimo para considerar swipe

            if (diff < -threshold) {
                // swipe para a esquerda -> prÃ³ximo
                // usamos wrap com modulo: avanÃ§a e se ultrapassar volta ao inÃ­cio
                const maxStartIndex = Math.max(0, this.total - this.cardsPerView);
                if (this.currentIndex < maxStartIndex) {
                    this.currentIndex++;
                } else {
                    this.currentIndex = 0;
                }
            } else if (diff > threshold) {
                // swipe pra direita -> anterior (com loop)
                const maxStartIndex = Math.max(0, this.total - this.cardsPerView);
                if (this.currentIndex > 0) {
                    this.currentIndex--;
                } else {
                    this.currentIndex = maxStartIndex;
                }
            }
            this.updateCarouselPosition();
            // reinicia autoplay apÃ³s interaÃ§Ã£o
            this.startAutoPlay();
        }, { passive: true });
    }
}

// inicializa quando DOM pronto
document.addEventListener('DOMContentLoaded', () => {
    // instancia
    new FeedbackCarousel();
});
