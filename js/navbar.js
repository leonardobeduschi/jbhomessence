// ==============================================
// NAVBAR.JS - Versão 3.0
// ==============================================
// Funcionalidades:
// - Menu mobile lateral deslizante
// - Dropdown de Fragrâncias
// - Dropdown de Produtos (NOVO)
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
 * Carrega os tipos de produtos no dropdown de Produtos
 * Busca do arquivo produtos/tipos-produtos.json
 */
async function loadProdutosDropdown() {
    try {
        const response = await fetch('/produtos/tipos-produtos.json');
        const tipos = await response.json();
        const dropdown = document.getElementById('produtosDropdown');
        
        if (!dropdown) {
            console.warn('Elemento produtosDropdown não encontrado');
            return;
        }
        
        dropdown.innerHTML = tipos.map(tipo => `
            <a href="/produtos/categoria.html?tipo=${tipo.slug}" class="dropdown-item">
                ${tipo.nome}
            </a>
        `).join('');
        
        // Após carregar, reaplica os event listeners nos itens
        initDropdownItems();
    } catch (error) {
        console.error('Erro ao carregar tipos de produtos do dropdown:', error);
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
            
            // Também fecha todos os dropdowns se estiverem abertos
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });

    // Fecha menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            menu.classList.remove('active');
            document.body.style.overflow = '';
            
            // Também fecha todos os dropdowns se estiverem abertos
            const dropdowns = document.querySelectorAll('.dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
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
    const dropdowns = document.querySelectorAll('.dropdown');

    dropdownItems.forEach(item => {
        item.addEventListener('click', function() {
            // Fecha todos os dropdowns
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
            
            // No mobile, também fecha o menu principal
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

/**
 * Inicializa todos os dropdowns (Fragrâncias e Produtos)
 * Comportamento diferente para desktop e mobile
 */
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const dropdowns = document.querySelectorAll('.dropdown');

    if (dropdownToggles.length === 0) {
        console.warn('Nenhum dropdown-toggle encontrado no DOM');
        return;
    }

    // Clique em cada toggle do dropdown
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const parentDropdown = this.closest('.dropdown');
            
            // Fecha outros dropdowns
            dropdowns.forEach(dropdown => {
                if (dropdown !== parentDropdown) {
                    dropdown.classList.remove('active');
                }
            });
            
            // Toggle do dropdown atual
            parentDropdown.classList.toggle('active');
        });
    });

    // Fecha dropdowns ao clicar fora (apenas desktop)
    document.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
            const isClickInsideDropdown = Array.from(dropdowns).some(dropdown => 
                dropdown.contains(e.target)
            );
            
            if (!isClickInsideDropdown) {
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        }
    });

    // Fecha dropdowns ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
}

/**
 * Função principal que inicializa toda a navbar
 * Chamada quando o DOM está carregado
 */
function initNavbar() {
    // Aguarda o carregamento das categorias e produtos
    loadFragranciasDropdown();
    loadProdutosDropdown();
    
    // Inicializa detecção de scroll
    initScrollDetection();
    
    // Inicializa menu mobile
    initMobileMenu();
    
    // Inicializa todos os dropdowns
    initDropdowns();
    
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
        initDropdowns,
        loadFragranciasDropdown,
        loadProdutosDropdown
    };
}