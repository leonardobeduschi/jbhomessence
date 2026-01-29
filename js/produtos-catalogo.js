// produtos-catalogo.js - Catálogo simplificado por categorias
// Nova arquitetura: páginas estáticas por categoria, sem filtros dinâmicos, JSON externo

// ========== VARIÁVEIS GLOBAIS ==========
let allProducts = [];
let currentProduct = null;
let currentImageIndex = 0;

// ========== ELEMENTOS DO DOM ==========
const grid = document.getElementById('products-grid');
const resultsCount = document.getElementById('results-count');
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.querySelector('.modal-close');

// ========== FUNÇÕES AUXILIARES ==========

function formatPrice(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}

// ========== CARREGAR PRODUTOS ==========

async function loadProducts() {
  try {
    const response = await fetch('../produtos/produtos.json');
    if (!response.ok) throw new Error('Erro ao carregar produtos');
    allProducts = await response.json();
    console.log(`✓ ${allProducts.length} produtos carregados`);
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    allProducts = [];
  }
}

// ========== RENDERIZAÇÃO DE PRODUTOS ==========

/**
 * Renderiza todos os produtos de uma categoria
 * @param {string} nomeCategoria - Nome da categoria (ex: "ABBRACCIO")
 */
function renderCategoria(nomeCategoria) {
  const filtered = allProducts.filter(p => p.categoria === nomeCategoria);

  grid.innerHTML = '';

  if (filtered.length === 0) {
    grid.innerHTML = '<p class="no-products">Nenhum produto encontrado nesta categoria.</p>';
    resultsCount.textContent = '0 produtos encontrados';
    return;
  }

  filtered.forEach(p => grid.appendChild(createCard(p)));
  resultsCount.textContent = `${filtered.length} produto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`;
}

/**
 * Cria card de produto
 */
function createCard(product) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = product.id;

  card.innerHTML = `
    <div class="card-img-container">
      <img src="${product.imagens[0] || '../img/placeholder.jpg'}" 
           alt="${product.nome}" 
           class="card-img main" 
           loading="lazy">
      ${product.imagens[1] ?
      `<img src="${product.imagens[1]}" 
              alt="${product.nome} - vista alternativa" 
              class="card-img hover" 
              loading="lazy">`
      : ''}
    </div>
    <div class="card-body">
      <h3 class="card-title">${product.nome}</h3>
      <p class="card-price">${formatPrice(product.preco)}</p>
    </div>
  `;

  card.addEventListener('click', () => openModal(product));
  return card;
}

// ========== MODAL DO PRODUTO ==========

/**
 * Abre modal com detalhes do produto
 */
function openModal(product) {
  currentProduct = product;
  currentImageIndex = 0;

  const whatsappMessage = encodeURIComponent(
    `Olá! Gostaria de fazer um pedido do produto: ${product.nome} - ${product.categoria}`
  );
  const whatsappLink = `https://wa.me/47997152830?text=${whatsappMessage}`;

  modalContent.innerHTML = `
    <div class="modal-images-column">
      <div class="modal-main-image" onclick="openLightbox(0)">
        <img src="${product.imagens[0]}" 
             alt="${product.nome}" 
             id="modal-main-img" 
             style="cursor: zoom-in;">
      </div>
      ${product.imagens.length > 1 ? `
        <div class="modal-thumbnails">
          ${product.imagens.map((img, index) => `
            <div class="modal-thumbnail ${index === 0 ? 'active' : ''}" 
                 onclick="changeModalImage('${img}', this, ${index})">
              <img src="${img}" alt="${product.nome} - vista ${index + 1}">
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
    
    <div class="modal-info-column">
      <h2 class="modal-title">${product.nome}</h2>
      <div class="modal-price">${formatPrice(product.preco)}</div>
      
      <div class="modal-description">
        <p>${product.descricao}</p>
      </div>
      
      ${product.descricaoOlfativa && product.descricaoOlfativa.length > 0 ? `
        <div class="modal-section">
          <h4>Descrição Olfativa</h4>
          <div class="modal-tags">
            ${product.descricaoOlfativa.map(tag =>
    `<span class="modal-tag">${tag}</span>`
  ).join('')}
          </div>
        </div>
      ` : ''}
      
      ${product.notas ? `
        <div class="modal-section">
          <h4>Notas</h4>
          <div class="modal-info-item">
            <p>${product.notas}</p>
          </div>
        </div>
      ` : ''}
      
      ${product.modoUso ? `
        <div class="modal-section">
          <h4>Modo de Uso</h4>
          <div class="modal-info-item">
            <p>${product.modoUso}</p>
          </div>
        </div>
      ` : ''}
      
      <div class="modal-section">
        <h4>Categoria</h4>
        <div class="modal-category">
          <span class="modal-category-badge">${product.categoria}</span>
        </div>
      </div>
      
      <div class="whatsapp-button">
        <a href="${whatsappLink}" target="_blank" rel="noopener">
          <i class="fab fa-whatsapp"></i>
          <span>Fazer pedido pelo WhatsApp</span>
        </a>
      </div>
      
      <div class="delivery-info">
        <p>Entregamos apenas para Balneário Camboriú (SC) e região no momento.</p>
      </div>
    </div>
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}
/**
 * Troca a imagem principal do modal
 */
function changeModalImage(imgSrc, element, index) {
  const mainImg = document.getElementById('modal-main-img');
  if (!mainImg) return;

  mainImg.src = imgSrc;
  currentImageIndex = index;

  document.querySelectorAll('.modal-thumbnail').forEach(thumb => {
    thumb.classList.remove('active');
  });
  element.classList.add('active');
}

/**
 * Fecha o modal
 */
function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ========== LIGHTBOX PARA IMAGENS ==========

/**
 * Abre lightbox com imagem em tamanho grande
 */
function openLightbox(index) {
  if (!currentProduct || !currentProduct.imagens) return;

  currentImageIndex = index;

  const lightbox = document.createElement('div');
  lightbox.id = 'lightbox-overlay';
  lightbox.className = 'lightbox-overlay';

  lightbox.innerHTML = `
    <button class="lightbox-close" onclick="closeLightbox()" aria-label="Fechar">×</button>
    ${currentProduct.imagens.length > 1 ? `
      <button class="lightbox-nav lightbox-prev" onclick="navigateLightbox(-1)" aria-label="Anterior">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button class="lightbox-nav lightbox-next" onclick="navigateLightbox(1)" aria-label="Próxima">
        <i class="fas fa-chevron-right"></i>
      </button>
    ` : ''}
    <div class="lightbox-content">
      <img src="${currentProduct.imagens[index]}" 
           alt="${currentProduct.nome}" 
           id="lightbox-img">
      <div class="lightbox-counter">${index + 1} / ${currentProduct.imagens.length}</div>
    </div>
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  // Fecha ao clicar fora da imagem
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Animação de entrada
  setTimeout(() => lightbox.classList.add('active'), 10);
}

/**
 * Fecha lightbox
 */
function closeLightbox() {
  const lightbox = document.getElementById('lightbox-overlay');
  if (!lightbox) return;

  lightbox.classList.remove('active');
  setTimeout(() => {
    lightbox.remove();
    document.body.style.overflow = '';
  }, 300);
}

/**
 * Navega entre imagens no lightbox
 */
function navigateLightbox(direction) {
  if (!currentProduct || !currentProduct.imagens) return;

  currentImageIndex += direction;

  // Loop circular
  if (currentImageIndex < 0) {
    currentImageIndex = currentProduct.imagens.length - 1;
  } else if (currentImageIndex >= currentProduct.imagens.length) {
    currentImageIndex = 0;
  }

  const lightboxImg = document.getElementById('lightbox-img');
  const counter = document.querySelector('.lightbox-counter');

  if (lightboxImg) {
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
      lightboxImg.src = currentProduct.imagens[currentImageIndex];
      lightboxImg.style.opacity = '1';
      if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${currentProduct.imagens.length}`;
      }
    }, 200);
  }
}

// ========== EVENTOS GLOBAIS ==========

// Fecha modal ao clicar no overlay
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Fecha modal ao clicar no botão X
modalClose.addEventListener('click', closeModal);

// Suporte a teclado
document.addEventListener('keydown', (e) => {
  // Lightbox
  const lightbox = document.getElementById('lightbox-overlay');
  if (lightbox) {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigateLightbox(-1);
    } else if (e.key === 'ArrowRight') {
      navigateLightbox(1);
    }
    return;
  }

  // Modal
  if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
    closeModal();
  }
});

// ========== INICIALIZAÇÃO ==========

document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Inicializando catálogo...');

  // Carrega produtos do JSON
  await loadProducts();

  console.log('✅ Catálogo inicializado com sucesso!');
});