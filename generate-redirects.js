// generate-redirects.js
// Gera redirecionadores e sitemap automaticamente a partir de blog/posts.json
// Compatível com GitHub Pages

const fs = require("fs");
const path = require("path");

const SITE_URL = "https://jbhomessence.com.br"; // altere se o domínio mudar
const root = process.cwd();
const postsJson = path.join(root, "blog", "posts.json");

if (!fs.existsSync(postsJson)) {
  console.error("❌ Arquivo blog/posts.json não encontrado.");
  process.exit(1);
}

const posts = JSON.parse(fs.readFileSync(postsJson, "utf8"));

if (!Array.isArray(posts) || posts.length === 0) {
  console.error("❌ Nenhum post encontrado no JSON.");
  process.exit(1);
}

console.log("🪶 Gerando redirecionadores para URLs amigáveis...\n");

posts.forEach((post) => {
  const dir = path.join(root, "blog", post.id);
  fs.mkdirSync(dir, { recursive: true });

  const redirectHtml = `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta http-equiv="refresh" content="0; url=/blog/post.html?id=${post.id}">
  <link rel="canonical" href="${SITE_URL}/blog/${post.id}/">
  <meta name="robots" content="noindex,follow">
</head>
<body>
  <p>Redirecionando para <a href="/blog/post.html?id=${post.id}">${post.title}</a>...</p>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, "index.html"), redirectHtml, "utf8");
  console.log(`✅ /blog/${post.id}/index.html`);
});

console.log("\n🧭 Gerando sitemap.xml...");

const today = new Date().toISOString().split("T")[0];
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${posts
  .map(
    (p) => `  <url>
    <loc>${SITE_URL}/blog/${p.id}/</loc>
    <lastmod>${today}</lastmod>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync(path.join(root, "sitemap.xml"), sitemapXml, "utf8");

console.log("✅ sitemap.xml criado/atualizado com sucesso!");
console.log("\n✨ Concluído!");
