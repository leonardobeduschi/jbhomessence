// ============================================
// BLOG INDEX - Listagem de Posts
// ============================================

// Ordem de exibição das categorias na página do blog
const CATEGORY_ORDER = [
  'Guia de Aromatização',
  'Fundamentos',
  'Famílias Olfativas',
  'Dicas de Aromatização',
  'Aromatização Profissional',
  'Onde Comprar e Presentes'
];

// Quantidade de cards visíveis por categoria antes de clicar em "Ver mais"
const INITIAL_VISIBLE_CARDS = 3;

function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(0);
  // DD-MM-YYYY
  if (parts[0].length <= 2) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  // YYYY-MM-DD
  return new Date(dateStr);
}

// Alterna a exibição dos cards extras de uma seção de categoria
function toggleVerMais(btn) {
  const section = btn.closest('.blog-category-section');
  const grid = section.querySelector('.blog-cards-grid');
  const expanded = grid.classList.toggle('expanded');
  btn.classList.toggle('expanded', expanded);
  btn.querySelector('.ver-mais-label').textContent = expanded ? 'Ver menos' : 'Ver mais';
}
window.toggleVerMais = toggleVerMais;

function groupPostsByCategory(posts) {
  const groups = new Map();
  posts.forEach((post) => {
    const category = post.category || 'Outros';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(post);
  });

  groups.forEach((list) => list.sort((a, b) => parseDate(b.date) - parseDate(a.date)));

  const knownCategories = CATEGORY_ORDER.filter((category) => groups.has(category));
  const otherCategories = [...groups.keys()]
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort((a, b) => parseDate(groups.get(b)[0].date) - parseDate(groups.get(a)[0].date));

  return [...knownCategories, ...otherCategories].map((category) => ({
    category,
    posts: groups.get(category),
  }));
}

function buildCardHtml(post, index) {
  const postUrl = post._source === 'local'
    ? `posts/${post.id}.html`
    : `post.html?slug=${post.slug}`;
  const extraClass = index >= INITIAL_VISIBLE_CARDS ? ' extra-card' : '';

  return `
      <div class="blog-card${extraClass}" data-post-link="${postUrl}">
        <a href="${postUrl}" style="text-decoration: none; color: inherit;">
          <div class="card-wrapper">
            <figure>
              <img src="${post.image || ''}" alt="${post.title}" loading="lazy" />
            </figure>
            <div class="card-body">
              <p class="meta">${post.date} | ${post.category}</p>
              <h2>${post.title}</h2>
              <p class="excerpt">${post.excerpt || ''}</p>
            </div>
          </div>
        </a>
      </div>
    `;
}

function renderBlogCards(posts) {
  const cardsContainer = document.querySelector(".blog-cards");
  if (!cardsContainer) return;

  const groups = groupPostsByCategory(posts);

  cardsContainer.innerHTML = groups.map(({ category, posts: categoryPosts }) => {
    const cardsHtml = categoryPosts.map((post, index) => buildCardHtml(post, index)).join("");
    const verMaisHtml = categoryPosts.length > INITIAL_VISIBLE_CARDS ? `
      <div class="ver-mais-container">
        <button type="button" class="ver-mais-btn" onclick="toggleVerMais(this)">
          <span class="ver-mais-label">Ver mais</span>
          <span class="ver-mais-icon">&#9662;</span>
        </button>
      </div>` : '';

    return `
      <div class="blog-category-section">
        <h2 class="blog-category-title">${category}</h2>
        <div class="blog-cards-grid">${cardsHtml}</div>
        ${verMaisHtml}
      </div>
    `;
  }).join("");
}

async function loadBlogPosts() {
  const cardsContainer = document.querySelector(".blog-cards");
  if (!cardsContainer) return;

  let localPosts = [];
  let sanityPosts = [];

  // Posts locais (posts.json — posts existentes)
  try {
    const res = await fetch("posts.json");
    const data = await res.json();
    localPosts = data.map(p => ({
      _source: 'local',
      id: p.id,
      slug: p.id,
      title: p.title,
      date: p.date,
      category: p.category,
      excerpt: p.excerpt || '',
      image: p.image || '',
    }));
  } catch (e) {
    console.warn('posts.json não encontrado:', e);
  }

  // Posts do Sanity (posts novos criados pelo CMS)
  if (window.sanityClient) {
    try {
      const raw = await window.sanityClient.sanityFetch(
        `*[_type == "post" && publicado == true] | order(dataPublicacao desc) {
          _id, titulo, slug, resumo, dataPublicacao, categoria,
          "imagemRef": imagemCapa.asset._ref
        }`
      );
      if (Array.isArray(raw)) {
        sanityPosts = raw.map(p => ({
          _source: 'sanity',
          id: p._id,
          slug: p.slug?.current || p._id,
          title: p.titulo,
          date: window.sanityClient.formatarData(p.dataPublicacao),
          category: p.categoria || '',
          excerpt: p.resumo || '',
          image: p.imagemRef ? window.sanityClient.imageUrl(p.imagemRef, 600) : '',
        }));
      }
    } catch (e) {
      console.warn('Erro ao buscar posts do Sanity:', e);
    }
  }

  // Junta e ordena por data (mais recente primeiro)
  const allPosts = [...sanityPosts, ...localPosts];
  allPosts.sort((a, b) => parseDate(b.date) - parseDate(a.date));

  renderBlogCards(allPosts);
}

loadBlogPosts();
