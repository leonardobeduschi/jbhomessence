// ======================
// ======================

/**
 * Mostra o resultado do quiz com a fragrância recomendada
 */
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

window.onclick = function(event) {
    if (event.target === document.getElementById('modalImagem')) {
        fecharModal();
    }
}

/**
 * Reinicia o quiz para o estado inicial
 */
function reiniciarQuiz() {
    Object.keys(respostas).forEach(key => delete respostas[key]);
    
    etapaAtual = 0;
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('inicio-quiz').style.display = 'block';
    
    document.querySelector('.seletor-fragrancia').scrollIntoView({ behavior: 'smooth' });
}