/**
 * categoria.js - Script para carregar categorias e tipos de produtos via URL
 * Uso: 
 * - /produtos/categoria.html?categoria=abbraccio (fragrância)
 * - /produtos/categoria.html?tipo=home-spray (tipo de produto)
 */

let categoryPageProducts = [];
let categoryList = [];
let tiposList = [];
let currentProducts = []; // Produtos filtrados atuais
let displayedCount = 0; // Contador de produtos exibidos
const PRODUCTS_PER_LOAD = 8; // Quantidade de produtos por carregamento

// ========== CAPTURA DE PARÂMETROS URL ==========

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ========== CARREGAMENTO DE DADOS ==========

async function fetchCategories() {
  try {
    const response = await fetch('../produtos/categorias.json');
    if (!response.ok) throw new Error('Erro ao carregar categorias');
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    return [];
  }
}

async function fetchTipos() {
  try {
    const response = await fetch('../produtos/tipos-produtos.json');
    if (!response.ok) throw new Error('Erro ao carregar tipos');
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar tipos:', error);
    return [];
  }
}

async function fetchProducts() {
  try {
    const response = await fetch('../produtos/produtos.json');
    if (!response.ok) throw new Error('Erro ao carregar produtos');
    return await response.json();
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    return [];
  }
}

// ========== BUSCA E FILTRO ==========

function getCategoryBySlug(slug) {
  return categoryList.find(cat => cat.slug === slug.toLowerCase());
}

function getTipoBySlug(slug) {
  return tiposList.find(tipo => tipo.slug === slug.toLowerCase());
}

function getProductsByCategory(categoryName) {
  return categoryPageProducts.filter(prod => prod.categoria === categoryName);
}

function getProductsByTipo(tipoSlug) {
  const tipoNomeMap = {
    'home-spray': 'Home Spray',
    'difusor-varetas': 'Difusor de Varetas',
    'sabonete-liquido': 'Sabonete Líquido',
    'essencias': 'Essência',
    'velas-aromaticas': 'Velas Aromáticas',
    'aromatizador-carro': 'Kit Carro',
    'agua-perfumada': 'Água Perfumada'
  };
  
  const nomeBusca = tipoNomeMap[tipoSlug];
  if (!nomeBusca) return [];
  
  return categoryPageProducts.filter(prod => 
    prod.nome.toLowerCase().includes(nomeBusca.toLowerCase())
  );
}

// ========== RENDERIZAÇÃO COM LAZY LOADING ==========

function formatPrice(price) {
  return `R$ ${Number(price).toFixed(2).replace('.', ',')}`;
}

function createCard(product) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.id = product.id;

  const price = formatPrice(product.preco);
  const mainImage = product.imagens?.[0] || '../img/placeholder.jpg';
  const hoverImage = product.imagens?.[1] || mainImage;

  card.innerHTML = `
    <div class="card-img-container" style="position:relative;">
      <img src="${mainImage}" alt="${product.nome}" class="card-img main" loading="lazy">
      <img src="${hoverImage}" alt="${product.nome}" class="card-img hover" loading="lazy">
    </div>
    <div class="card-body">
      <h3 class="card-title">${product.nome} - ${product.categoria}</h3>
      <p class="card-price">${price}</p>
    </div>
  `;

  card.addEventListener('click', () => {
    if (typeof window.openModal === 'function') {
      window.openModal(product);
    } else if (typeof openModal === 'function') {
      openModal(product);
    } else {
      console.warn('Função openModal não encontrada');
    }
  });
  return card;
}

function loadMoreProducts() {
  const grid = document.getElementById('products-grid');
  if (!grid) return;

  const remainingProducts = currentProducts.slice(displayedCount, displayedCount + PRODUCTS_PER_LOAD);
  
  remainingProducts.forEach(product => {
    grid.appendChild(createCard(product));
  });

  displayedCount += remainingProducts.length;

  // Atualiza contador
  updateResultsCount();

  // Remove observer se todos produtos foram carregados
  if (displayedCount >= currentProducts.length) {
    const sentinel = document.getElementById('sentinel');
    if (sentinel && infiniteScrollObserver) {
      infiniteScrollObserver.unobserve(sentinel);
      sentinel.remove();
    }
  }
}

function updateResultsCount() {
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    const total = currentProducts.length;
    const showing = Math.min(displayedCount, total);
    
    if (showing < total) {
      resultsCount.textContent = `Mostrando ${showing} de ${total} produtos`;
    } else {
      resultsCount.textContent = `${total} produto${total !== 1 ? 's' : ''} encontrado${total !== 1 ? 's' : ''}`;
    }
  }
}

function renderProducts(products) {
  const grid = document.getElementById('products-grid');
  const resultsCount = document.getElementById('results-count');

  if (!grid) return;

  grid.innerHTML = '';
  currentProducts = products;
  displayedCount = 0;

  if (products.length === 0) {
    grid.innerHTML = '<p class="no-products">Nenhum produto encontrado.</p>';
    if (resultsCount) resultsCount.textContent = '0 produtos encontrados';
    return;
  }

  // Carrega primeiros produtos
  loadMoreProducts();

  // Adiciona sentinel para infinite scroll
  if (currentProducts.length > PRODUCTS_PER_LOAD) {
    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    sentinel.style.height = '20px';
    grid.appendChild(sentinel);
    setupInfiniteScroll();
  }
}

// ========== INFINITE SCROLL ==========

let infiniteScrollObserver = null;

function setupInfiniteScroll() {
  const sentinel = document.getElementById('sentinel');
  if (!sentinel) return;

  const options = {
    root: null,
    rootMargin: '100px',
    threshold: 0.1
  };

  infiniteScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && displayedCount < currentProducts.length) {
        loadMoreProducts();
      }
    });
  }, options);

  infiniteScrollObserver.observe(sentinel);
}

// ========== MODAL ==========

function closeCategoryModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// ========== INICIALIZAÇÃO ==========

async function initCategoryPage() {
  // Lê parâmetros da URL
  const categoriaSlug = getQueryParam('categoria');
  const tipoSlug = getQueryParam('tipo');

  if (!categoriaSlug && !tipoSlug) {
    showError('Parâmetro "categoria" ou "tipo" não encontrado na URL.');
    return;
  }

  // Carrega dados
  categoryList = await fetchCategories();
  tiposList = await fetchTipos();
  categoryPageProducts = await fetchProducts();

  let title = '';
  let description = '';
  let products = [];

  // Busca por categoria (fragrância)
  if (categoriaSlug) {
    const category = getCategoryBySlug(categoriaSlug);
    
    if (!category) {
      showError(`A categoria "${categoriaSlug}" não existe.`);
      return;
    }

    title = category.nome;
    description = category.descricao;
    products = getProductsByCategory(category.nome);
  }
  // Busca por tipo de produto
  else if (tipoSlug) {
    const tipo = getTipoBySlug(tipoSlug);
    
    if (!tipo) {
      showError(`O tipo "${tipoSlug}" não existe.`);
      return;
    }

    title = tipo.nome;
    description = tipo.descricao;
    products = getProductsByTipo(tipoSlug);
  }

  // Atualiza página
  document.title = `${title} - JB Home Essence`;
  
  const titleElement = document.getElementById('category-title');
  const descriptionElement = document.getElementById('category-description');
  
  if (titleElement) titleElement.textContent = title;
  if (descriptionElement) descriptionElement.textContent = description;

  // Renderiza produtos com lazy loading
  renderProducts(products);

  // Configura modal
  setupModal();
}

function showError(message) {
  const titleElement = document.getElementById('category-title');
  const descriptionElement = document.getElementById('category-description');
  const grid = document.getElementById('products-grid');
  
  if (titleElement) titleElement.textContent = 'Erro';
  if (descriptionElement) descriptionElement.textContent = '';
  if (grid) grid.innerHTML = `<p class="error-message">${message}</p>`;
}

function setupModal() {
  const modalClose = document.querySelector('.modal-close');
  if (modalClose) {
    modalClose.addEventListener('click', closeCategoryModal);
  }

  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCategoryModal();
    });
  }
}

// Inicia quando DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategoryPage);
} else {
  initCategoryPage();
}