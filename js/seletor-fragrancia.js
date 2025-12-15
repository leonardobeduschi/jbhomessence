/* Seletor de Fragrância - Isolado em arquivo próprio */
(function(){
  'use strict';

  const respostas = {};
  let etapaAtual = 0; // 0 = tela inicial

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
          notas: ["violeta", "lavanda", "limão", "patchouli", "musk"],
          descricao: "O clássico atemporal da lavanda combinado com notas herbais para um efeito calmante."
      },
      "Singular": {
          tipoPrincipal: "amadeirado",
          tipoSecundario: "especiado",
          intensidade: "Intensa",
          locaisIdeais: ["escritório", "lojas"],
          notas: ["bergamota", "canela", "cravo", "noz moscada", "sândalo", "vetiver", "patchouli", "cedro", "âmbar"],
          descricao: "Uma composição ousada de madeiras e especiarias para quem busca uma assinatura marcante."
      }
  };

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
      document.getElementById(`etapa${etapaAtual}`).style.display = 'none';
      etapaAtual++;

      if (document.getElementById(`etapa${etapaAtual}`)) {
          document.getElementById(`etapa${etapaAtual}`).style.display = 'block';
      } else {
          document.getElementById('carregando').style.display = 'block';

          setTimeout(() => {
              document.getElementById('carregando').style.display = 'none';
              mostrarResultado();
          }, 2000);
      }
  }

  function encontrarEssenciaIdeal() {
      const tipoPreferido = respostas.aroma.toLowerCase();
      const intensidadePreferida = respostas.intensidade;
      const localPreferido = respostas.local.toLowerCase();
      const produtoPreferido = respostas.produto;

      const essenciasComPontuacao = Object.entries(catalogoEssencias).map(([nome, dados]) => {
          let pontuacao = 0;

          if (dados.tipoPrincipal === tipoPreferido) pontuacao += 3;
          else if (dados.tipoSecundario === tipoPreferido) pontuacao += 1;

          if (dados.intensidade === intensidadePreferida) pontuacao += 2;

          if (dados.locaisIdeais.includes(localPreferido)) pontuacao += 2;
          else if (localPreferido === "outro") pontuacao += 1;

          const produto = produtosDisponiveis[produtoPreferido];
          if (produto && produto.intensidade.includes(dados.intensidade)) pontuacao += 1;

          if (tipoPreferido === "floral") {
              if (localPreferido === "clínica" && dados.tipoSecundario === "herbal") pontuacao += 1;

              if ((localPreferido === "casa" || localPreferido === "condomínios") && 
                  dados.tipoSecundario === "agreste") pontuacao += 1;
          }

          return {
              nome: nome,
              dados: dados,
              pontuacao: pontuacao
          };
      });

      essenciasComPontuacao.sort((a, b) => b.pontuacao - a.pontuacao);

      const melhoresOpcoes = essenciasComPontuacao.slice(0, 3);

      if (melhoresOpcoes.length > 1 && melhoresOpcoes[0].pontuacao === melhoresOpcoes[1].pontuacao) {
          melhoresOpcoes.sort((a, b) => {
              if (a.dados.tipoPrincipal === tipoPreferido && b.dados.tipoPrincipal !== tipoPreferido) return -1;
              if (a.dados.tipoPrincipal !== tipoPreferido && b.dados.tipoPrincipal === tipoPreferido) return 1;
              return 0;
          });

          melhoresOpcoes.sort((a, b) => {
              const aTemLocal = a.dados.locaisIdeais.includes(localPreferido);
              const bTemLocal = b.dados.locaisIdeais.includes(localPreferido);

              if (aTemLocal && !bTemLocal) return -1;
              if (!aTemLocal && bTemLocal) return 1;
              return 0;
          });
      }

      const melhorEssencia = melhoresOpcoes[0];

      return [melhorEssencia.nome, {
          ...melhorEssencia.dados,
          alternativas: melhoresOpcoes.slice(1).map(op => op.nome)
      }];
  }

  function mostrarResultado() {
      document.querySelector('.seletor-fragrancia').scrollIntoView({ behavior: 'smooth' });
      document.getElementById('resultado').style.display = 'block';
      const [essenciaNome, essenciaDados] = encontrarEssenciaIdeal();
      const produtoEscolhido = produtosDisponiveis[respostas.produto];
      const notasFormatadas = essenciaDados.notas.join(', ');

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

      const resultadoHTML = `
          <div class="essencia-recomendada">
              <div class="cabecalho-essencia">
                  <div class="imagem-essencia">
                      <img src="img/fragrancias/fragrancia-${essenciaNome.toLowerCase().replace(/\s+/g, '-')}-jb-home-essence.jpg" 
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
                      <p>${produtoEscolhido?.descricao || ''}</p>
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

  function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function ampliarImagem(src, alt) {
      const modal = document.getElementById('modalImagem');
      const imgAmpliada = document.getElementById('imagemAmpliada');
      imgAmpliada.src = src;
      imgAmpliada.alt = alt;
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
  }

  function fecharModal() {
      const modal = document.getElementById('modalImagem');
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
  }

  window.onclick = function(event) {
      if (event.target === document.getElementById('modalImagem')) {
          fecharModal();
      }
  }

  function reiniciarQuiz() {
      Object.keys(respostas).forEach(key => delete respostas[key]);
      etapaAtual = 0;
      document.getElementById('resultado').style.display = 'none';
      document.getElementById('inicio-quiz').style.display = 'block';
      document.querySelector('.seletor-fragrancia').scrollIntoView({ behavior: 'smooth' });
  }

  // Expor funções que são chamadas via attributes inline
  window.iniciarQuiz = iniciarQuiz;
  window.responder = responder;
  window.reiniciarQuiz = reiniciarQuiz;
  window.ampliarImagem = ampliarImagem;
  window.fecharModal = fecharModal;
})();