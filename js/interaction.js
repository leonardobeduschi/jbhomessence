// ======================
// ======================

document.addEventListener('DOMContentLoaded', function() {
    const quizInicio = document.getElementById('inicio-quiz');
    if (quizInicio) {
        quizInicio.style.display = 'block';
    }

    document.querySelectorAll('.carrossel-container').forEach(container => {
        const cards = container.querySelectorAll('.carousel-item-card');
        const btnPrev = container.querySelector('.carrossel-seta-esquerda');
        const btnNext = container.querySelector('.carrossel-seta-direita');
        const indicadores = container.querySelectorAll('.carrossel-indicadores .indicador');
        let currentIndex = 0;
        let isTransitioning = false;

        function updateIndicadores(index) {
            indicadores.forEach((indicador, i) => {
                indicador.classList.toggle('active', i === index);
            });
        }

        function showCard(index) {
            if (isTransitioning) return;
            isTransitioning = true;
            
            cards[currentIndex].classList.remove('active');
            currentIndex = index;
            cards[currentIndex].classList.add('active');
            updateIndicadores(currentIndex);
            
            setTimeout(() => isTransitioning = false, 600);
        }

        indicadores.forEach((indicador, index) => {
            indicador.addEventListener('click', () => {
                showCard(index);
            });
        });

        btnNext.addEventListener('click', () => 
            showCard((currentIndex + 1) % cards.length));
        
        btnPrev.addEventListener('click', () => 
            showCard((currentIndex - 1 + cards.length) % cards.length));

        showCard(0);
    });

    function setupScrollAnimations(selector) {
        const elements = document.querySelectorAll(selector);
        
        function checkVisibility() {
            const triggerBottom = window.innerHeight * 0.8;
            elements.forEach(element => {
                if (element.getBoundingClientRect().top < triggerBottom) {
                    element.classList.add('visible');
                }
            });
        }

        window.addEventListener('scroll', checkVisibility);
        checkVisibility();
    }

    setupScrollAnimations('.cliente-card');
    setupScrollAnimations('.rodape-grid > div');
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (!toggleButton || !menu) {
        console.error('navToggle or navMenu not found in the DOM');
        return;
    }

    toggleButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
});


if (window.location.pathname.includes("/blog/index.html") || window.location.pathname === "/") {
  fetch("../blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      const cardsContainer = document.querySelector(".blog-cards");
      if (cardsContainer) {
        cardsContainer.innerHTML = posts
          .map((post) => {
            const maxLength = 80;
            const truncatedExcerpt =
              post.excerpt.length > maxLength
                ? post.excerpt.slice(0, maxLength) + "..."
                : post.excerpt;
            return `
              <div class="blog-card">
                <div class="card-wrapper">
                  <figure>
                    <img src="${post.image || "https://via.placeholder.com/300x300"}" alt="${post.title}" />
                  </figure>
                  <div class="card-body">
                    <p class="meta">${post.date} | ${post.category}</p>
                    <h2>${post.title}</h2>
                    <p class="excerpt">${truncatedExcerpt}</p>
                    <a href="post.html?id=${post.id}" class="read-more">
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
      }
    })
    .catch((err) => console.error("Erro ao carregar posts:", err));
}


if (window.location.pathname.includes("/blog/post.html")) {
  fetch("../blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get("id");
      const post = posts.find((p) => p.id === postId);

      if (post) {
        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-date").textContent = post.date;
        document.getElementById("post-category").textContent = post.category;

        const img = document.getElementById("post-image");
        if (post.image) {
          img.src = post.image;
          img.alt = post.title;
        } else {
          img.style.display = "none"; // Se não tiver imagem
        }

        document.getElementById("post-content").innerHTML = post.content;
      } else {
        document.body.innerHTML = "<h1>Post não encontrado</h1>";
      }
    })
    .catch((err) => console.error("Erro ao carregar post:", err));
}

// =====================================================
// =====================================================
// =====================================================