/**
 * categoria.js - Script para carregar categorias dinamicamente via URL
 * Uso: /produtos/categoria.html?categoria=abbraccio
 */

// Use nomes únicos para evitar conflito
let categoryPageProducts = [];
let categoryList = [];

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

function getProductsByCategory(categoryName) {
  return categoryPageProducts.filter(prod => prod.categoria === categoryName);
}

// ========== RENDERIZAÇÃO ==========

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
      <h3 class="card-title">${product.nome}</h3>
      <p class="card-price">${price}</p>
    </div>
  `;

  // Verifique se a função openModal existe antes de chamar
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

function renderCategory(categoryName) {
  const grid = document.getElementById('products-grid');
  const resultsCount = document.getElementById('results-count');
  const products = getProductsByCategory(categoryName);

  if (!grid) return;

  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<p class="no-products">Nenhum produto encontrado nesta categoria.</p>';
    if (resultsCount) resultsCount.textContent = '0 produtos encontrados';
    return;
  }

  products.forEach(product => {
    grid.appendChild(createCard(product));
  });

  if (resultsCount) {
    const count = products.length;
    resultsCount.textContent = `${count} produto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
  }
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
  // Lê slug da URL
  const slug = getQueryParam('categoria');

  if (!slug) {
    const titleElement = document.getElementById('category-title');
    const descriptionElement = document.getElementById('category-description');
    const grid = document.getElementById('products-grid');
    
    if (titleElement) titleElement.textContent = 'Erro';
    if (descriptionElement) descriptionElement.textContent = '';
    if (grid) grid.innerHTML =
      '<p class="error-message">Parâmetro "categoria" não encontrado na URL. Use: categoria.html?categoria=abbraccio</p>';
    return;
  }

  // Carrega dados
  categoryList = await fetchCategories();
  categoryPageProducts = await fetchProducts();

  // Busca categoria
  const category = getCategoryBySlug(slug);

  if (!category) {
    const titleElement = document.getElementById('category-title');
    const descriptionElement = document.getElementById('category-description');
    const grid = document.getElementById('products-grid');
    
    if (titleElement) titleElement.textContent = 'Categoria não encontrada';
    if (descriptionElement) descriptionElement.textContent = '';
    if (grid) grid.innerHTML =
      `<p class="error-message">A categoria "${slug}" não existe.</p>`;
    return;
  }

  // Atualiza título e descrição
  document.title = `${category.nome} - JB Home Essence`;
  
  const titleElement = document.getElementById('category-title');
  const descriptionElement = document.getElementById('category-description');
  
  if (titleElement) titleElement.textContent = category.nome;
  if (descriptionElement) descriptionElement.textContent = category.descricao;

  // Renderiza produtos
  renderCategory(category.nome);

  // Configura modal (se existir nesta página)
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

// Dropdown and navbar logic moved to js/navbar.js
// Do not add dropdown-related code here