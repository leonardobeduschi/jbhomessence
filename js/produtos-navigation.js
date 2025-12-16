/**
 * produtos-navigation.js
 * Torna os cards de produtos clicáveis no index.html
 */

document.addEventListener('DOMContentLoaded', function() {
  const produtoCards = document.querySelectorAll('.produto-card');
  
  produtoCards.forEach(card => {
    // Adiciona cursor pointer
    card.style.cursor = 'pointer';
    
    // Adiciona efeito hover
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
    
    // Adiciona clique para navegar
    card.addEventListener('click', function() {
      const tipoProduto = this.getAttribute('data-produto');
      
      if (tipoProduto === 'kit-premium') {
        // Para kits, pode redirecionar para WhatsApp ou página específica
        window.open('https://wa.me/47997152830?text=Olá!%20Gostaria%20de%20conhecer%20os%20kits%20personalizados', '_blank');
      } else {
        // Redireciona para página de catálogo com filtro por tipo
        window.location.href = `produtos/categoria.html?tipo=${tipoProduto}`;
      }
    });
  });
});

// Adiciona animação de entrada nos cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.produto-card');
  cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    observer.observe(card);
  });
});