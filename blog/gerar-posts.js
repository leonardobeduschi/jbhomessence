const fs = require('fs');
const path = require('path');

// ============================================
// CONFIGURAÇÕES
// ============================================
const CONFIG = {
  postsJsonPath: './posts.json',
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

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

function ensureDirectoryExists(dirPath) {
  const absolutePath = path.resolve(dirPath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, { recursive: true });
    console.log(`✓ Diretório criado: ${absolutePath}`);
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
        "url": `${CONFIG.siteUrl}/img/brand/jb-home-essence-logo-green.png`
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

function generatePostHtml(post, allPosts, template) {
  const metaTags = generateMetaTags(post);
  const jsonLd = generateJsonLd(post);
  const tagsHtml = generateTagsHtml(post.tags);
  const relatedPostsHtml = generateRelatedPostsHtml(allPosts, post);

  let html = template
    .replace('{{META_TAGS}}', metaTags)
    .replace('{{JSON_LD}}', jsonLd)
    .replace('{{POST_TITLE}}', post.title)
    .replace('{{POST_DATE}}', post.date)
    .replace('{{POST_CATEGORY}}', post.category)
    .replace('{{POST_IMAGE}}', post.image || '')
    .replace('{{POST_IMAGE_ALT}}', post.title)
    .replace('{{POST_CONTENT}}', post.content)
    .replace('{{POST_TAGS}}', tagsHtml)
    .replace('{{RELATED_POSTS}}', relatedPostsHtml);

  return html;
}

// ============================================
// NOVA FUNÇÃO: GERAR INDEX.HTML COM LINKS ESTÁTICOS
// ============================================
function generateStaticPostCards(posts) {
  // Ordenar por data (mais recentes primeiro)
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date.split('-').reverse().join('-'));
    const dateB = new Date(b.date.split('-').reverse().join('-'));
    return dateB - dateA;
  });

  return sortedPosts.map(post => `
        <div class="blog-card">
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
        </div>`).join('\n');
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
    { url: `${CONFIG.siteBaseUrl}/sobre`, priority: '0.8', changefreq: 'monthly' },
    { url: `${CONFIG.siteBaseUrl}/servicos`, priority: '0.8', changefreq: 'monthly' },
    { url: `${CONFIG.siteBaseUrl}/contato`, priority: '0.7', changefreq: 'monthly' },
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
  console.log(`📂 Diretório atual: ${process.cwd()}\n`);

  // 1. Ler posts.json
  console.log('📖 Lendo posts.json...');
  const postsData = fs.readFileSync(CONFIG.postsJsonPath, 'utf8');
  const posts = JSON.parse(postsData);
  console.log(`✓ ${posts.length} posts encontrados\n`);

  // 2. Ler templates
  console.log('📄 Lendo templates...');
  const postTemplate = fs.readFileSync(CONFIG.templatePath, 'utf8');
  console.log('✓ Template de posts carregado');
  
  let indexTemplate;
  try {
    indexTemplate = fs.readFileSync(CONFIG.indexTemplatePath, 'utf8');
    console.log('✓ Template de index carregado\n');
  } catch (error) {
    console.log('⚠️  index-template.html não encontrado, pulando geração do index\n');
  }

  // 3. Criar diretório de posts
  console.log('📁 Criando diretório de posts...');
  ensureDirectoryExists(CONFIG.outputDir);
  console.log('');

  // 4. Gerar páginas HTML dos posts
  console.log('⚙️  Gerando páginas HTML dos posts...');
  posts.forEach((post, index) => {
    const html = generatePostHtml(post, posts, postTemplate);
    const outputPath = path.join(CONFIG.outputDir, `${post.id}.html`);
    saveFile(outputPath, html);
    console.log(`  ${index + 1}. ${post.id}.html`);
  });
  console.log('✓ Todas as páginas dos posts geradas\n');

  // 5. Gerar index.html (NOVO)
  if (indexTemplate) {
    console.log('📝 Gerando index.html com links estáticos...');
    const indexHtml = generateIndexHtml(posts, indexTemplate);
    saveFile(CONFIG.indexOutputPath, indexHtml);
    console.log('✓ index.html gerado\n');
  }

  // 6. Gerar sitemap.xml
  console.log('🗺️  Gerando sitemap.xml...');
  const sitemap = generateSitemap(posts);
  const sitemapPath = saveFile(CONFIG.sitemapOutputPath, sitemap);
  console.log('');

  // 7. Gerar robots.txt
  console.log('🤖 Gerando robots.txt...');
  const robotsTxt = generateRobotsTxt();
  const robotsPath = saveFile(CONFIG.robotsOutputPath, robotsTxt);
  console.log('');

  // 8. Resumo final
  console.log('╔═══════════════════════════════════════╗');
  console.log('✅ GERAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('╚═══════════════════════════════════════╝');
  console.log(`📊 Total de posts gerados: ${posts.length}`);
  console.log(`📂 Pasta dos posts: ${path.resolve(CONFIG.outputDir)}/`);
  console.log(`📝 Index gerado: ${path.resolve(CONFIG.indexOutputPath)}`);
  console.log(`🗺️  Sitemap: ${sitemapPath}`);
  console.log(`🤖 Robots.txt: ${robotsPath}`);
  console.log(`🌐 URLs públicas:`);
  console.log(`   - Blog: ${CONFIG.blogBaseUrl}/`);
  console.log(`   - Sitemap: ${CONFIG.siteBaseUrl}/sitemap.xml`);
  console.log(`   - Robots: ${CONFIG.siteBaseUrl}/robots.txt`);
  console.log('╚═══════════════════════════════════════╝\n');
}

// ============================================
// EXECUTAR
// ============================================
try {
  generateBlog();
} catch (error) {
  console.error('❌ ERRO:', error.message);
  console.error(error.stack);
  process.exit(1);
}