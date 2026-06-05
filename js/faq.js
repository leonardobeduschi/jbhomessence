// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function () {
    initializeFAQ();
});

function initializeFAQ() {
    // Elementos do DOM
    const searchInput = document.getElementById('searchInput');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    const faqQuestions = document.querySelectorAll('.faq-question');
    const noResults = document.querySelector('.no-results');

    // State
    let currentCategory = 'all';
    let searchTerm = '';

    // ==================== EVENT LISTENERS ====================

    // Busca
    searchInput.addEventListener('input', function (e) {
        searchTerm = e.target.value.toLowerCase().trim();
        filterFAQs();
    });

    // Categorias
    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active de todos os botões
            categoryButtons.forEach(btn => btn.classList.remove('active'));

            // Adiciona active ao botão clicado
            this.classList.add('active');

            // Atualiza categoria atual
            currentCategory = this.getAttribute('data-category');

            // Limpa busca ao trocar categoria
            searchInput.value = '';
            searchTerm = '';

            // Filtra FAQs
            filterFAQs();
        });
    });

    // Accordion
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const item = this.closest('.faq-item');
            const isActive = item.classList.contains('active');

            // Fecha todos os outros itens (opcional: remover para permitir múltiplos abertos)
            // faqItems.forEach(faq => {
            //     if (faq !== item) {
            //         faq.classList.remove('active');
            //         faq.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            //     }
            // });

            // Toggle do item clicado
            if (isActive) {
                item.classList.remove('active');
                this.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ==================== FUNÇÕES DE FILTRO ====================

    function filterFAQs() {
        let visibleCount = 0;

        faqItems.forEach(item => {
            const category = item.getAttribute('data-category');
            const question = item.querySelector('.faq-question span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer').textContent.toLowerCase();

            // Verifica categoria
            const matchesCategory = currentCategory === 'all' || category === currentCategory;

            // Verifica busca
            const matchesSearch = searchTerm === '' ||
                question.includes(searchTerm) ||
                answer.includes(searchTerm);

            // Mostra ou esconde item
            if (matchesCategory && matchesSearch) {
                item.classList.remove('hidden');
                visibleCount++;
            } else {
                item.classList.add('hidden');
                // Fecha item se estiver aberto
                item.classList.remove('active');
                item.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
            }
        });

        // Mostra/esconde mensagem de "sem resultados"
        if (visibleCount === 0) {
            noResults.style.display = 'block';
        } else {
            noResults.style.display = 'none';
        }
    }

    // ==================== FUNCIONALIDADE EXTRA ====================

    // Permite abrir/fechar com teclado (Enter e Espaço)
    faqQuestions.forEach(question => {
        question.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Smooth scroll para FAQ se vier de link externo com hash
    if (window.location.hash) {
        const targetId = window.location.hash.substring(1);
        const targetItem = document.getElementById(targetId);

        if (targetItem && targetItem.classList.contains('faq-item')) {
            setTimeout(() => {
                targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                targetItem.querySelector('.faq-question').click();
            }, 500);
        }
    }

    // Destaque na busca (opcional - adiciona highlight nos termos buscados)
    function highlightSearchTerm(text, term) {
        if (!term) return text;

        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    // Estatísticas (opcional - pode ser útil para analytics)
    function logInteraction(action, details) {
        // Aqui você pode integrar com Google Analytics ou outra ferramenta
        console.log('FAQ Interaction:', action, details);
    }

    // Log de abertura de perguntas
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const questionText = this.querySelector('span').textContent;
            logInteraction('question_opened', questionText);
        });
    });
}

// ==================== UTILITÁRIOS ====================

// Debounce para otimizar busca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exportar para uso global se necessário
window.FAQUtils = {
    debounce
};