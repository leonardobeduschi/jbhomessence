const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÕES
// ============================================
const CONFIG = {
  postsJsonPath: './posts.json',
  categoriasJsonPath: '../produtos/categorias.json',
  produtosBaseUrl: 'https://jbhomessence.com.br/produtos',
  templatePath: './post-template.html',
  indexTemplatePath: './index-template.html', // NOVO
  outputDir: './posts',
  indexOutputPath: './index.html', // NOVO
  blogBaseUrl: 'https://jbhomessence.com.br/blog',
  siteBaseUrl: 'https://jbhomessence.com.br',
  siteName: 'JB Home Essence',
  siteUrl: 'https://jbhomessence.com.br',
  sitemapOutputPath: '../sitemap.xml',
  robotsOutputPath: '../robots.txt'
};

// Resolver caminhos relativos para o diretório do script (garante funcionamento mesmo quando executado por caminho absoluto)
const baseDir = __dirname;
CONFIG.postsJsonPath = path.resolve(baseDir, CONFIG.postsJsonPath);
CONFIG.templatePath = path.resolve(baseDir, CONFIG.templatePath);
CONFIG.indexTemplatePath = path.resolve(baseDir, CONFIG.indexTemplatePath);
CONFIG.outputDir = path.resolve(baseDir, CONFIG.outputDir);
CONFIG.indexOutputPath = path.resolve(baseDir, CONFIG.indexOutputPath);
// sitemap e robots ficam um diretório acima do blog por design
CONFIG.sitemapOutputPath = path.resolve(baseDir, CONFIG.sitemapOutputPath);
CONFIG.robotsOutputPath = path.resolve(baseDir, CONFIG.robotsOutputPath);
CONFIG.categoriasJsonPath = path.resolve(baseDir, CONFIG.categoriasJsonPath);

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function ensureDirectoryExists(dirPath) {
  const absolutePath = path.resolve(dirPath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
    console.log(`✔ Diretório criado: ${absolutePath}`);
  }
}

function saveFile(filePath, content) {
  const absolutePath = path.resolve(filePath);
  fs.writeFileSync(absolutePath, content, 'utf8');
  console.log(`  Arquivo salvo: ${absolutePath}`);
  return absolutePath;
}

function convertDateToISO(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  return dateStr;
}

function generateMetaTags(post) {
  const title = post.seoTitle || post.title;
  const description = post.metaDescription || post.excerpt || '';
  const image = post.image ? `${CONFIG.siteUrl}${post.image}` : '';
  const url = `${CONFIG.blogBaseUrl}/posts/${post.id}.html`;

  return `
    <!-- SEO Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    
    <!-- Open Graph -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    ${image ? `<meta property="og:image" content="${image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">` : ''}
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    ${image ? `<meta name="twitter:image" content="${image}">` : ''}
  `;
}

function generateJsonLd(post) {
  const imageUrl = post.image ? `${CONFIG.siteUrl}${post.image}` : undefined;
  const isoDate = convertDateToISO(post.date);
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "alternativeHeadline": post.seoTitle || post.title,
    "image": imageUrl ? [imageUrl] : undefined,
    "author": {
      "@type": "Organization",
      "name": CONFIG.siteName,
      "url": CONFIG.siteUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": CONFIG.siteName,
      "logo": {
        "@type": "ImageObject",
        "url": `${CONFIG.siteUrl}/img/brand/jb-home-essence-logo-green.webp`
      }
    },
    "url": `${CONFIG.blogBaseUrl}/posts/${post.id}.html`,
    "datePublished": isoDate,
    "dateModified": isoDate,
    "description": post.metaDescription || post.excerpt || '',
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${CONFIG.blogBaseUrl}/posts/${post.id}.html`
    },
    "articleSection": post.category || "Blog"
  };

  if (post.tags && Array.isArray(post.tags)) {
    schema.keywords = post.tags.join(', ');
  }

  return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}

function generateBreadcrumbJsonLd(post) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": `${CONFIG.siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Blog", "item": `${CONFIG.blogBaseUrl}/` },
      { "@type": "ListItem", "position": 3, "name": post.category || "Blog", "item": `${CONFIG.blogBaseUrl}/#${(post.category || '').toLowerCase()}` },
      { "@type": "ListItem", "position": 4, "name": post.title, "item": `${CONFIG.blogBaseUrl}/posts/${post.id}.html` }
    ]
  };

  return `<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>`;
}

function generateTagsHtml(tags) {
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return '';
  }
  return tags.map(tag => `<span class="tag">${tag}</span>`).join('\n          ');
}

function generateRelatedPostsHtml(allPosts, currentPost) {
  const relatedPosts = allPosts
    .filter(p => p.id !== currentPost.id && p.category === currentPost.category)
    .slice(0, 2);

  if (relatedPosts.length === 0) {
    return '<p>Nenhum post relacionado encontrado.</p>';
  }

  return relatedPosts.map(post => `
      <div class="blog-card" onclick="window.location.href='${post.id}.html'">
        <div class="card-wrapper">
          <figure>
            <img src="${post.image || 'https://via.placeholder.com/300x300'}" alt="${post.title}" loading="lazy" />
          </figure>
          <div class="card-body">
            <p class="meta">${post.date} | ${post.category}</p>
            <h2>${post.title}</h2>
            <p class="excerpt">${post.excerpt || ''}</p>
            <a href="${post.id}.html" class="read-more" aria-label="Ler mais sobre ${post.title}">
              Leia mais <span class="sr-only">sobre ${post.title}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
  `).join('\n');
}

// Remove um <h2> inicial que apenas repete o título do post (evita H1 duplicado como H2 no corpo do artigo)
function stripDuplicateLeadingHeading(content, title) {
  const normalize = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = content.match(/^\s*<h2[^>]*>(.*?)<\/h2>\s*/i);
  if (match && normalize(match[1]) === normalize(title)) {
    return content.slice(match[0].length);
  }
  return content;
}

// Bloco "Produtos relacionados" a partir do campo opcional post.relatedCategorias (slugs de fragrâncias em categorias.json)
function generateProdutosRelacionadosHtml(post, categorias) {
  if (!post.relatedCategorias || !Array.isArray(post.relatedCategorias) || post.relatedCategorias.length === 0) {
    return '';
  }

  const cards = post.relatedCategorias
    .map((slug) => categorias.find((c) => c.slug === slug))
    .filter(Boolean)
    .map((categoria) => `
      <a href="${CONFIG.produtosBaseUrl}/fragrancia/${categoria.slug}/" class="blog-card" style="text-decoration:none;color:inherit;">
        <div class="card-body">
          <h3>${categoria.nome}</h3>
          <p class="excerpt">${categoria.descricao}</p>
        </div>
      </a>`)
    .join('\n');

  if (!cards) return '';

  return `<section class="related-posts">
        <h2>Produtos Relacionados</h2>
        <div class="blog-cards">
          ${cards}
        </div>
      </section>`;
}

function generatePostHtml(post, allPosts, template, categorias) {
  const metaTags = generateMetaTags(post);
  const jsonLd = generateJsonLd(post) + '\n' + generateBreadcrumbJsonLd(post);
  const tagsHtml = generateTagsHtml(post.tags);
  const relatedPostsHtml = generateRelatedPostsHtml(allPosts, post);
  const postContent = stripDuplicateLeadingHeading(post.content, post.title);
  const produtosRelacionadosHtml = generateProdutosRelacionadosHtml(post, categorias);

  let html = template
    .replace('{{META_TAGS}}', metaTags)
    .replace('{{JSON_LD}}', jsonLd)
    .replace('{{POST_TITLE}}', post.title)
    .replace('{{POST_DATE}}', post.date)
    .replace('{{POST_CATEGORY}}', post.category)
    .replace('{{POST_IMAGE}}', post.image || '')
    .replace('{{POST_IMAGE_ALT}}', post.title)
    .replace('{{POST_CONTENT}}', postContent)
    .replace('{{POST_TAGS}}', tagsHtml)
    .replace('{{RELATED_POSTS}}', relatedPostsHtml)
    .replace('{{PRODUTOS_RELACIONADOS}}', produtosRelacionadosHtml);

  return html;
}

// ============================================
// FUNÇÃO: GERAR INDEX.HTML COM SEÇÕES POR CATEGORIA
// ============================================

// Quantidade de cards visíveis por categoria antes de clicar em "Ver mais"
const INITIAL_VISIBLE_CARDS = 3;

function parsePostDate(dateStr) {
  return new Date(dateStr.split('-').reverse().join('-'));
}

// Categorias são ordenadas pela data do post mais recente de cada uma (mais recente primeiro)
function groupPostsByCategory(posts) {
  const groups = new Map();
  posts.forEach(post => {
    const category = post.category || 'Outros';
    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(post);
  });

  groups.forEach(list => list.sort((a, b) => parsePostDate(b.date) - parsePostDate(a.date)));

  const orderedCategories = [...groups.keys()]
    .sort((a, b) => parsePostDate(groups.get(b)[0].date) - parsePostDate(groups.get(a)[0].date));

  return orderedCategories.map(category => ({
    category,
    posts: groups.get(category)
  }));
}

function generateCardHtml(post, index) {
  const extraClass = index >= INITIAL_VISIBLE_CARDS ? ' extra-card' : '';
  return `
        <div class="blog-card${extraClass}">
          <a href="posts/${post.id}.html" style="text-decoration: none; color: inherit;">
            <div class="card-wrapper">
              <figure>
                <img src="${post.image || 'https://via.placeholder.com/300x300'}" alt="${post.title}" loading="lazy" />
              </figure>
              <div class="card-body">
                <p class="meta">${post.date} | ${post.category}</p>
                <h2>${post.title}</h2>
                <p class="excerpt">${post.excerpt}</p>
              </div>
            </div>
          </a>
        </div>`;
}

function generateStaticPostCards(posts) {
  const groups = groupPostsByCategory(posts);

  return groups.map(({ category, posts: categoryPosts }) => {
    const cardsHtml = categoryPosts.map((post, index) => generateCardHtml(post, index)).join('');
    const verMaisHtml = categoryPosts.length > INITIAL_VISIBLE_CARDS ? `
      <div class="ver-mais-container">
        <button type="button" class="ver-mais-btn" onclick="toggleVerMais(this)">
          <span class="ver-mais-label">Ver mais</span>
          <span class="ver-mais-icon">&#9662;</span>
        </button>
      </div>` : '';

    return `
      <div class="blog-category-section">
        <h2 class="blog-category-title">${category}</h2>
        <div class="blog-cards-grid">${cardsHtml}
        </div>${verMaisHtml}
      </div>`;
  }).join('\n');
}

function generateIndexHtml(posts, template) {
  const staticCards = generateStaticPostCards(posts);
  
  let html = template.replace('{{STATIC_POST_CARDS}}', staticCards);
  
  return html;
}

// ============================================
// SITEMAP E ROBOTS
// ============================================
function generateSitemap(posts) {
  const mainPages = [
    { url: `${CONFIG.siteBaseUrl}/`, priority: '1.0', changefreq: 'weekly' },
    { url: `${CONFIG.blogBaseUrl}/`, priority: '0.9', changefreq: 'weekly' }
  ];

  const mainUrls = mainPages.map(page => {
    return `  <url>
    <loc>${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const postUrls = posts.map(post => {
    const isoDate = convertDateToISO(post.date);
    return `  <url>
    <loc>${CONFIG.blogBaseUrl}/posts/${post.id}.html</loc>
    <lastmod>${isoDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${mainUrls}
${postUrls}
</urlset>`;
}

function generateRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${CONFIG.siteBaseUrl}/sitemap.xml`;
}

// ============================================
// FUNÇÃO PRINCIPAL
// ============================================
function generateBlog() {
  console.log('🚀 Iniciando geração do blog estático...\n');
  console.log(`ℹ Diretório atual: ${process.cwd()}\n`);

  // 1. Ler posts.json
  console.log('🔎 Lendo posts.json...');
  const postsData = fs.readFileSync(CONFIG.postsJsonPath, 'utf8');
  const posts = JSON.parse(postsData);
  console.log(`✔ ${posts.length} posts encontrados\n`);

  let categorias = [];
  try {
    categorias = JSON.parse(fs.readFileSync(CONFIG.categoriasJsonPath, 'utf8').replace(/^﻿/, ''));
  } catch (error) {
    console.log('⚠️ categorias.json não encontrado, pulando linkagem com produtos\n');
  }

  // 2. Ler templates
  console.log('📂 Lendo templates...');
  const postTemplate = fs.readFileSync(CONFIG.templatePath, 'utf8');
  console.log('✔ Template de posts carregado');
  
  let indexTemplate;
  try {
    indexTemplate = fs.readFileSync(CONFIG.indexTemplatePath, 'utf8');
    console.log('✔ Template de index carregado\n');
  } catch (error) {
    console.log('⚠️ index-template.html não encontrado, pulando geração do index\n');
  }

  // 3. Criar diretório de posts
  console.log('📁 Criando diretório de posts...');
  ensureDirectoryExists(CONFIG.outputDir);
  console.log('');

  // 4. Gerar páginas HTML dos posts
  console.log('✍️ Gerando páginas HTML dos posts...');
  posts.forEach((post, index) => {
    const html = generatePostHtml(post, posts, postTemplate, categorias);
    const outputPath = path.join(CONFIG.outputDir, `${post.id}.html`);
    saveFile(outputPath, html);
    console.log(`  ${index + 1}. ${post.id}.html`);
  });
  console.log('✔ Todas as páginas dos posts geradas\n');

  // 5. Gerar index.html (NOVO)
  if (indexTemplate) {
    console.log('📄 Gerando index.html com links estáticos...');
    const indexHtml = generateIndexHtml(posts, indexTemplate);
    saveFile(CONFIG.indexOutputPath, indexHtml);
    console.log('✔ index.html gerado\n');
  }

  // 6. Gerar sitemap.xml
  console.log('🌐 Gerando sitemap.xml...');
  const sitemap = generateSitemap(posts);
  const sitemapPath = saveFile(CONFIG.sitemapOutputPath, sitemap);
  console.log('');

  // 7. Gerar robots.txt
  console.log('🤖 Gerando robots.txt...');
  const robotsTxt = generateRobotsTxt();
  const robotsPath = saveFile(CONFIG.robotsOutputPath, robotsTxt);
  console.log('');

  // 8. Resumo final
  console.log('--------------------------------------------------');
  console.log('✔ GERAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('--------------------------------------------------');
  console.log(`✔ Total de posts gerados: ${posts.length}`);
  console.log(`📁 Pasta dos posts: ${path.resolve(CONFIG.outputDir)}/`);
  if (indexTemplate) console.log(`📄 Index gerado: ${path.resolve(CONFIG.indexOutputPath)}`);
  console.log(`🌐 Sitemap: ${sitemapPath}`);
  console.log(`🤖 Robots.txt: ${robotsPath}`);
  console.log('🔗 URLs públicas:');
  console.log(`   - Blog: ${CONFIG.blogBaseUrl}/`);
  console.log(`   - Sitemap: ${CONFIG.siteBaseUrl}/sitemap.xml`);
  console.log(`   - Robots: ${CONFIG.siteBaseUrl}/robots.txt`);
  console.log('\n');
}

// ============================================
// EXECUTAR
// ============================================
if (require.main === module) {
  try {
    generateBlog();
  } catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

module.exports = {
  CONFIG,
  generateBlog,
  generateStaticPostCards,
  generateIndexHtml
};