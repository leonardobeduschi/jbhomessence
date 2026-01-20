const fs = require('fs');

const fragrances = [
  'abbraccio', 'aroma-do-bebe', 'bambu-garden', 'capim-santo',
  'divina-vanilla', 'encontro', 'garbo', 'havana', 'hortensia',
  'jardins-da-franca', 'lilas', 'monte-carlo', 'patchouly'
];

const tipos = [
  'aromatizador', 'difusor-varetas', 'sabonete-liquido', 
  'essencias', 'vela-aromatica', 'aromatizador-carro', 'agua-perfumada'
];

let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  
  <url>
    <loc>https://jbhomessence.com.br/</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>https://jbhomessence.com.br/blog/</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
`;

// Adiciona fragrâncias
fragrances.forEach(frag => {
  sitemap += `
  <url>
    <loc>https://jbhomessence.com.br/produtos/categoria.html?categoria=${frag}</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

// Adiciona tipos
tipos.forEach(tipo => {
  sitemap += `
  <url>
    <loc>https://jbhomessence.com.br/produtos/categoria.html?tipo=${tipo}</loc>
    <lastmod>2025-01-19</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

sitemap += `
</urlset>`;

fs.writeFileSync('sitemap.xml', sitemap);
console.log('✅ Sitemap gerado com sucesso!');