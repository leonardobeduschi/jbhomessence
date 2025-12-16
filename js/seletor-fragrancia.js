/* Seletor de Fragrância - VERSÃO 2.1 CORRIGIDA */
(function(){
  'use strict';

  const respostas = {};
  let etapaAtual = 0;
  const totalEtapas = 5;

  // Catálogo expandido com pesos para melhor distribuição
  const catalogoEssencias = {
    "ABBRACCIO": {
      tipoPrincipal: "cítrico",
      tipoSecundario: "floral",
      intensidade: "Suave",
      momentos: ["Manhã", "Tarde", "Todo Dia"],
      sensacoes: ["Energia", "Aconchego"],
      locaisIdeais: ["Casa", "Condomínios", "Escritório"],
      notas: ["bergamota", "pomelo", "capim limão", "gengibre", "violeta", "fresia", "musk", "sândalo"],
      descricao: "Uma fusão vibrante de notas cítricas e florais, criando uma sensação fresca e acolhedora.",
      slug: "abbraccio"
    },
    "AROMA DO BEBÊ": {
      tipoPrincipal: "herbal",
      tipoSecundario: "musk",
      intensidade: "Suave",
      momentos: ["Manhã", "Tarde", "Todo Dia"],
      sensacoes: ["Relaxamento", "Aconchego"],
      locaisIdeais: ["Casa", "Clínica", "Condomínios"],
      notas: ["lavandin", "gerânio", "rosas", "eucalipto", "baunilha", "musk"],
      descricao: "Uma fragrância suave e reconfortante, com toques herbais e um fundo almiscarado.",
      slug: "aroma-do-bebe"
    },
    "BAMBU GARDEN": {
      tipoPrincipal: "floral",
      tipoSecundario: "amadeirado",
      intensidade: "Suave",
      momentos: ["Tarde", "Noite", "Todo Dia"],
      sensacoes: ["Relaxamento", "Sofisticação"],
      locaisIdeais: ["Casa", "Condomínios"],
      notas: ["bergamota", "pomelo", "jasmim", "cedro", "gerânio", "musk", "vetiver", "âmbar"],
      descricao: "Equilibra a frescura cítrica com a profundidade amadeirada, criando harmonia perfeita.",
      slug: "bambu-garden"
    },
    "CAPIM SANTO": {
      tipoPrincipal: "herbal",
      tipoSecundario: "cítrico",
      intensidade: "Suave",
      momentos: ["Manhã", "Tarde"],
      sensacoes: ["Energia", "Relaxamento"],
      locaisIdeais: ["Casa", "Escritório", "Clínica"],
      notas: ["cidreira", "cidrão", "capim limão", "limão siciliano", "cedro"],
      descricao: "Frescura herbal com toque cítrico vibrante, ideal para renovação e energia.",
      slug: "capim-santo"
    },
    "DIVINA VANILLA": {
      tipoPrincipal: "oriental",
      tipoSecundario: "amadeirado",
      intensidade: "Intensa",
      momentos: ["Noite", "Todo Dia"],
      sensacoes: ["Aconchego", "Sofisticação"],
      locaisIdeais: ["Casa", "Lojas"],
      notas: ["baunilha", "musk", "âmbar"],
      descricao: "Doce e acolhedora, cria uma atmosfera envolvente com suas notas cremosas de baunilha.",
      slug: "divina-vanilla"
    },
    "ENCONTRO": {
      tipoPrincipal: "frutal",
      tipoSecundario: "oriental",
      intensidade: "Intensa",
      momentos: ["Tarde", "Noite"],
      sensacoes: ["Sofisticação", "Energia"],
      locaisIdeais: ["Lojas", "Escritório"],
      notas: ["maçã", "canela", "laranja", "cravo", "pêssego", "baunilha", "musk"],
      descricao: "Uma celebração de sabores frutais com toque especiado, perfeita para ambientes sociais.",
      slug: "encontro"
    },
    "GARBO": {
      tipoPrincipal: "floral",
      tipoSecundario: "frutal",
      intensidade: "Suave",
      momentos: ["Manhã", "Tarde", "Todo Dia"],
      sensacoes: ["Sofisticação", "Aconchego"],
      locaisIdeais: ["Casa", "Escritório", "Lojas"],
      notas: ["cassis", "pera", "maçã", "violeta", "ameixa", "muguet", "musk", "pêssego branco"],
      descricao: "Elegante e sofisticado, combina a doçura frutal com a suavidade de flores nobres.",
      slug: "garbo"
    },
    "HAVANA": {
      tipoPrincipal: "cítrico",
      tipoSecundario: "amadeirado",
      intensidade: "Intensa",
      momentos: ["Manhã", "Tarde"],
      sensacoes: ["Energia", "Sofisticação"],
      locaisIdeais: ["Escritório", "Lojas"],
      notas: ["ervas do mediterrâneo", "limão siciliano"],
      descricao: "Energizante e vibrante, com notas cítricas que revigoram qualquer ambiente.",
      slug: "havana"
    },
    "HORTÊNSIA": {
      tipoPrincipal: "floral",
      tipoSecundario: "doce",
      intensidade: "Suave",
      momentos: ["Tarde", "Noite"],
      sensacoes: ["Relaxamento", "Aconchego"],
      locaisIdeais: ["Casa", "Clínica"],
      notas: ["gerânio", "peônia", "violeta", "hortênsia", "musk"],
      descricao: "A doçura das flores em seu esplendor, criando uma atmosfera romântica e delicada.",
      slug: "hortensia"
    },
    "JARDINS DA FRANÇA": {
      tipoPrincipal: "floral",
      tipoSecundario: "agreste",
      intensidade: "Suave",
      momentos: ["Manhã", "Tarde", "Todo Dia"],
      sensacoes: ["Relaxamento", "Sofisticação"],
      locaisIdeais: ["Casa", "Condomínios", "Clínica"],
      notas: ["lavanda", "alecrim", "gerânio", "menta", "cashmere", "jasmim", "almíscar", "âmbar"],
      descricao: "Transporte-se para os campos floridos da França com esta fragrância herbácea e floral.",
      slug: "jardins-da-franca"
    },
    "LILÁS": {
      tipoPrincipal: "aromático",
      tipoSecundario: "fougère",
      intensidade: "Suave",
      momentos: ["Manhã", "Tarde", "Todo Dia"],
      sensacoes: ["Energia", "Relaxamento"],
      locaisIdeais: ["Casa", "Condomínios", "Escritório"],
      notas: ["limão", "lavanda", "bergamota", "gerânio", "estragão", "rosa", "patchouly", "vetiver", "cumaru", "musk"],
      descricao: "Um buquê aromático clássico com nuances fougère, evocando a frescura de um jardim florido.",
      slug: "lilas"
    },
    "MONTE CARLO": {
      tipoPrincipal: "chypre",
      tipoSecundario: "madeira",
      intensidade: "Intensa",
      momentos: ["Tarde", "Noite"],
      sensacoes: ["Sofisticação", "Energia"],
      locaisIdeais: ["Escritório", "Lojas", "Condomínios"],
      notas: ["tangerina", "noz moscada", "gerânio", "patchouly", "almíscar", "vetiver", "musgo de carvalho"],
      descricao: "Sofisticada e clássica da família chypre, com toques frutais, especiados e fundo amadeirado.",
      slug: "monte-carlo"
    },
    "PATCHOULY": {
      tipoPrincipal: "amadeirado",
      tipoSecundario: "oriental",
      intensidade: "Intensa",
      momentos: ["Noite", "Todo Dia"],
      sensacoes: ["Sofisticação", "Aconchego"],
      locaisIdeais: ["Casa", "Lojas", "Escritório"],
      notas: ["bergamota", "lavanda", "gerânio", "cravo", "muguet", "cedro", "patchouly"],
      descricao: "A riqueza terrosa e amadeirada do patchouli equilibrada por notas florais e especiadas.",
      slug: "patchouly"
    }
  };

  // Algoritmo de pontuação melhorado
  function encontrarEssenciaIdeal() {
    const essenciasComPontuacao = Object.entries(catalogoEssencias).map(([nome, dados]) => {
      let pontuacao = 0;
      let detalhes = [];

      // Tipo de aroma (peso 5)
      if (dados.tipoPrincipal === respostas.aroma?.toLowerCase()) {
        pontuacao += 5;
        detalhes.push('Tipo principal compatível');
      } else if (dados.tipoSecundario === respostas.aroma?.toLowerCase()) {
        pontuacao += 3;
        detalhes.push('Tipo secundário compatível');
      }

      // Intensidade (peso 4)
      if (dados.intensidade === respostas.intensidade) {
        pontuacao += 4;
        detalhes.push('Intensidade perfeita');
      }

      // Momento (peso 3)
      if (dados.momentos?.includes(respostas.momento)) {
        pontuacao += 3;
        detalhes.push('Ideal para o momento escolhido');
      }

      // Sensação (peso 3)
      if (dados.sensacoes?.includes(respostas.sensacao)) {
        pontuacao += 3;
        detalhes.push('Proporciona a sensação desejada');
      }

      // Local (peso 4)
      if (dados.locaisIdeais.includes(respostas.local)) {
        pontuacao += 4;
        detalhes.push('Perfeito para o local');
      }

      // Bônus de combinações especiais
      if (respostas.aroma === 'Floral' && respostas.sensacao === 'Relaxamento') {
        if (dados.tipoSecundario === 'agreste' || dados.tipoSecundario === 'herbal') {
          pontuacao += 2;
        }
      }

      if (respostas.intensidade === 'Intensa' && respostas.momento === 'Noite') {
        if (dados.tipoPrincipal === 'oriental' || dados.tipoPrincipal === 'amadeirado') {
          pontuacao += 2;
        }
      }

      if (respostas.local === 'Clínica' && dados.tipoPrincipal === 'herbal') {
        pontuacao += 2;
      }

      return {
        nome: nome,
        dados: dados,
        pontuacao: pontuacao,
        detalhes: detalhes
      };
    });

    // Ordena por pontuação
    essenciasComPontuacao.sort((a, b) => {
      if (b.pontuacao !== a.pontuacao) {
        return b.pontuacao - a.pontuacao;
      }
      // Em caso de empate, prioriza tipo principal
      if (a.dados.tipoPrincipal === respostas.aroma?.toLowerCase()) return -1;
      if (b.dados.tipoPrincipal === respostas.aroma?.toLowerCase()) return 1;
      return 0;
    });

    const melhoresOpcoes = essenciasComPontuacao.slice(0, 3);
    const melhorEssencia = melhoresOpcoes[0];

    return [melhorEssencia.nome, {
      ...melhorEssencia.dados,
      alternativas: melhoresOpcoes.slice(1).map(op => ({
        nome: op.nome,
        slug: op.dados.slug
      })),
      pontuacao: melhorEssencia.pontuacao,
      detalhes: melhorEssencia.detalhes
    }];
  }

  function atualizarProgresso() {
    const progresso = (etapaAtual / totalEtapas) * 100;
    document.getElementById('progressFill').style.width = `${progresso}%`;
    
    // Atualiza steps
    document.querySelectorAll('.step').forEach((step, index) => {
      if (index < etapaAtual) {
        step.classList.add('completed');
        step.classList.remove('active');
      } else if (index === etapaAtual) {
        step.classList.add('active');
        step.classList.remove('completed');
      } else {
        step.classList.remove('active', 'completed');
      }
    });
  }

  function iniciarQuiz() {
    etapaAtual = 1;
    document.getElementById('inicio-quiz').classList.remove('active');
    document.getElementById('inicio-quiz').classList.add('fade-out');
    
    // Mostra barra de progresso
    document.querySelector('.progress-container').style.display = 'block';
    
    setTimeout(() => {
      document.getElementById('inicio-quiz').style.display = 'none';
      document.getElementById(`etapa${etapaAtual}`).style.display = 'block';
      setTimeout(() => {
        document.getElementById(`etapa${etapaAtual}`).classList.add('active');
        atualizarProgresso();
      }, 50);
    }, 300);
  }

  function responder(chave, valor, icone) {
    respostas[chave] = valor;
    
    // Animação de saída
    const etapaAtiva = document.getElementById(`etapa${etapaAtual}`);
    etapaAtiva.classList.remove('active');
    etapaAtiva.classList.add('fade-out');
    
    setTimeout(() => {
      etapaAtiva.style.display = 'none';
      etapaAtual++;

      if (etapaAtual <= totalEtapas) {
        const proximaEtapa = document.getElementById(`etapa${etapaAtual}`);
        proximaEtapa.style.display = 'block';
        setTimeout(() => {
          proximaEtapa.classList.add('active');
          atualizarProgresso();
        }, 50);
      } else {
        // Mostrar carregamento
        mostrarCarregamento();
      }
    }, 300);
  }

  function mostrarCarregamento() {
    const carregando = document.getElementById('carregando');
    carregando.style.display = 'block';
    setTimeout(() => carregando.classList.add('active'), 50);

    // Anima as etapas de carregamento
    let stepIndex = 1;
    const loadingSteps = document.querySelectorAll('.loading-step');
    
    const animateStep = () => {
      if (stepIndex < loadingSteps.length) {
        loadingSteps[stepIndex - 1].classList.remove('active');
        loadingSteps[stepIndex - 1].classList.add('completed');
        loadingSteps[stepIndex - 1].querySelector('i').className = 'fas fa-check-circle';
        
        loadingSteps[stepIndex].classList.add('active');
        stepIndex++;
        
        setTimeout(animateStep, 1200);
      } else {
        setTimeout(() => {
          loadingSteps[stepIndex - 1].classList.remove('active');
          loadingSteps[stepIndex - 1].classList.add('completed');
          loadingSteps[stepIndex - 1].querySelector('i').className = 'fas fa-check-circle';
          mostrarResultado();
        }, 1200);
      }
    };

    setTimeout(animateStep, 1200);
  }

  function mostrarResultado() {
    document.getElementById('carregando').classList.remove('active');
    document.getElementById('carregando').classList.add('fade-out');
    
    setTimeout(() => {
      document.getElementById('carregando').style.display = 'none';
      
      // Esconde barra de progresso
      document.querySelector('.progress-container').style.display = 'none';
      
      document.getElementById('resultado').style.display = 'block';
      setTimeout(() => {
        document.getElementById('resultado').classList.add('active');
        gerarResultado();
      }, 50);
    }, 300);
  }

  function gerarResultado() {
    const [essenciaNome, essenciaDados] = encontrarEssenciaIdeal();
    const notasFormatadas = essenciaDados.notas.join(', ');
    const compatibilidade = Math.round((essenciaDados.pontuacao / 19) * 100);

    let alternativasHTML = '';
    if (essenciaDados.alternativas?.length > 0) {
      alternativasHTML = `
        <div class="alternativas-section">
          <h4><i class="fas fa-heart"></i> Você também pode gostar:</h4>
          <div class="alternativas-grid">
            ${essenciaDados.alternativas.map(alt => `
              <a href="/produtos/categoria.html?categoria=${alt.slug}" class="alternativa-card" target="_blank">
                <i class="fas fa-spa"></i>
                <span>${alt.nome}</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    const resultadoHTML = `
      <div class="resultado-container">
        <div class="resultado-header">
          <div class="success-icon">
            <i class="fas fa-check-circle"></i>
          </div>
          <h3>Sua Fragrância Perfeita!</h3>
          <div class="compatibilidade-badge">
            <span class="compatibilidade-numero">${compatibilidade}%</span>
            <span class="compatibilidade-texto">de compatibilidade</span>
          </div>
        </div>

        <div class="essencia-card">
          <div class="essencia-imagem">
            <img src="img/fragrancias/fragrancia-${essenciaDados.slug}-jb-home-essence.jpg" 
                 alt="${essenciaNome}">
            <div class="imagem-shine"></div>
          </div>
          
          <div class="essencia-info">
            <h4 class="essencia-nome">${essenciaNome}</h4>
            <p class="essencia-descricao">${essenciaDados.descricao}</p>
            
            <div class="notas-container">
              <h5><i class="fas fa-flask"></i> Notas Olfativas</h5>
              <div class="notas-tags">
                ${essenciaDados.notas.map(nota => `<span class="nota-tag">${nota}</span>`).join('')}
              </div>
            </div>

            <div class="caracteristicas-grid">
              <div class="caracteristica">
                <i class="fas fa-leaf"></i>
                <strong>Tipo:</strong>
                <span>${capitalizeFirstLetter(essenciaDados.tipoPrincipal)}</span>
              </div>
              <div class="caracteristica">
                <i class="fas fa-fire-alt"></i>
                <strong>Intensidade:</strong>
                <span>${essenciaDados.intensidade}</span>
              </div>
              <div class="caracteristica">
                <i class="fas fa-clock"></i>
                <strong>Momentos:</strong>
                <span>${essenciaDados.momentos.join(', ')}</span>
              </div>
              <div class="caracteristica">
                <i class="fas fa-map-marker-alt"></i>
                <strong>Locais:</strong>
                <span>${essenciaDados.locaisIdeais.join(', ')}</span>
              </div>
            </div>
          </div>
        </div>

        ${alternativasHTML}

        <div class="acoes-resultado">
          <a href="/produtos/categoria.html?categoria=${essenciaDados.slug}" class="btn-catalogo" target="_blank">
            <i class="fas fa-shopping-bag"></i>
            <span>Ver Catálogo</span>
          </a>
          <a href="https://wa.me/47997152830?text=Olá!%20Descobri%20minha%20fragrância%20ideal:%20${essenciaNome}" 
             class="btn-whatsapp" target="_blank">
            <i class="fab fa-whatsapp"></i>
            <span>Falar no WhatsApp</span>
          </a>
        </div>

        <div class="resumo-escolhas">
          <h5>Suas Preferências</h5>
          <div class="preferencias-lista">
            <div class="preferencia-item">
              <i class="fas fa-clock"></i>
              <span>${respostas.momento}</span>
            </div>
            <div class="preferencia-item">
              <i class="fas fa-leaf"></i>
              <span>${respostas.aroma}</span>
            </div>
            <div class="preferencia-item">
              <i class="fas fa-spa"></i>
              <span>${respostas.sensacao}</span>
            </div>
            <div class="preferencia-item">
              <i class="fas fa-map-marker-alt"></i>
              <span>${respostas.local}</span>
            </div>
            <div class="preferencia-item">
              <i class="fas fa-fire-alt"></i>
              <span>${respostas.intensidade}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('fragrancia').innerHTML = resultadoHTML;
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Expor funções globais
  window.iniciarQuiz = iniciarQuiz;
  window.responder = responder;
})();