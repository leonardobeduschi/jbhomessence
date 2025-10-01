// QUIZ //

const respostas = {};
let etapaAtual = 0; // 0 = tela inicial

// Catálogo completo de essências com metadados
const catalogoEssencias = {
    "Bambu Garden": {
        tipoPrincipal: "floral",
        tipoSecundario: "amadeirado",
        intensidade: "Suave",
        locaisIdeais: ["casa", "condomínios"],
        notas: ["bergamota", "pomelo", "jasmim", "cedro", "gerânio", "musk", "vetiver", "âmbar"],
        descricao: "Uma fragrância que equilibra a frescura cítrica com a profundidade amadeirada, perfeita para criar um ambiente harmonioso."
    },
    "Capim Santo": {
        tipoPrincipal: "herbal",
        tipoSecundario: "cítrico",
        intensidade: "Suave",
        locaisIdeais: ["casa", "escritório", "clínica"],
        notas: ["cidreira", "cidró", "capim limão", "limão siciliano", "cedro"],
        descricao: "Frescura herbal com um toque cítrico vibrante, ideal para ambientes que necessitam de renovação e energia."
    },
    "Divina Vanilla": {
        tipoPrincipal: "oriental",
        tipoSecundario: "amadeirado",
        intensidade: "Intensa",
        locaisIdeais: ["casa", "lojas"],
        notas: ["baunilha", "musk", "âmbar"],
        descricao: "Doce e aconchegante, esta fragrância cria uma atmosfera acolhedora com suas notas cremosas de baunilha."
    },
    "Encontro": {
        tipoPrincipal: "frutal",
        tipoSecundario: "oriental",
        intensidade: "Intensa",
        locaisIdeais: ["lojas", "escritório"],
        notas: ["maçã", "canela", "laranja", "cravo", "pêssego", "baunilha", "musk"],
        descricao: "Uma celebração de sabores frutais com um toque especiado, perfeita para ambientes sociais."
    },
    "Folhas de outono": {
        tipoPrincipal: "amadeirado",
        tipoSecundario: "agreste",
        intensidade: "Suave",
        locaisIdeais: ["casa", "condomínios"],
        notas: ["bergamota", "lavanda", "sândalo", "jasmim", "musk", "âmbar"],
        descricao: "Captura a essência da mudança de estações com notas terrosas e um toque floral suave."
    },
    "Garbo": {
        tipoPrincipal: "floral",
        tipoSecundario: "frutal",
        intensidade: "Suave",
        locaisIdeais: ["casa", "escritório", "lojas"],
        notas: ["cassis", "pera", "maçã", "violeta", "ameixa", "muguet", "musk", "pêssego branco"],
        descricao: "Elegante e sofisticado, combina a doçura frutal com a suavidade de flores nobres."
    },
    "Havana": {
        tipoPrincipal: "cítrico",
        tipoSecundario: "amadeirado",
        intensidade: "Intensa",
        locaisIdeais: ["escritório", "lojas"],
        notas: ["ervas do mediterrâneo", "limão siciliano"],
        descricao: "Energizante e vibrante, com notas cítricas que revigoram qualquer ambiente."
    },
    "Hortênsia": {
        tipoPrincipal: "floral",
        tipoSecundario: "doce",
        intensidade: "Suave",
        locaisIdeais: ["casa", "clínica"],
        notas: ["gerânio", "peônia", "violeta", "hortênsia", "musk"],
        descricao: "A doçura das flores em seu esplendor, criando uma atmosfera romântica e delicada."
    },
    "Jardins da França": {
        tipoPrincipal: "floral",
        tipoSecundario: "agreste",
        intensidade: "Suave",
        locaisIdeais: ["casa", "condomínios", "clínica"],
        notas: ["lavanda", "alecrim", "gerânio", "menta", "cashmere", "jasmim", "almíscar", "âmbar"],
        descricao: "Transporte-se para os campos floridos da França com esta fragrância herbácea e floral."
    },
    "Lavanda Inglesa": {
        tipoPrincipal: "floral",
        tipoSecundario: "herbal",
        intensidade: "Suave",
        locaisIdeais: ["casa", "clínica"],
        notas: ["violeta", "lavanda", "limão", "patchouly", "musk"],
        descricao: "O clássico atemporal da lavanda combinado com notas herbais para um efeito calmante."
    },
    "Singular": {
        tipoPrincipal: "amadeirado",
        tipoSecundario: "especiado",
        intensidade: "Intensa",
        locaisIdeais: ["escritório", "lojas"],
        notas: ["bergamota", "canela", "cravo", "noz moscada", "sândalo", "vetiver", "patchouly", "cedro", "âmbar"],
        descricao: "Uma composição ousada de madeiras e especiarias para quem busca uma assinatura marcante."
    }
};

// Produtos disponíveis
const produtosDisponiveis = {
    "Home Spray": {
        descricao: "Home Spray - Perfeito para ambientação rápida",
        intensidade: ["Suave", "Intensa"]
    },
    "Difusor de varetas": {
        descricao: "Difusor de Varetas - Liberação contínua e suave",
        intensidade: ["Suave"]
    },
    "Sabonete líquido": {
        descricao: "Sabonete Líquido - Aromaterapia no seu dia a dia",
        intensidade: ["Suave"]
    },
    "Essências": {
        descricao: "Essência - Para difusores elétricos",
        intensidade: ["Suave", "Intensa"]
    }
};

function iniciarQuiz() {
    etapaAtual = 1;
    document.getElementById('inicio-quiz').style.display = 'none';
    document.getElementById(`etapa${etapaAtual}`).style.display = 'block';
}

function responder(chave, valor) {
    respostas[chave] = valor;
    
    // Esconde etapa atual
    document.getElementById(`etapa${etapaAtual}`).style.display = 'none';
    
    // Próxima etapa
    etapaAtual++;

    if (document.getElementById(`etapa${etapaAtual}`)) {
        document.getElementById(`etapa${etapaAtual}`).style.display = 'block';
    } else {
        // Se não houver mais etapas normais, mostra carregando
        document.getElementById('carregando').style.display = 'block';

        setTimeout(() => {
            document.getElementById('carregando').style.display = 'none';
            mostrarResultado();
        }, 2000); // Tempo de carregamento
    }
}

function encontrarEssenciaIdeal() {
    const tipoPreferido = respostas.aroma.toLowerCase();
    const intensidadePreferida = respostas.intensidade;
    const localPreferido = respostas.local.toLowerCase();
    const produtoPreferido = respostas.produto;
    
    // Sistema de pontuação
    const essenciasComPontuacao = Object.entries(catalogoEssencias).map(([nome, dados]) => {
        let pontuacao = 0;
        
        // Tipo de aroma (principal tem mais peso)
        if (dados.tipoPrincipal === tipoPreferido) pontuacao += 3;
        else if (dados.tipoSecundario === tipoPreferido) pontuacao += 1;
        
        // Intensidade
        if (dados.intensidade === intensidadePreferida) pontuacao += 2;
        
        // Local ideal
        if (dados.locaisIdeais.includes(localPreferido)) pontuacao += 2;
        else if (localPreferido === "outro") pontuacao += 1; // Dá pontuação parcial para "outro"
        
        // Compatibilidade com produto
        const produto = produtosDisponiveis[produtoPreferido];
        if (produto.intensidade.includes(dados.intensidade)) pontuacao += 1;
        
        // Pontuação extra para características específicas
        if (tipoPreferido === "floral") {
            // Dá preferência para florais herbais em clínicas
            if (localPreferido === "clínica" && dados.tipoSecundario === "herbal") pontuacao += 1;
            
            // Dá preferência para florais agrestes em casas/condomínios
            if ((localPreferido === "casa" || localPreferido === "condomínios") && 
                dados.tipoSecundario === "agreste") pontuacao += 1;
        }
        
        return {
            nome: nome,
            dados: dados,
            pontuacao: pontuacao
        };
    });
    
    // Ordena por pontuação (maior primeiro)
    essenciasComPontuacao.sort((a, b) => b.pontuacao - a.pontuacao);
    
    // Pega as 3 melhores opções
    const melhoresOpcoes = essenciasComPontuacao.slice(0, 3);
    
    // Se houver empate, usa critérios de desempate
    if (melhoresOpcoes.length > 1 && melhoresOpcoes[0].pontuacao === melhoresOpcoes[1].pontuacao) {
        // Desempate 1: Prefere o tipo principal ao secundário
        melhoresOpcoes.sort((a, b) => {
            if (a.dados.tipoPrincipal === tipoPreferido && b.dados.tipoPrincipal !== tipoPreferido) return -1;
            if (a.dados.tipoPrincipal !== tipoPreferido && b.dados.tipoPrincipal === tipoPreferido) return 1;
            return 0;
        });
        
        // Desempate 2: Prefere melhor match com local
        melhoresOpcoes.sort((a, b) => {
            const aTemLocal = a.dados.locaisIdeais.includes(localPreferido);
            const bTemLocal = b.dados.locaisIdeais.includes(localPreferido);
            
            if (aTemLocal && !bTemLocal) return -1;
            if (!aTemLocal && bTemLocal) return 1;
            return 0;
        });
    }
    
    // Retorna a melhor opção, mas agora mostrando também alternativas
    const melhorEssencia = melhoresOpcoes[0];
    
    // Adiciona as alternativas ao objeto de retorno
    return [melhorEssencia.nome, {
        ...melhorEssencia.dados,
        alternativas: melhoresOpcoes.slice(1).map(op => op.nome)
    }];
}

// ======================
// FUNÇÕES DO QUIZ
// ======================

/**
 * Mostra o resultado do quiz com a fragrância recomendada
 */
function mostrarResultado() {
    // Rolagem suave para a seção
    document.querySelector('.seletor-fragrancia').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('resultado').style.display = 'block';
    
    // Obtém a essência recomendada
    const [essenciaNome, essenciaDados] = encontrarEssenciaIdeal();
    const produtoEscolhido = produtosDisponiveis[respostas.produto];
    const notasFormatadas = essenciaDados.notas.join(', ');
    
    // Prepara alternativas (se houver)
    let alternativasHTML = '';
    if (essenciaDados.alternativas?.length > 0) {
        alternativasHTML = `
            <div class="alternativas">
                <h4>Você também pode gostar:</h4>
                <ul>
                    ${essenciaDados.alternativas.map(alt => `<li>${alt}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    // Gera o HTML do resultado
    const resultadoHTML = `
        <div class="essencia-recomendada">
            <div class="cabecalho-essencia">
                <div class="imagem-essencia">
                    <img src="img/${essenciaNome.toLowerCase().replace(/\s+/g, '-')}.jpg" 
                         alt="${essenciaNome}" 
                         onclick="ampliarImagem(this.src, '${essenciaNome}')">
                </div>
                <div class="info-basica">
                    <h3>${essenciaNome}</h3>
                    <p class="descricao">${essenciaDados.descricao}</p>
                    <p class="notas"><strong>Notas Olfativas:</strong> ${notasFormatadas}</p>
                </div>
            </div>
            
            <div class="detalhes-essencia">
                <div class="caracteristicas">
                    <h4>Características:</h4>
                    <p><strong>Tipo Principal:</strong> ${capitalizeFirstLetter(essenciaDados.tipoPrincipal)}</p>
                    <p><strong>Tipo Secundário:</strong> ${capitalizeFirstLetter(essenciaDados.tipoSecundario)}</p>
                    <p><strong>Intensidade:</strong> ${essenciaDados.intensidade}</p>
                    <p><strong>Locais Ideais:</strong> ${essenciaDados.locaisIdeais.map(capitalizeFirstLetter).join(', ')}</p>
                </div>
                
                <div class="produto-recomendado">
                    <h4>Produto Recomendado:</h4>
                    <p>${produtoEscolhido.descricao}</p>
                    <p class="compatibilidade">Perfeito para ${respostas.local.toLowerCase()} com fragrância ${respostas.intensidade.toLowerCase()}!</p>
                </div>
            </div>
            
            ${alternativasHTML}
            
            <div class="resumo-escolhas">
                <h4>Suas Preferências:</h4>
                <div class="preferencias-grid">
                    <div><strong>Aroma:</strong> ${respostas.aroma}</div>
                    <div><strong>Intensidade:</strong> ${respostas.intensidade}</div>
                    <div><strong>Local:</strong> ${respostas.local}</div>
                    <div><strong>Produto:</strong> ${respostas.produto}</div>
                </div>
            </div>
        </div>
        
        <div class="cta-final">
            <a href="https://wa.me/47997152830" class="whatsapp-btn" target="_blank">
                <i class="fab fa-whatsapp"></i> Falar no WhatsApp
            </a>
        </div>
    `;

    document.getElementById('fragrancia').innerHTML = resultadoHTML;
}

/**
 * Capitaliza a primeira letra de uma string
 */
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Amplia uma imagem no modal
 */
function ampliarImagem(src, alt) {
    const modal = document.getElementById('modalImagem');
    const imgAmpliada = document.getElementById('imagemAmpliada');
    
    imgAmpliada.src = src;
    imgAmpliada.alt = alt;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal de imagem ampliada
 */
function fecharModal() {
    const modal = document.getElementById('modalImagem');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Fecha o modal clicando fora da imagem
window.onclick = function(event) {
    if (event.target === document.getElementById('modalImagem')) {
        fecharModal();
    }
}

/**
 * Reinicia o quiz para o estado inicial
 */
function reiniciarQuiz() {
    // Limpa respostas
    Object.keys(respostas).forEach(key => delete respostas[key]);
    
    // Reseta para a tela inicial
    etapaAtual = 0;
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('inicio-quiz').style.display = 'block';
    
    // Rolagem suave
    document.querySelector('.seletor-fragrancia').scrollIntoView({ behavior: 'smooth' });
}

// ======================
// CARROSSÉIS E ANIMAÇÕES
// ======================

document.addEventListener('DOMContentLoaded', function() {
    // Inicializa o quiz
    const quizInicio = document.getElementById('inicio-quiz');
    if (quizInicio) {
        quizInicio.style.display = 'block';
    }

    // Configura todos os carrosséis
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

        // Click event for indicators
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

    // Configura animações de scroll
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

    // Aplica animações aos cards e rodapé
    setupScrollAnimations('.cliente-card');
    setupScrollAnimations('.rodape-grid > div');
});

document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    // Check if elements exist before adding event listeners
    if (!toggleButton || !menu) {
        console.error('navToggle or navMenu not found in the DOM');
        return;
    }

    toggleButton.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    // Optional: Close menu when a link is clicked
    const links = menu.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
});


// BLOG.JS //
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


// POST.JS //
if (window.location.pathname.includes("/blog/post.html")) {
  fetch("../blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      const params = new URLSearchParams(window.location.search);
      const postId = params.get("id");
      const post = posts.find((p) => p.id === postId);

      if (post) {
        // Título, data, categoria
        document.getElementById("post-title").textContent = post.title;
        document.getElementById("post-date").textContent = post.date;
        document.getElementById("post-category").textContent = post.category;

        // Imagem principal
        const img = document.getElementById("post-image");
        if (post.image) {
          img.src = post.image;
          img.alt = post.title;
        } else {
          img.style.display = "none"; // Se não tiver imagem
        }

        // Conteúdo
        document.getElementById("post-content").innerHTML = post.content;
      } else {
        document.body.innerHTML = "<h1>Post não encontrado</h1>";
      }
    })
    .catch((err) => console.error("Erro ao carregar post:", err));
}
