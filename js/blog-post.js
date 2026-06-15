// ============================================
// BLOG POST INDIVIDUAL — Carrega post do Sanity
// ============================================

// Converte Portable Text (Sanity) para HTML
function portableTextToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return '';

  return blocks.map(block => {
    if (block._type === 'image') {
      const url = window.sanityClient.imageUrl(block.asset?._ref, 1200);
      const alt = block.alt || '';
      return `<figure class="post-image-inline"><img src="${url}" alt="${alt}" loading="lazy"></figure>`;
    }

    if (block._type !== 'block') return '';

    const tag = { normal: 'p', h2: 'h2', h3: 'h3', h4: 'h4', blockquote: 'blockquote' }[block.style || 'normal'] || 'p';

    const inner = (block.children || []).map(child => {
      let text = (child.text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const marks = child.marks || [];
      const markDefs = block.markDefs || [];

      // Link
      const linkKey = marks.find(m => markDefs.some(d => d._key === m && d._type === 'link'));
      if (linkKey) {
        const def = markDefs.find(d => d._key === linkKey);
        if (marks.includes('strong')) text = `<strong>${text}</strong>`;
        if (marks.includes('em')) text = `<em>${text}</em>`;
        return `<a href="${def.href}" target="_blank" rel="noopener noreferrer">${text}</a>`;
      }

      if (marks.includes('strong')) text = `<strong>${text}</strong>`;
      if (marks.includes('em')) text = `<em>${text}</em>`;
      if (marks.includes('underline')) text = `<u>${text}</u>`;
      return text;
    }).join('');

    return `<${tag}>${inner}</${tag}>`;
  }).join('\n');
}

async function loadRelatedPosts(categoria, currentSlug) {
  const container = document.getElementById('related-posts-container');
  if (!container || !window.sanityClient) return;

  try {
    const related = await window.sanityClient.sanityFetch(
      `*[_type == "post" && publicado == true && categoria == "${categoria}" && slug.current != "${currentSlug}"] | order(dataPublicacao desc) [0...3] {
        titulo, slug, resumo, dataPublicacao, categoria,
        "imagemRef": imagemCapa.asset._ref
      }`
    );

    if (!Array.isArray(related) || related.length === 0) {
      document.querySelector('.related-posts')?.remove();
      return;
    }

    container.innerHTML = related.map(p => `
      <div class="blog-card">
        <a href="post.html?slug=${p.slug?.current}" style="text-decoration: none; color: inherit;">
          <div class="card-wrapper">
            <figure>
              <img src="${p.imagemRef ? window.sanityClient.imageUrl(p.imagemRef, 400) : ''}" alt="${p.titulo}" loading="lazy">
            </figure>
            <div class="card-body">
              <p class="meta">${window.sanityClient.formatarData(p.dataPublicacao)} | ${p.categoria || ''}</p>
              <h2>${p.titulo}</h2>
              <p class="excerpt">${p.resumo || ''}</p>
            </div>
          </div>
        </a>
      </div>
    `).join('');
  } catch (e) {
    document.querySelector('.related-posts')?.remove();
  }
}

async function loadPost() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  if (!slug) {
    window.location.href = 'index.html';
    return;
  }

  if (!window.sanityClient) {
    document.getElementById('post-content').innerHTML = '<p>Erro ao inicializar o cliente do CMS.</p>';
    return;
  }

  try {
    const result = await window.sanityClient.sanityFetch(
      `*[_type == "post" && slug.current == "${slug}" && publicado == true][0] {
        titulo, slug, resumo, conteudo, dataPublicacao, categoria, tags,
        "imagemRef": imagemCapa.asset._ref
      }`
    );

    // sanityFetch retorna [] quando não encontra com [0]
    const post = Array.isArray(result) ? null : result;

    if (!post || !post.titulo) {
      document.getElementById('post-title').textContent = 'Post não encontrado';
      document.getElementById('post-content').innerHTML = '<p>Este post não existe ou não está publicado.</p>';
      document.querySelector('.related-posts')?.remove();
      return;
    }

    // SEO
    document.title = `${post.titulo} | Blog JB Home Essence`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && post.resumo) metaDesc.setAttribute('content', post.resumo);
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', `https://jbhomessence.com.br/blog/post.html?slug=${slug}`);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', post.titulo);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && post.resumo) ogDesc.setAttribute('content', post.resumo);

    // Conteúdo principal
    document.getElementById('post-title').textContent = post.titulo;
    document.getElementById('post-date').textContent = window.sanityClient.formatarData(post.dataPublicacao);
    document.getElementById('post-category').textContent = post.categoria || '';

    // Imagem de capa
    const postImage = document.getElementById('post-image');
    if (postImage) {
      if (post.imagemRef) {
        postImage.src = window.sanityClient.imageUrl(post.imagemRef, 1200);
        postImage.alt = post.titulo;
        const ogImage = document.querySelector('meta[property="og:image"]');
        if (ogImage) ogImage.setAttribute('content', window.sanityClient.imageUrl(post.imagemRef, 1200));
      } else {
        postImage.closest('.post-cover')?.remove();
      }
    }

    // Corpo do post
    const conteudoEl = document.getElementById('post-content');
    if (conteudoEl) {
      conteudoEl.innerHTML = portableTextToHtml(post.conteudo) || `<p>${post.resumo || ''}</p>`;
    }

    // Tags
    const tagsEl = document.getElementById('post-tags');
    if (tagsEl) {
      if (post.tags && post.tags.length > 0) {
        tagsEl.innerHTML = post.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      } else {
        tagsEl.closest('.post-footer')?.remove();
      }
    }

    // Posts relacionados
    if (post.categoria) {
      loadRelatedPosts(post.categoria, slug);
    } else {
      document.querySelector('.related-posts')?.remove();
    }

  } catch (err) {
    console.error('Erro ao carregar post:', err);
    document.getElementById('post-content').innerHTML = '<p>Erro ao carregar o conteúdo do post. Por favor, tente novamente.</p>';
  }
}

document.addEventListener('DOMContentLoaded', loadPost);
