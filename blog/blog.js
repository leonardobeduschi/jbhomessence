// Seu código atualizado com as melhorias

if (window.location.pathname.includes("/blog/index.html") || window.location.pathname === "/" || window.location.pathname.includes("/blog/")) {
  fetch("../blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      const cardsContainer = document.querySelector(".blog-cards");
      if (cardsContainer) {
        // Ordenar posts por data (mais recentes primeiro)
        posts.sort((a, b) => {
          const dateA = new Date(a.date.split('-').reverse().join('-'));
          const dateB = new Date(b.date.split('-').reverse().join('-'));
          return dateB - dateA;
        });

        cardsContainer.innerHTML = posts
          .map((post) => {
            return `
              <div class="blog-card" data-post-link="post.html?id=${post.id}">
                <div class="card-wrapper">
                  <figure>
                    <img src="${post.image || "https://via.placeholder.com/300x300"}" alt="${post.title}" loading="lazy" />
                  </figure>
                  <div class="card-body">
                    <p class="meta">${post.date} | ${post.category}</p>
                    <h2>${post.title}</h2>
                    <p class="excerpt">${post.excerpt}</p>
                    <a href="post.html?id=${post.id}" class="read-more" aria-label="Ler mais sobre ${post.title}">
                      Leia mais <span class="sr-only">sobre ${post.title}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            `;
          })
          .join("");
        
        // Adicionar event listeners para tornar o card inteiro clicável
        document.querySelectorAll(".blog-card").forEach((card) => {
          card.addEventListener("click", (e) => {
            // Evita dupla navegação se clicou no link "Leia mais"
            if (e.target.closest(".read-more")) return;
            
            const link = card.getAttribute("data-post-link");
            if (link) window.location.href = link;
          });
        });
      }
    })
    .catch((err) => console.error("Erro ao carregar posts:", err));
}

// Código para página de post (post.html)
if (window.location.pathname.includes("/blog/post.html")) {
  
  // Funções auxiliares para manipulação de meta tags
  function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function setOrCreateMeta(selectorAttrs, attrName, value) {
    // selectorAttrs: {name:"description"} ou {property:"og:title"} etc
    const selector = Object.keys(selectorAttrs).map(k => `[${k}="${selectorAttrs[k]}"]`).join('');
    let meta = document.head.querySelector(`meta${selector}`);
    if (!meta) {
      meta = document.createElement('meta');
      Object.keys(selectorAttrs).forEach(k => meta.setAttribute(k, selectorAttrs[k]));
      document.head.appendChild(meta);
    }
    meta.setAttribute(attrName, value);
    // for convenience also set content attribute
    meta.setAttribute('content', value);
    return meta;
  }

  function setMetaTagsFromPost(post) {
    const title = post.seoTitle || post.title;
    const description = post.metaDescription || post.excerpt || '';
    const image = post.image ? new URL(post.image, window.location.href).href : null;
    const url = window.location.href;

    // title
    document.title = title;

    // description
    setOrCreateMeta({name: "description"}, 'content', description);

    // canonical
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      linkCanonical.href = url;
      document.head.appendChild(linkCanonical);
    } else {
      linkCanonical.href = url;
    }

    // OpenGraph
    setOrCreateMeta({property: 'og:type'}, 'content', 'article');
    setOrCreateMeta({property: 'og:title'}, 'content', title);
    setOrCreateMeta({property: 'og:description'}, 'content', description);
    setOrCreateMeta({property: 'og:url'}, 'content', url);
    if (image) {
      setOrCreateMeta({property: 'og:image'}, 'content', image);
      setOrCreateMeta({property: 'og:image:width'}, 'content', '1200');
      setOrCreateMeta({property: 'og:image:height'}, 'content', '630');
    }

    // Twitter
    setOrCreateMeta({name: 'twitter:card'}, 'content', image ? 'summary_large_image' : 'summary');
    setOrCreateMeta({name: 'twitter:title'}, 'content', title);
    setOrCreateMeta({name: 'twitter:description'}, 'content', description);
    if (image) setOrCreateMeta({name: 'twitter:image'}, 'content', image);
  }

  function insertJsonLd(post) {
    // remove existing if any
    const old = document.getElementById('blogpost-jsonld');
    if (old) old.remove();

    const imageUrl = post.image ? new URL(post.image, window.location.href).href : undefined;
    
    // Converter data para formato ISO (YYYY-MM-DD)
    let isoDate = '';
    if (post.date) {
      const parts = post.date.split('-');
      if (parts.length === 3) {
        isoDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }

    const schema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "alternativeHeadline": post.seoTitle || post.title,
      "image": imageUrl ? [imageUrl] : undefined,
      "author": {
        "@type": "Organization",
        "name": "JB Home Essence",
        "url": window.location.origin
      },
      "publisher": {
        "@type": "Organization",
        "name": "JB Home Essence",
        "logo": {
          "@type": "ImageObject",
          "url": new URL('/img/JBHomeEssence_Verde.png', window.location.origin).href
        }
      },
      "url": window.location.href,
      "datePublished": isoDate,
      "dateModified": isoDate,
      "description": post.metaDescription || post.excerpt || '',
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "articleSection": post.category || "Blog"
    };

    // Adicionar tags se existirem
    if (post.tags && Array.isArray(post.tags)) {
      schema.keywords = post.tags.join(', ');
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'blogpost-jsonld';
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  function renderPostContent(post) {
    // Atualizar os elementos da página
    const titleEl = document.getElementById("post-title");
    const dateEl = document.getElementById("post-date");
    const categoryEl = document.getElementById("post-category");

    if (titleEl) titleEl.textContent = post.title;
    if (dateEl) dateEl.textContent = post.date;
    if (categoryEl) categoryEl.textContent = post.category;

    // Imagem do post
    const img = document.getElementById("post-image");
    if (post.image && img) {
      img.src = post.image;
      img.alt = post.title || "Imagem do post";
      img.style.display = "block";
    } else if (img) {
      img.style.display = "none";
    }

    // Conteúdo principal
    const contentEl = document.getElementById("post-content");
    if (contentEl) contentEl.innerHTML = post.content || "<p>Conteúdo em breve...</p>";

    // Tags (seção opcional)
    const tagsContainer = document.getElementById("post-tags");
    if (tagsContainer && post.tags && Array.isArray(post.tags)) {
      tagsContainer.innerHTML = '';
      post.tags.forEach(tag => {
        const tagElement = document.createElement("span");
        tagElement.className = "tag";
        tagElement.textContent = tag;
        tagsContainer.appendChild(tagElement);
      });
    }

    // Atualizar meta tags
    setMetaTagsFromPost(post);
    
    // Inserir JSON-LD
    insertJsonLd(post);
  }

  // Função para gerar HTML dos cards (igual ao do index.html)
  function generateRelatedPostCard(post) {
    return `
      <div class="blog-card" data-post-link="post.html?id=${post.id}">
        <div class="card-wrapper">
          <figure>
            <img src="${post.image || "https://via.placeholder.com/300x300"}" alt="${post.title}" loading="lazy" />
          </figure>
          <div class="card-body">
            <p class="meta">${post.date} | ${post.category}</p>
            <h2>${post.title}</h2>
            <p class="excerpt">${post.excerpt || ''}</p>
            <a href="post.html?id=${post.id}" class="read-more" aria-label="Ler mais sobre ${post.title}">
              Leia mais <span class="sr-only">sobre ${post.title}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Função para sugerir posts relacionados - NOVO: máximo 2 posts
  function suggestRelatedPosts(allPosts, currentPost) {
    const relatedContainer = document.getElementById("related-posts-container");
    if (!relatedContainer) return;

    // Filtrar posts da mesma categoria, excluindo o atual
    const relatedPosts = allPosts.filter(p => 
      p.id !== currentPost.id && 
      p.category === currentPost.category
    ).slice(0, 2); // NOVO: Limitar a 2 posts (máximo)

    if (relatedPosts.length === 0) {
      // Ocultar completamente a seção se não houver posts relacionados
      const relatedSection = document.querySelector(".related-posts");
      if (relatedSection) {
        relatedSection.style.display = "none";
      }
      return;
    }

    // Gerar HTML dos cards relacionados
    const relatedHTML = relatedPosts.map(post => generateRelatedPostCard(post)).join('');
    
    // Limpar placeholder e inserir cards
    relatedContainer.innerHTML = relatedHTML;
    
    // Adicionar event listeners aos novos cards
    relatedContainer.querySelectorAll(".blog-card").forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".read-more")) return;
        const link = card.getAttribute("data-post-link");
        if (link) window.location.href = link;
      });
    });
    
    // Ajustar layout responsivo baseado no número de posts
    if (relatedPosts.length === 1) {
      // Se tiver apenas 1 post relacionado, centralizar
      relatedContainer.style.display = "flex";
      relatedContainer.style.justifyContent = "center";
      relatedContainer.style.maxWidth = "400px";
      relatedContainer.style.margin = "0 auto";
    } else {
      // Se tiver 2 posts, usar grid normal
      relatedContainer.style.display = "";
      relatedContainer.style.maxWidth = "";
      relatedContainer.style.margin = "";
    }
  }

  // Carregar e renderizar o post
  fetch("../blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      const postId = getQueryParam("id");
      const post = posts.find((p) => p.id === postId);

      if (post) {
        renderPostContent(post);
        
        // Sugerir posts relacionados
        suggestRelatedPosts(posts, post);
      } else {
        document.body.innerHTML = `
          <div class="post-not-found">
            <h1>Post não encontrado</h1>
            <p>O post que você está procurando não existe ou foi removido.</p>
            <a href="../blog/index.html">← Voltar para o blog</a>
          </div>
        `;
      }
    })
    .catch((err) => {
      console.error("Erro ao carregar post:", err);
      document.body.innerHTML = `
        <div class="error-loading">
          <h1>Erro ao carregar o post</h1>
          <p>Desculpe, ocorreu um erro ao carregar o conteúdo. Tente novamente mais tarde.</p>
          <a href="../blog/index.html">← Voltar para o blog</a>
        </div>
      `;
    });

  document.head.appendChild(style);
}