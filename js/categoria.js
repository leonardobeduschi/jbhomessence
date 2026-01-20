/**
 * categoria.js - Script para carregar categorias e tipos de produtos via URL
 * Uso: 
 * - /produtos/categoria.html?categoria=abbraccio (fragrância)
 * - /produtos/categoria.html?tipo=home-spray (tipo de produto)
 * 
 * NOVO: Inclui modal "Sobre" para fragrâncias + SEO otimizado
 */

// ========== VARIÁVEIS GLOBAIS ==========

let categoryPageProducts = [];
let categoryList = [];
let tiposList = [];
let currentProducts = []; // Produtos filtrados atuais
let displayedCount = 0; // Contador de produtos exibidos
const PRODUCTS_PER_LOAD = 8; // Quantidade de produtos por carregamento

// ========== DESCRIÇÕES DAS FRAGRÂNCIAS ==========

const fragranciasDescricoes = {
  "abbraccio": {
    nome: "Abbraccio",
    descricao: "Uma explosão de frescor que combina a energia vibrante dos cítricos com o toque suave de flores delicadas. Celebre o movimento sutil e a elegância romântica de um campo florido ao entardecer, envolvida por um aconchego leve e inesquecível.",
    descricaoOlfativa: "Cítrico-Floral",
    notas: "bergamota, pomelo, capim limão, gengibre, violeta, fresia, musk e sândalo",
    inspiracao: "Inspirada em um dia de verão no campo, com brisa fresca e sol vibrante. Bergamota e pomelo abrem com energia cítrica, capim-limão e gengibre explodem em frescor picante, violeta e freesia trazem flores delicadas, e musk envolve em aconchego. Celebra leveza, feminilidade e movimento sutil ao entardecer.",
    beneficios: [
    "Energizante e revitalizante para o dia",
    "Desperta os sentidos com frescor cítrico",
    "Equilibra energia com suavidade floral",
    "Cria sensação de liberdade e elegância romântica"
    ],
    palavrasChave: ["Energia vibrante", "Movimento sutil", "Elegância romântica", "Aconchego", "Campo florido", "Explosão dos sentidos", "Celebração"]
  },
  "aroma-do-bebe": {
    nome: "Aroma do Bebê",
    descricao: "Um perfume suave que transmite segurança, pureza e tranquilidade, como o abraço acolhedor de um lar preparado para um bebê. Notas delicadas de lavandin, rosas e baunilha criam um ambiente calmo, limpo e amorosamente perfumado. Ideal para quem busca transformar o espaço em um refúgio de serenidade e conforto.",
    descricaoOlfativa: "Herbal-Musk",
    notas: "lavandin, gerânio, rosas, eucalipto, baunilha e musk",
    inspiracao: "Inspirado no aconchego sereno de um quarto de bebê, com lavandin e gerânio trazendo tranquilidade pura, rosas delicadas e eucalipto purificando o ar fresco, e baunilha envolvendo em doçura reconfortante. Fusão de frescor herbal e musk para calma e segurança absoluta.",
    beneficios: [
      "Promove tranquilidade e relaxamento profundo",
      "Purifica o ambiente com frescor natural",
      "Cria aura acolhedora e suave para descanso",
      "Ideal para espaços de segurança e conforto diário"
    ],
    palavrasChave: ["Segurança", "Conforto", "Aconchego", "Suavidade", "Calma", "Purificação"]
  },
  "bambu-garden": {
    nome: "Bambu Garden",
    descricao: "Um convite à leveza e ao equilíbrio, como um passeio sereno por um jardim de bambus ao entardecer, trazendo frescor elegante e uma conexão sutil com a natureza. Ideal para criar um ambiente calmo, transparente e cheio de tranquilidade.",
    descricaoOlfativa: "Floral-Amadeirado",
    notas: "bergamota, pomelo, jasmim, cedro, gerânio, musk, vetiver e âmbar",
    inspiracao: "Inspirado em um jardim secreto de bambu, com brisa fresca entre folhas verdes, cítricos luminosos, jasmim e gerânio florescendo delicadamente, e cedro com vetiver ancorando em base amadeirada terrosa. Harmonia de frescor elegante, serenidade e conexão com a natureza.",
    beneficios: [
      "Equilibra o ambiente com serenidade natural",
      "Traz vitalidade fresca e transparência ao ar",
      "Evoca harmonia entre floral, verde e madeira",
      "Perfeito para momentos de tranquilidade e leveza"
    ],
    palavrasChave: ["Equilíbrio", "Harmonia", "Leveza", "Tranquilidade", "Transparência", "Frescor elegante", "Conexão"]
  },
  "capim-santo": {
    nome: "Capim Santo",
    descricao: "Frescor que acalma e revigora, como o aroma puro de um campo verde ao amanhecer. Uma combinação herbal e cítrica que desperta memórias afetivas e convida à introspecção, bem-estar e relaxamento. Ideal para transformar o ambiente em um espaço de cura, saúde e meditação.",
    descricaoOlfativa: "Herbal-Cítrico",
    notas: "cidreira, cidrão, capim limão, limão siciliano e cedro",
    inspiracao: "Inspirado em um campo fresco ao amanhecer, com brisa herbácea e cítrica. Cidreira e cidró abrem em explosão refrescante, capim-limão e limão siciliano energizam com vitalidade, e madeira seca ancora em tranquilidade natural. Imersão em renovação, purificação e bem-estar.",
    beneficios: [
      "Purifica e renova o ar com frescor herbal",
      "Energiza e vitaliza ambientes diários",
      "Promove relaxamento e introspecção profunda",
      "Ideal para meditação e saúde emocional"
    ],
    palavrasChave: ["Memória afetiva", "Bem-estar", "Saúde", "Cura", "Introspecção", "Relaxamento", "Meditação"]
  },
  "divina-vanilla": {
    nome: "Divina Vanilla",
    descricao: "Doçura envolvente, calor e elegância em cada borrifada: como um abraço perfumado que acolhe e encanta. A baunilha se une ao âmbar e ao musk para criar um ambiente sedutor, íntimo e sofisticado. Perfeito para momentos de prazer, conforto e celebração das boas memórias.",
    descricaoOlfativa: "Oriental-Amadeirado",
    notas: "baunilha, musk e âmbar",
    inspiracao: "Inspirada na doçura rica da baunilha, espalhando calor e conforto como um abraço ao entardecer. Notas orientais e amadeiradas criam profundidade luxuosa, serenidade e elegância, transformando o espaço em refúgio íntimo de prazer e lembranças carinhosas.",
    beneficios: [
      "Envolve em aconchego e suavidade reconfortante",
      "Cria atmosfera de luxo e tranquilidade",
      "Ideal para momentos íntimos e relaxantes",
      "Evoca prazer sensorial e sofisticação diária"
    ],
    palavrasChave: ["Elegância", "Sedutor", "Abraço", "Conforto", "Calor", "Doçura", "Prazer"]
  },
  "encontro": {
    nome: "Encontro",
    descricao: "Uma fragrância que une a energia frutada da maçã e laranja ao calor da canela e cravo, suavizada por pêssego, baunilha e musk, criando um ambiente acolhedor, vibrante e inesquecivelmente envolvente.",
    descricaoOlfativa: "Frutal-Oriental",
    notas: "maçã, canela, laranja, cravo, pêssego, baunilha e musk",
    inspiracao: "Inspirado em um encontro caloroso, com maçã e laranja frutais revigorantes, canela e cravo picantes aquecendo como lareira, pêssego cremoso equilibrando, e baunilha com musk seduzindo na base. Harmonia de doçura, calor e sofisticação envolvente.",
    beneficios: [
      "Cria acolhimento quente e receptivo",
      "Desperta sentidos com equilíbrio frutal e picante",
      "Perfeita para noites íntimas e conversas profundas",
      "Proporciona conforto cremoso e prazer duradouro"
    ],
    palavrasChave: ["Calor", "Quente", "Envolvente", "Sedutor", "Cremoso", "Conforto", "Profundo", "Sofisticação"]
  },
  "garbo": {
    nome: "Garbo",
    descricao: "Garbo é uma fragrância que combina frutas suculentas e flores delicadas, criando um ambiente elegante, fresco e envolvente, com sensação de leveza, prazer e harmonia a cada aplicação.",
    descricaoOlfativa: "Floral-Frutal",
    notas: "cassis, pera, maçã, violeta, ameixa, muguet, musk e pêssego branco",
    inspiracao: "Inspirado em flores frescas e frutas maduras, irradiando elegância. Cassis, pêra e maçã abrem frutal e crocante, ameixa e pêssego branco adicionam suculência aveludada, fundindo-se em harmonia luminosa de frescor e prazer intenso.",
    beneficios: [
      "Refresca com leveza frutal e floral delicada",
      "Cria atmosfera luminosa e prazerosa",
      "Equilibra doçura suculenta para bem-estar diário",
      "Ideal para ambientes elegantes e harmoniosos"
    ],
    palavrasChave: ["Elegância", "Frescor frutal", "Suculento", "Luminoso", "Harmonia", "Prazer", "Delicadeza"]
  },
  "havana": {
    nome: "Havana",
    descricao: "Uma fragrância vibrante que combina ervas do Mediterrâneo e limão siciliano para criar um ambiente fresco, natural e revigorante, com um fundo amadeirado que traz equilíbrio e sofisticação.",
    descricaoOlfativa: "Cítrico-Amadeirado",
    notas: "ervas do mediterrâneo e limão siciliano",
    inspiracao: "Inspirada em campos mediterrâneos ao sol, com tomilho, alecrim e manjericão herbais frescos, limão siciliano explodindo em cítrico vital, e base amadeirada sofisticada. Vibração expansiva de liberdade, alegria e conexão natural.",
    beneficios: [
      "Revigora com frescor herbal e cítrico intenso",
      "Edifica energia e vitalidade no ambiente",
      "Cria sensação alegre e expansiva",
      "Perfeita para dias vibrantes e revigorantes"
    ],
    palavrasChave: ["Revigorante", "Expansivo", "Vibrante", "Alegre", "Intenso", "Edificante"]
  },
  "hortensia": {
    nome: "Hortênsia",
    descricao: "Inspirada na flor símbolo de Gramado, esta fragrância delicadamente floral envolve o ambiente com a doçura e o frescor das hortênsias, criando uma atmosfera leve, romântica e encantadora.",
    descricaoOlfativa: "Floral-Doce",
    notas: "gerânio, peônia, violeta, hortênsia e musk",
    inspiracao: "Inspirada nas hortênsias de Gramado, com notas florais graciosas e românticas, herbáceas frescas e doçura envolvente. Como buquê recém-colhido em jardim encantado, desperta feminilidade, vibração delicada e harmonia colorida da floração efêmera.",
    beneficios: [
      "Cria aura floral leve e revigorante",
      "Evoca doçura romântica e feminina",
      "Ideal para ambientes harmoniosos e agradáveis",
      "Transforma espaços em jardins delicados"
    ],
    palavrasChave: ["Romântica", "Colorido", "Feminino", "Jovem", "Delicado", "Florido", "Harmonioso", "Agradável", "Envolvente"]
  },
  "jardins-da-franca": {
    nome: "Jardins da França",
    descricao: "“Jardins da França” combina lavanda, alecrim, gerânio e menta com um toque suave de cashmere, criando um ambiente fresco, floral e aconchegante que evoca a serenidade dos jardins franceses.",
    descricaoOlfativa: "Floral-Agreste",
    notas: "lavanda, alecrim, gerânio, menta, cashmere, jasmim, almíscar e âmbar",
    inspiracao: "Inspirado em jardins rústicos franceses, com lavanda acolhedora, alecrim revigorante, gerânio picante e menta fresca, ancorados em cashmere macio. Fusão de frescor herbal, floral e amadeirado para refúgio sereno e elegante.",
    beneficios: [
      "Relaxa com suavidade herbal e floral",
      "Equilibra frescor e aconchego natural",
      "Cria ambiente sofisticado e envolvente",
      "Perfeita para serenidade diária glamourosa"
    ],
    palavrasChave: ["Sofisticado", "Imponente", "Envolvente", "Expansivo", "Glamour"]
  },
  "lilas": {
    nome: "Lilás",
    descricao: "Lilás é uma fragrância sofisticada que combina notas cítricas, florais e herbais para criar um ambiente de paz, equilíbrio e elegância.",
    descricaoOlfativa: "Aromático-Fougère",
    notas: "limão, lavanda, bergamota, gerânio, estragão, rosa, patchouly, vetiver, cumaru e musk",
    inspiracao: "Inspirado em campos de lavanda florescendo, com explosão cítrica vibrante, lavanda e gerânio harmoniosos, estragão herbáceo sutil, rosa romântica e patchouly terroso. Paz floral e equilíbrio sofisticado para desejo sereno.",
    beneficios: [
      "Desperta alegria e frescor revigorante",
      "Promove equilíbrio e ternura relaxante",
      "Cria atmosfera atemporal e serena",
      "Ideal para experiências sensoriais sutis"
    ],
    palavrasChave: ["Atemporal", "Equilíbrio", "Desejo", "Sutileza", "Alegre", "Ternura", "Sereno"]
  },
  "monte-carlo": {
    nome: "Monte Carlo",
    descricao: "Monte Carlo é uma fragrância chypre amadeirada que une frescor cítrico, especiarias e notas terrosas, criando um refúgio sofisticado de elegância e mistério.",
    descricaoOlfativa: "Chypre-Amadeirado",
    notas: "tangerina, noz moscada, gerânio, patchouly, almíscar, vetiver e musgo de carvalho",
    inspiracao: "Inspirado em refúgio luxuoso mediterrâneo, com tangerina cítrica iluminada, noz-moscada especiada, gerânio floral, patchouly terroso, vetiver e musgo de carvalho profundos. Elegância chypre amadeirada, misteriosa e refinada.",
    beneficios: [
      "Ilumina com frescor cítrico e especiarias",
      "Cria profundidade terrosa e envolvente",
      "Evoca sofisticação imponente e quente",
      "Perfeita para ambientes intensos e invernais"
    ],
    palavrasChave: ["Imponente", "Profundo", "Intenso", "Invernoso", "Especiado", "Quente", "Terroso"]
  },
  "patchouly": {
    nome: "Patchouly",
    descricao: "Patchouly é uma fragrância oriental que combina frescor vibrante e notas amadeiradas terrosas, criando um ambiente místico, elegante e envolvente.",
    descricaoOlfativa: "Amadeirado-Oriental",
    notas: "bergamota, lavanda, gerânio, cravo, muguet, cedro e patchouly",
    inspiracao: "Inspirado em misticismo oriental, com abertura fresca vibrante, coração delicado puro, e base amadeirada terrosa rica. Patchouly assinatura envolvente, complexa e elegante para aura misteriosa e duradoura.",
    beneficios: [
      "Envolve com profundidade terrosa e elegante",
      "Cria frescor puro e mistério persistente",
      "Ideal para ambientes complexos e sofisticados",
      "Proporciona sensação mística e reconfortante"
    ],
    palavrasChave: ["Profunda", "Complexa", "Elegante", "Envolvente", "Misteriosa", "Terrosa"]
  }
};

// ========== CAPTURA DE PARÂMETROS URL ==========

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// ========== DETECÇÃO DE TIPO DE PÁGINA ==========

function isPaginaFragrancia() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.has('categoria') && !urlParams.has('tipo');
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
    'aromatizador': 'Aromatizador',
    'difusor-varetas': 'Difusor de Varetas',
    'sabonete-liquido': 'Sabonete Líquido',
    'essencias': 'Essência',
    'vela-aromatica': 'Vela Aromática',
    'aromatizador-carro': 'Kit Carro',
    'agua-perfumada': 'Água Perfumada'
  };
  
  const nomeBusca = tipoNomeMap[tipoSlug];
  if (!nomeBusca) return [];
  
  return categoryPageProducts.filter(prod => 
    prod.nome.toLowerCase().includes(nomeBusca.toLowerCase())
  );
}

// ========== SEO: META TAGS DINÂMICAS ==========

function atualizarMetaTags(categoriaSlug, tipoSlug) {
  if (categoriaSlug) {
    const fragrancia = fragranciasDescricoes[categoriaSlug];
    if (fragrancia) {
      // Atualiza título
      document.title = `${fragrancia.nome} - JB Home Essence | Perfumaria de Ambientes em Balneário Camboriú`;
      
      // Atualiza ou cria meta description
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `${fragrancia.descricao} Família olfativa: ${fragrancia.familiaOlfativa}. Produtos de perfumaria para ambientes em Balneário Camboriú.`;

      // Adiciona meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.name = 'keywords';
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = `${fragrancia.nome}, fragrância ${fragrancia.familiaOlfativa}, aromatizador, difusor de varetas, perfume de ambiente, Balneário Camboriú, JB Home Essence`;
      
      // Open Graph tags
      let ogTitle = document.querySelector('meta[property="og:title"]');
      if (!ogTitle) {
        ogTitle = document.createElement('meta');
        ogTitle.setAttribute('property', 'og:title');
        document.head.appendChild(ogTitle);
      }
      ogTitle.content = `${fragrancia.nome} - JB Home Essence`;
      
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (!ogDesc) {
        ogDesc = document.createElement('meta');
        ogDesc.setAttribute('property', 'og:description');
        document.head.appendChild(ogDesc);
      }
      ogDesc.content = fragrancia.descricao;
    }
  } else if (tipoSlug) {
    const tipo = getTipoBySlug(tipoSlug);
    if (tipo) {
      document.title = `${tipo.nome} - JB Home Essence | Perfumaria de Ambientes`;
    }
  }
}

// ========== MODAL "SOBRE A FRAGRÂNCIA" ==========

function exibirModalSobre(slugFragrancia) {
  const fragrancia = fragranciasDescricoes[slugFragrancia];
  
  if (!fragrancia) {
    console.warn('Descrição não encontrada para:', slugFragrancia);
    return;
  }

  // Remove modal existente se houver
  const modalExistente = document.getElementById('modal-sobre-fragrancia');
  if (modalExistente) {
    modalExistente.remove();
  }

  // Gera o caminho da imagem da fragrância (nova pasta: sobre)
  const imagemFragrancia = `../img/fragrancias/sobre/fragrancia-${slugFragrancia}-jb-home-essence.png`;

  // Cria o modal
  const modal = document.createElement('div');
  modal.id = 'modal-sobre-fragrancia';
  modal.className = 'modal-sobre-overlay';
  
  modal.innerHTML = `
    <div class="modal-sobre-container">
      <button class="modal-sobre-close" aria-label="Fechar">&times;</button>
      
      <div class="modal-sobre-content">
        <div class="modal-sobre-header">
          <img src="${imagemFragrancia}" alt="${fragrancia.nome}" onerror="this.src='../img/placeholder.png'">
        </div>

        <div class="modal-sobre-body">
          <h2 class="modal-sobre-titulo">${fragrancia.nome}</h2>

          <section class="modal-sobre-section">
            <p class="modal-sobre-descricao">${fragrancia.descricao}</p>
          </section>

          <section class="modal-sobre-section">
            <h3><i class="fas fa-leaf"></i> Descrição Olfativa</h3>
            <p class="modal-sobre-info-text">${fragrancia.descricaoOlfativa}</p>
          </section>

          <section class="modal-sobre-section">
            <h3><i class="fas fa-flask"></i> Notas</h3>
            <p class="modal-sobre-info-text">${fragrancia.notas}</p>
          </section>

          <section class="modal-sobre-section">
            <h3><i class="fas fa-lightbulb"></i> Inspiração</h3>
            <p class="modal-sobre-info-text">${fragrancia.inspiracao}</p>
          </section>

          <section class="modal-sobre-section">
            <h3><i class="fas fa-star"></i> Benefícios</h3>
            <ul class="modal-sobre-beneficios">
              ${fragrancia.beneficios.map(b => `<li><i class="fas fa-check-circle"></i> ${b}</li>`).join('')}
            </ul>
          </section>

          <section class="modal-sobre-section">
            <h3><i class="fas fa-tags"></i> Características</h3>
            <div class="modal-sobre-palavras-chave">
              ${fragrancia.palavrasChave.map(p => `<span class="palavra-chave-tag">${p}</span>`).join('')}
            </div>
          </section>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  // Animação de entrada
  setTimeout(() => modal.classList.add('active'), 10);

  // Event listeners para fechar
  const btnClose = modal.querySelector('.modal-sobre-close');
  btnClose.addEventListener('click', fecharModalSobre);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) fecharModalSobre();
  });

  document.addEventListener('keydown', function handleEsc(e) {
    if (e.key === 'Escape') {
      fecharModalSobre();
      document.removeEventListener('keydown', handleEsc);
    }
  });
}

function fecharModalSobre() {
  const modal = document.getElementById('modal-sobre-fragrancia');
  if (modal) {
    modal.classList.remove('active');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

function adicionarBotaoSobre() {
  const categoriaSlug = getQueryParam('categoria');
  
  if (!categoriaSlug || !isPaginaFragrancia()) {
    return; // Não adiciona botão se não for página de fragrância
  }

  const categoryHeader = document.querySelector('.category-header');
  if (!categoryHeader) return;

  // Verifica se já existe o botão
  if (document.getElementById('btn-sobre-fragrancia')) return;

  const btnSobre = document.createElement('button');
  btnSobre.id = 'btn-sobre-fragrancia';
  btnSobre.className = 'btn-sobre-fragrancia';
  btnSobre.innerHTML = `
    <i class="fas fa-info-circle"></i>
    <span>Sobre esta fragrância</span>
  `;
  
  btnSobre.addEventListener('click', () => exibirModalSobre(categoriaSlug));
  
  // Insere após a descrição
  const description = categoryHeader.querySelector('#category-description');
  if (description) {
    description.insertAdjacentElement('afterend', btnSobre);
  } else {
    categoryHeader.appendChild(btnSobre);
  }
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

// ========== MODAL DE PRODUTOS ==========

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

  // Atualiza meta tags para SEO
  atualizarMetaTags(categoriaSlug, tipoSlug);

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

  // Adiciona botão "Sobre" apenas para fragrâncias
  adicionarBotaoSobre();

  // Configura modal de produtos
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