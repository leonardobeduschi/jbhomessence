// ============================================
// BLOG INDEX - Listagem de Posts
// ============================================

if (window.location.pathname.includes("/blog/index.html") || 
    window.location.pathname === "/" || 
    window.location.pathname.includes("/blog/")) {
  
  fetch("posts.json")
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
            // ATUALIZADO: Novo caminho para páginas estáticas
            const postUrl = `posts/${post.id}.html`;
            
            return `
              <div class="blog-card" data-post-link="${postUrl}">
                <div class="card-wrapper">
                  <figure>
                    <img src="${post.image || "https://via.placeholder.com/300x300"}" alt="${post.title}" loading="lazy" />
                  </figure>
                  <div class="card-body">
                    <p class="meta">${post.date} | ${post.category}</p>
                    <h2>${post.title}</h2>
                    <p class="excerpt">${post.excerpt}</p>
                    <a href="${postUrl}" class="read-more" aria-label="Ler mais sobre ${post.title}">
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

// ============================================
// NOTA IMPORTANTE
// ============================================
// As páginas individuais de posts agora são HTML estáticos
// gerados automaticamente pelo script gerar-posts.js
// 
// Todo o código de renderização dinâmica de posts foi removido
// porque não é mais necessário - cada post tem seu próprio HTML
// ============================================