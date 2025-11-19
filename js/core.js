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
        }, 2000); // Tempo de carregamento
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
        else if (localPreferido === "outro") pontuacao += 1; // Dá pontuação parcial para "outro"
        
        const produto = produtosDisponiveis[produtoPreferido];
        if (produto.intensidade.includes(dados.intensidade)) pontuacao += 1;
        
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