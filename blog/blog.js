// ============================================
// BLOG INDEX - Listagem de Posts
// ============================================

function parseDate(dateStr) {
  if (!dateStr) return new Date(0);
  const parts = dateStr.split('-');
  if (parts.length !== 3) return new Date(0);
  // DD-MM-YYYY
  if (parts[0].length <= 2) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  // YYYY-MM-DD
  return new Date(dateStr);
}

function renderBlogCards(posts) {
  const cardsContainer = document.querySelector(".blog-cards");
  if (!cardsContainer) return;

  cardsContainer.innerHTML = posts.map((post) => {
    const postUrl = post._source === 'local'
      ? `posts/${post.id}.html`
      : `post.html?slug=${post.slug}`;

    return `
      <div class="blog-card" data-post-link="${postUrl}">
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
