// ==============================================
// NAVBAR.JS - Versão 2.0
// ==============================================
// Funcionalidades:
// - Menu mobile lateral deslizante
// - Dropdown de Fragrâncias
// - Mudança de cor/transparência no scroll
// - Troca de logo (branca/preta)
// ==============================================

/**
 * Carrega as categorias no dropdown de Fragrâncias
 * Busca do arquivo produtos/categorias.json
 */
async function loadFragranciasDropdown() {
    try {
        const response = await fetch('/produtos/categorias.json');
        const categorias = await response.json();
        const dropdown = document.getElementById('fragranciasDropdown');
        
        if (!dropdown) {
            console.warn('Elemento fragranciasDropdown não encontrado');
            return;
        }
        
        dropdown.innerHTML = categorias.map(cat => `
            <a href="/produtos/categoria.html?categoria=${cat.slug}" class="dropdown-item">
                ${cat.nome}
            </a>
        `).join('');
        
        // Após carregar, reaplica os event listeners nos itens
        initDropdownItems();
    } catch (error) {
        console.error('Erro ao carregar categorias do dropdown:', error);
    }
}

/**
 * Detecta o scroll e muda o estilo da navbar
 * Adiciona classe 'scrolled' quando rolar mais de 50px
 * NÃO aplica se a navbar tiver a classe 'navbar-static'
 */
function initScrollDetection() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) {
        console.warn('Elemento navbar não encontrado');
        return;
    }

    // Se a navbar é estática, não aplica efeito de scroll
    if (navbar.classList.contains('navbar-static')) {
        console.log('✓ Navbar estática - scroll detection desabilitado');
        return;
    }

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    // Executa na carga da página
    handleScroll();

    // Executa no scroll com throttle para performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

/**
 * Inicializa o comportamento do menu mobile lateral
 * Menu desliza da esquerda para direita
 */
function initMobileMenu() {
    const toggleButton = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');

    if (!toggleButton || !menu) {
        console.warn('navToggle ou navMenu não encontrados no DOM');
        return;
    }

    // Abre/fecha menu ao clicar no toggle
    toggleButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
        
        // Previne scroll do body quando menu está aberto
        if (menu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Fecha o menu ao clicar em links diretos (não dropdown)
    const directLinks = menu.querySelectorAll('a:not(.dropdown-toggle):not(.dropdown-item)');
    directLinks.forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Fecha menu ao clicar no overlay (área escura)
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = menu.contains(e.target);
        const isClickOnToggle = toggleButton.contains(e.target);
        
        // Se clicar fora do menu e do toggle, fecha
        if (!isClickInsideMenu && !isClickOnToggle && menu.classList.contains('active')) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Também fecha o dropdown se estiver aberto
            const dropdown = document.querySelector('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });

    // Fecha menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Também fecha o dropdown se estiver aberto
            const dropdown = document.querySelector('.dropdown');
            if (dropdown) {
                dropdown.classList.remove('active');
            }
        }
    });
}

/**
 * Inicializa o comportamento dos itens do dropdown
 * Fecha o menu apenas ao clicar em um item específico
 */
function initDropdownItems() {
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const navMenu = document.getElementById('navMenu');
    const dropdown = document.querySelector('.dropdown');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Fecha o dropdown
            if (dropdown) {
                dropdown.classList.remove('active');
            }
            
            // No mobile, também fecha o menu principal
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

/**
 * Inicializa o dropdown de Fragrâncias
 * Comportamento diferente para desktop e mobile
 */
function initFragranciasDropdown() {
    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdown = document.querySelector('.dropdown');

    if (!dropdownToggle || !dropdown) {
        console.warn('Elementos de dropdown não encontrados no DOM');
        return;
    }

    // Clique no toggle do dropdown - apenas abre/fecha o dropdown
    dropdownToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle do dropdown sem fechar o menu mobile
        dropdown.classList.toggle('active');
    });

    // Fecha dropdown ao clicar fora (apenas desktop)
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768 && !dropdown.contains(e.target)) {
            dropdown.classList.remove('active');
        }
    });

    // Fecha dropdown ao pressionar ESC (sem fechar o menu mobile)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('active')) {
            dropdown.classList.remove('active');
        }
    });
}

/**
 * Função principal que inicializa toda a navbar
 * Chamada quando o DOM está carregado
 */
function initNavbar() {
    // Aguarda o carregamento das categorias
    loadFragranciasDropdown();
    
    // Inicializa detecção de scroll
    initScrollDetection();
    
    // Inicializa menu mobile
    initMobileMenu();
    
    // Inicializa dropdown de fragrâncias
    initFragranciasDropdown();
    
    console.log('✓ Navbar inicializada com sucesso');
}

// Executa quando o documento está pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
} else {
    initNavbar();
}

// Exporta para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavbar,
        initScrollDetection,
        initMobileMenu,
        initFragranciasDropdown,
        loadFragranciasDropdown
    };
}

