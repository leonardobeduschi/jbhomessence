const fs = require('fs');
const path = require('path');
const { ensureDirectoryExists, saveFile, slugify } = require('../scripts/lib/fs-utils');

// ============================================
// CONFIGURAÇÕES
// ============================================
const baseDir = __dirname;
const CONFIG = {
  produtosJsonPath: path.resolve(baseDir, './produtos.json'),
  categoriasJsonPath: path.resolve(baseDir, './categorias.json'),
  tiposJsonPath: path.resolve(baseDir, './tipos-produtos.json'),
  produtoTemplatePath: path.resolve(baseDir, './produto-template.html'),
  fragranciaTemplatePath: path.resolve(baseDir, './fragrancia-template.html'),
  tipoTemplatePath: path.resolve(baseDir, './tipo-template.html'),
  catalogIndexTemplatePath: path.resolve(baseDir, './index-template.html'),
  catalogIndexOutputPath: path.resolve(baseDir, './index.html'),
  outputDir: baseDir,
  siteUrl: 'https://jbhomessence.com.br',
  produtosBaseUrl: 'https://jbhomessence.com.br/produtos',
  siteName: 'JB Home Essence',
  sitemapPath: path.resolve(baseDir, '../sitemap.xml')
};

// Mapa usado para localizar produtos de um "tipo" (mesma lógica do js/categoria.js)
const TIPO_NOME_MAP = {
  'home-spray': 'Home Spray',
  'difusor-varetas': 'Difusor de Varetas',
  'sabonete-liquido': 'Sabonete Líquido',
  'essencias': 'Essência',
  'vela-aromatica': 'Vela Aromática',
  'aromatizador-carro': 'Kit Carro',
  'agua-perfumada': 'Água Perfumada',
  'refil': 'Refil'
};

function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8').replace(/^﻿/, '');
  return JSON.parse(raw);
}

function formatPrice(preco) {
  return `R$ ${Number(preco).toFixed(2).replace('.', ',')}`;
}

function absoluteImg(imgPath) {
  // imagens em produtos.json são relativas a /produtos/ (ex: ../img/...)
  return `${CONFIG.siteUrl}/${imgPath.replace(/^\.\.\//, '')}`;
}

// Caminho de imagem raiz-relativo (ex: "/img/imagens-catalogo/x.webp"), usado em <img src> nas páginas geradas
function rootRelativeImg(imgPath) {
  return `/${imgPath.replace(/^\.\.\//, '')}`;
}

function slugifyProduto(produto) {
  return `${slugify(produto.nome)}-${slugify(produto.categoria)}`;
}

function getCategoriaBySlug(categorias, slug) {
  return categorias.find((c) => c.slug === slug);
}

function getProdutosByCategoria(produtos, categoriaNome) {
  return produtos.filter((p) => p.categoria === categoriaNome);
}

function getProdutosByTipo(produtos, tipoSlug) {
  const nomeBusca = TIPO_NOME_MAP[tipoSlug];
  if (!nomeBusca) return [];
  return produtos.filter((p) => p.nome.toLowerCase().includes(nomeBusca.toLowerCase()));
}

// ============================================
// META TAGS / JSON-LD
// ============================================
function generateProdutoMetaTags(produto, slug) {
  const title = `${produto.nome} ${produto.categoria} — Perfume de Ambiente | JB Home Essence`;
  const notasResumo = (produto.notas || '').split(',').slice(0, 2).join(',').trim();
  const description = `${produto.descricao}${notasResumo ? ` Notas: ${notasResumo}.` : ''} Perfumaria de ambientes em Balneário Camboriú.`;
  const canonical = `${CONFIG.produtosBaseUrl}/${slug}/`;
  const image = produto.imagens && produto.imagens[0] ? absoluteImg(produto.imagens[0]) : `${CONFIG.siteUrl}/logo.webp`;

  return `<title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="product">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${image}">`;
}

function generateProdutoJsonLd(produto, slug) {
  const canonical = `${CONFIG.produtosBaseUrl}/${slug}/`;
  const images = (produto.imagens || []).map(absoluteImg);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${produto.nome} ${produto.categoria}`,
    "image": images,
    "description": produto.descricao,
    "brand": { "@type": "Brand", "name": CONFIG.siteName },
    "category": produto.categoria,
    "offers": {
      "@type": "Offer",
      "url": canonical,
      "priceCurrency": "BRL",
      "price": produto.preco,
      "availability": produto.disponivel === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": `${CONFIG.siteUrl}/` },
      { "@type": "ListItem", "position": 2, "name": "Produtos", "item": `${CONFIG.produtosBaseUrl}/` },
      { "@type": "ListItem", "position": 3, "name": produto.categoria, "item": `${CONFIG.produtosBaseUrl}/fragrancia/${slugify(produto.categoria)}/` },
      { "@type": "ListItem", "position": 4, "name": `${produto.nome} ${produto.categoria}`, "item": canonical }
    ]
  };

  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n    <script type="application/ld+json">\n${JSON.stringify(breadcrumb, null, 2)}\n</script>`;
}

// ============================================
// HTML: CARD DE PRODUTO (reutilizado em fragrancia/tipo/relacionados)
// ============================================
function generateProductCardHtml(produto, slugMap) {
  const slug = slugMap.get(produto.id);
  const isAvailable = produto.disponivel !== false;
  const mainImage = produto.imagens && produto.imagens[0] ? rootRelativeImg(produto.imagens[0]) : '/img/placeholder.webp';
  const hoverImage = produto.imagens && produto.imagens[1] ? rootRelativeImg(produto.imagens[1]) : mainImage;

  return `
      <a href="/produtos/${slug}/" class="card${isAvailable ? '' : ' unavailable'}" style="text-decoration:none;">
        <div class="card-img-container" style="position:relative;">
          <img src="${mainImage}" alt="${produto.nome} - ${produto.categoria}" class="card-img main" loading="lazy">
          <img src="${hoverImage}" alt="${produto.nome} - ${produto.categoria}" class="card-img hover" loading="lazy">
        </div>
        <div class="card-body">
          <h3 class="card-title">${produto.nome} - ${produto.categoria}</h3>
          <p class="card-price">${formatPrice(produto.preco)}</p>
          ${isAvailable ? '' : '<p class="unavailable-label">Indisponível no momento</p>'}
        </div>
      </a>`;
}

// ============================================
// GERAÇÃO: PÁGINA DE PRODUTO
// ============================================
function generateProdutoPage(produto, slugMap, produtos, template) {
  const slug = slugMap.get(produto.id);
  const categoriaSlug = slugify(produto.categoria);
  const isAvailable = produto.disponivel !== false;

  const thumbnails = (produto.imagens || []).length > 1
    ? `<div class="modal-thumbnails">
        ${produto.imagens.map((img, i) => `<div class="modal-thumbnail${i === 0 ? ' active' : ''}"><img src="${rootRelativeImg(img)}" alt="${produto.nome}"></div>`).join('\n        ')}
      </div>`
    : '';

  const olfativaHtml = produto.descricaoOlfativa && produto.descricaoOlfativa.length
    ? `<div class="modal-section">
          <h4>Descrição Olfativa</h4>
          <div class="modal-tags">
            ${produto.descricaoOlfativa.map((t) => `<span class="modal-tag">${t}</span>`).join('\n            ')}
          </div>
        </div>`
    : '';

  const notasHtml = produto.notas
    ? `<div class="modal-section"><h4>Notas</h4><div class="modal-info-item"><p>${produto.notas}</p></div></div>`
    : '';

  const modoUsoHtml = produto.modoUso
    ? `<div class="modal-section"><h4>Modo de Uso</h4><div class="modal-info-item"><p>${produto.modoUso}</p></div></div>`
    : '';

  const avisoIndisponivel = isAvailable
    ? ''
    : `<div class="modal-section unavailable-banner"><p><strong>Produto indisponível no momento.</strong> Veja outras opções da fragrância ${produto.categoria} abaixo.</p></div>`;

  const relacionados = produtos
    .filter((p) => p.categoria === produto.categoria && p.id !== produto.id && p.disponivel !== false)
    .slice(0, 4)
    .map((p) => generateProductCardHtml(p, slugMap))
    .join('\n');

  const whatsappMessage = encodeURIComponent(`Olá! Gostaria de fazer um pedido do produto: ${produto.nome} - ${produto.categoria}`);

  let html = template
    .replace('{{META_TAGS}}', generateProdutoMetaTags(produto, slug))
    .replace('{{JSON_LD}}', generateProdutoJsonLd(produto, slug))
    .replace(/{{CATEGORIA_SLUG}}/g, categoriaSlug)
    .replace(/{{CATEGORIA_NOME}}/g, produto.categoria)
    .replace(/{{PRODUTO_NOME}}/g, produto.nome)
    .replace('{{PRODUTO_IMAGEM_PRINCIPAL}}', (produto.imagens && produto.imagens[0]) ? rootRelativeImg(produto.imagens[0]) : '/img/placeholder.webp')
    .replace('{{PRODUTO_THUMBNAILS}}', thumbnails)
    .replace('{{PRODUTO_PRECO}}', formatPrice(produto.preco))
    .replace('{{PRODUTO_INDISPONIVEL_AVISO}}', avisoIndisponivel)
    .replace('{{PRODUTO_DESCRICAO}}', produto.descricao || '')
    .replace('{{PRODUTO_OLFATIVA_HTML}}', olfativaHtml)
    .replace('{{PRODUTO_NOTAS_HTML}}', notasHtml)
    .replace('{{PRODUTO_MODO_USO_HTML}}', modoUsoHtml)
    .replace('{{WHATSAPP_LINK}}', `https://wa.me/5547997152830?text=${whatsappMessage}`)
    .replace('{{PRODUTOS_RELACIONADOS}}', relacionados || '<p>Nenhum outro produto encontrado nesta fragrância.</p>');

  return html;
}

// ============================================
// GERAÇÃO: PÁGINA DE FRAGRÂNCIA (CATEGORIA)
// ============================================
function generateCategoriaJsonLd(categoria, produtosDaCategoria, slugMap) {
  const canonical = `${CONFIG.produtosBaseUrl}/fragrancia/${categoria.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${categoria.nome} - JB Home Essence`,
    "url": canonical,
    "description": categoria.descricaoLonga || categoria.descricao,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": produtosDaCategoria
        .filter((p) => p.disponivel !== false)
        .map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `${CONFIG.produtosBaseUrl}/${slugMap.get(p.id)}/`,
          "name": `${p.nome} ${p.categoria}`
        }))
    }
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function generateCategoriaPage(categoria, produtos, slugMap, template) {
  const produtosDaCategoria = getProdutosByCategoria(produtos, categoria.nome);
  const disponiveis = produtosDaCategoria.filter((p) => p.disponivel !== false);

  const beneficiosHtml = (categoria.beneficios || [])
    .map((b) => `<li><i class="fas fa-check-circle"></i> ${b}</li>`)
    .join('\n                ');
  const palavrasChaveHtml = (categoria.palavrasChave || [])
    .map((p) => `<span class="palavra-chave-tag">${p}</span>`)
    .join('\n                ');

  const title = `${categoria.nome} - Perfumaria de Ambientes | JB Home Essence`;
  const description = `${categoria.descricaoLonga || categoria.descricao} Fragrância ${categoria.descricao} disponível em home spray, difusor de varetas e mais.`;
  const canonical = `${CONFIG.produtosBaseUrl}/fragrancia/${categoria.slug}/`;

  const metaTags = `<title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${CONFIG.siteUrl}/logo.webp">`;

  let html = template
    .replace('{{META_TAGS}}', metaTags)
    .replace('{{JSON_LD}}', generateCategoriaJsonLd(categoria, produtosDaCategoria, slugMap))
    .replace(/{{CATEGORIA_NOME}}/g, categoria.nome)
    .replace(/{{CATEGORIA_SLUG}}/g, categoria.slug)
    .replace('{{CATEGORIA_DESCRICAO}}', categoria.descricao || '')
    .replace('{{CATEGORIA_DESCRICAO_LONGA}}', categoria.descricaoLonga || '')
    .replace('{{CATEGORIA_NOTAS}}', categoria.notas || '')
    .replace('{{CATEGORIA_INSPIRACAO}}', categoria.inspiracao || '')
    .replace('{{CATEGORIA_BENEFICIOS_HTML}}', beneficiosHtml)
    .replace('{{CATEGORIA_PALAVRAS_CHAVE_HTML}}', palavrasChaveHtml)
    .replace('{{PRODUTOS_COUNT}}', `${disponiveis.length} produto${disponiveis.length !== 1 ? 's' : ''} encontrado${disponiveis.length !== 1 ? 's' : ''}`)
    .replace('{{PRODUTOS_HTML}}', disponiveis.map((p) => generateProductCardHtml(p, slugMap)).join('\n') || '<p>Nenhum produto disponível nesta fragrância no momento.</p>');

  return html;
}

// ============================================
// GERAÇÃO: PÁGINA DE TIPO
// ============================================
function generateTipoJsonLd(tipo, produtosDoTipo, slugMap) {
  const canonical = `${CONFIG.produtosBaseUrl}/tipo/${tipo.slug}/`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${tipo.nome} - JB Home Essence`,
    "url": canonical,
    "description": tipo.descricao,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": produtosDoTipo
        .filter((p) => p.disponivel !== false)
        .map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "url": `${CONFIG.produtosBaseUrl}/${slugMap.get(p.id)}/`,
          "name": `${p.nome} ${p.categoria}`
        }))
    }
  };
  return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
}

function generateTipoPage(tipo, produtos, slugMap, template) {
  const produtosDoTipo = getProdutosByTipo(produtos, tipo.slug);
  const disponiveis = produtosDoTipo.filter((p) => p.disponivel !== false);

  const title = `${tipo.nome} - Perfumaria de Ambientes | JB Home Essence`;
  const description = `${tipo.descricao} Confira as fragrâncias disponíveis em ${tipo.nome.toLowerCase()} na JB Home Essence.`;
  const canonical = `${CONFIG.produtosBaseUrl}/tipo/${tipo.slug}/`;

  const metaTags = `<title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${canonical}">
    <meta property="og:image" content="${CONFIG.siteUrl}/logo.webp">`;

  let html = template
    .replace('{{META_TAGS}}', metaTags)
    .replace('{{JSON_LD}}', generateTipoJsonLd(tipo, produtosDoTipo, slugMap))
    .replace(/{{TIPO_NOME}}/g, tipo.nome)
    .replace('{{TIPO_DESCRICAO}}', tipo.descricao || '')
    .replace('{{PRODUTOS_COUNT}}', `${disponiveis.length} produto${disponiveis.length !== 1 ? 's' : ''} encontrado${disponiveis.length !== 1 ? 's' : ''}`)
    .replace('{{PRODUTOS_HTML}}', disponiveis.map((p) => generateProductCardHtml(p, slugMap)).join('\n') || '<p>Nenhum produto disponível neste tipo no momento.</p>');

  return html;
}

// ============================================
// GERAÇÃO: ÍNDICE DO CATÁLOGO
// ============================================
function generateCatalogIndexHtml(categorias, tipos, produtos, template) {
  const imagemDaCategoria = (categoriaNome) => {
    const produto = getProdutosByCategoria(produtos, categoriaNome).find((p) => p.imagens && p.imagens[0]);
    return produto ? rootRelativeImg(produto.imagens[0]) : '/img/placeholder.webp';
  };
  const imagemDoTipo = (tipoSlug) => {
    const produto = getProdutosByTipo(produtos, tipoSlug).find((p) => p.imagens && p.imagens[0]);
    return produto ? rootRelativeImg(produto.imagens[0]) : '/img/placeholder.webp';
  };

  const fragranciasHtml = categorias.map((c) => `
      <a href="fragrancia/${c.slug}/" class="categoria-card">
        <div class="categoria-card-img"><img src="${imagemDaCategoria(c.nome)}" alt="${c.nome}" loading="lazy"></div>
        <div class="categoria-card-body">
          <h3>${c.nome}</h3>
          <p>${c.descricao}</p>
        </div>
      </a>`).join('\n');

  const tiposHtml = tipos.map((t) => `
      <a href="tipo/${t.slug}/" class="categoria-card">
        <div class="categoria-card-img"><img src="${imagemDoTipo(t.slug)}" alt="${t.nome}" loading="lazy"></div>
        <div class="categoria-card-body">
          <h3>${t.nome}</h3>
          <p>${t.descricao}</p>
        </div>
      </a>`).join('\n');

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Catálogo de Fragrâncias e Produtos - JB Home Essence",
    "url": `${CONFIG.produtosBaseUrl}/`
  };
  const jsonLd = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;

  return template
    .replace('{{JSON_LD}}', jsonLd)
    .replace('{{FRAGRANCIAS_HTML}}', fragranciasHtml)
    .replace('{{TIPOS_HTML}}', tiposHtml);
}

// ============================================
// SITEMAP (mescla com o sitemap já gerado pelo blog)
// ============================================
function buildUrlXml({ url, lastmod, changefreq, priority }) {
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function mergeCatalogIntoSitemap(catalogUrlEntries) {
  if (!fs.existsSync(CONFIG.sitemapPath)) {
    console.warn('⚠ sitemap.xml não encontrado — rode blog/gerar-posts.js primeiro. Pulando etapa de sitemap.');
    return;
  }

  const existing = fs.readFileSync(CONFIG.sitemapPath, 'utf8');
  // Remove quaisquer entradas antigas de /produtos/ para manter a operação idempotente
  const withoutProdutos = existing.replace(/ {2}<url>\s*<loc>https:\/\/jbhomessence\.com\.br\/produtos\/[^<]*<\/loc>[\s\S]*?<\/url>\n?/g, '');
  const closingTagIndex = withoutProdutos.lastIndexOf('</urlset>');
  const catalogXml = catalogUrlEntries.map(buildUrlXml).join('\n') + '\n';
  const merged = withoutProdutos.slice(0, closingTagIndex) + catalogXml + withoutProdutos.slice(closingTagIndex);

  saveFile(CONFIG.sitemapPath, merged);
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================
function main() {
  const produtos = loadJson(CONFIG.produtosJsonPath);
  const categorias = loadJson(CONFIG.categoriasJsonPath);
  const tipos = loadJson(CONFIG.tiposJsonPath);

  const produtoTemplate = fs.readFileSync(CONFIG.produtoTemplatePath, 'utf8');
  const fragranciaTemplate = fs.readFileSync(CONFIG.fragranciaTemplatePath, 'utf8');
  const tipoTemplate = fs.readFileSync(CONFIG.tipoTemplatePath, 'utf8');
  const catalogIndexTemplate = fs.readFileSync(CONFIG.catalogIndexTemplatePath, 'utf8');

  // Mapa id do produto -> slug (garante unicidade e consistência entre páginas)
  const slugMap = new Map();
  produtos.forEach((p) => slugMap.set(p.id, slugifyProduto(p)));

  const today = new Date().toISOString().split('T')[0];
  const sitemapEntries = [];

  console.log('\n📦 Gerando páginas de produto...');
  produtos.forEach((produto) => {
    const slug = slugMap.get(produto.id);
    const outDir = path.join(CONFIG.outputDir, slug);
    ensureDirectoryExists(outDir);
    const html = generateProdutoPage(produto, slugMap, produtos, produtoTemplate);
    saveFile(path.join(outDir, 'index.html'), html);
    sitemapEntries.push({
      url: `${CONFIG.produtosBaseUrl}/${slug}/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: produto.disponivel === false ? '0.3' : '0.7'
    });
  });
  console.log(`✔ ${produtos.length} páginas de produto geradas`);

  console.log('\n🌸 Gerando páginas de fragrância...');
  categorias.forEach((categoria) => {
    const outDir = path.join(CONFIG.outputDir, 'fragrancia', categoria.slug);
    ensureDirectoryExists(outDir);
    const html = generateCategoriaPage(categoria, produtos, slugMap, fragranciaTemplate);
    saveFile(path.join(outDir, 'index.html'), html);
    sitemapEntries.push({
      url: `${CONFIG.produtosBaseUrl}/fragrancia/${categoria.slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8'
    });
  });
  console.log(`✔ ${categorias.length} páginas de fragrância geradas`);

  console.log('\n🏷️  Gerando páginas de tipo...');
  tipos.forEach((tipo) => {
    const outDir = path.join(CONFIG.outputDir, 'tipo', tipo.slug);
    ensureDirectoryExists(outDir);
    const html = generateTipoPage(tipo, produtos, slugMap, tipoTemplate);
    saveFile(path.join(outDir, 'index.html'), html);
    sitemapEntries.push({
      url: `${CONFIG.produtosBaseUrl}/tipo/${tipo.slug}/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7'
    });
  });
  console.log(`✔ ${tipos.length} páginas de tipo geradas`);

  console.log('\n📄 Gerando índice do catálogo...');
  const catalogIndexHtml = generateCatalogIndexHtml(categorias, tipos, produtos, catalogIndexTemplate);
  saveFile(CONFIG.catalogIndexOutputPath, catalogIndexHtml);
  sitemapEntries.unshift({
    url: `${CONFIG.produtosBaseUrl}/`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.9'
  });

  console.log('\n🌐 Atualizando sitemap.xml com URLs do catálogo...');
  mergeCatalogIntoSitemap(sitemapEntries);

  console.log('\n--------------------------------------------------');
  console.log('✔ GERAÇÃO DO CATÁLOGO CONCLUÍDA COM SUCESSO!');
  console.log('--------------------------------------------------');
}

main();
