// ============================================================
// JB Home Essence — Sanity Client
// Substitua SEU_PROJECT_ID pelo ID real do seu projeto Sanity
// ============================================================

const SANITY_PROJECT_ID = 'g210jgg5';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';
const SANITY_CDN = true; // true = mais rápido (usa cache CDN)

function sanityUrl(query) {
  const base = SANITY_CDN
    ? `https://${SANITY_PROJECT_ID}.apicdn.sanity.io`
    : `https://${SANITY_PROJECT_ID}.api.sanity.io`;
  const encoded = encodeURIComponent(query);
  return `${base}/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${encoded}`;
}

function imageUrl(ref, width = 800) {
  if (!ref) return '';
  // Formato do ref: image-abc123-800x600-jpg
  const [, id, dimensions, format] = ref.split('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${format}?w=${width}&auto=format`;
}

async function sanityFetch(query) {
  try {
    const res = await fetch(sanityUrl(query));
    if (!res.ok) throw new Error(`Sanity fetch error: ${res.status}`);
    const data = await res.json();
    return data.result || [];
  } catch (err) {
    console.error('Erro ao buscar dados do Sanity:', err);
    return [];
  }
}

// ---- QUERIES ------------------------------------------------

async function getProdutosDestaque() {
  return sanityFetch(`*[_type == "produto" && destaque == true && ativo == true] | order(_createdAt asc) {
    _id, nome, slug, faixaPreco, durabilidade, intensidade, novidade,
    notasOlfativas, ambientesSugeridos,
    "imagemUrl": imagemDestaque.asset->url,
    "imagemRef": imagemDestaque.asset._ref,
    mensagemWhatsapp
  }`);
}

async function getProdutosPorCategoria(categoriaSlug) {
  return sanityFetch(`*[_type == "produto" && categoria->slug.current == "${categoriaSlug}" && ativo == true] | order(_createdAt asc) {
    _id, nome, slug, faixaPreco, novidade,
    "imagemRef": imagemDestaque.asset._ref
  }`);
}

async function getDepoimentosAtivos() {
  return sanityFetch(`*[_type == "depoimento" && ativo == true] | order(ordem asc) {
    _id, nomeCliente, cidade, tipo, texto, estrelas,
    "fotoRef": foto.asset._ref
  }`);
}

async function getPostsRecentes(limite = 6) {
  return sanityFetch(`*[_type == "post" && publicado == true] | order(dataPublicacao desc) [0...${limite}] {
    _id, titulo, slug, resumo, dataPublicacao, categoria,
    "imagemRef": imagemCapa.asset._ref
  }`);
}

async function getBannerAtivo() {
  const agora = new Date().toISOString();
  const resultado = await sanityFetch(`*[_type == "banner" && ativo == true && inicio <= "${agora}" && fim >= "${agora}"] | order(_createdAt desc) [0] {
    _id, titulo, subtitulo, ctaTexto, ctaLink,
    "imagemRef": imagem.asset._ref
  }`);
  return Array.isArray(resultado) ? resultado[0] : resultado;
}

async function getConfiguracoes() {
  const resultado = await sanityFetch(`*[_type == "configuracoes"][0]`);
  return Array.isArray(resultado) ? resultado[0] : resultado;
}

// ---- HELPERS ------------------------------------------------

function estrelas(n) {
  return '★'.repeat(n) + '☆'.repeat(5 - n);
}

function formatarData(dateStr) {
  if (!dateStr) return '';
  const [ano, mes, dia] = dateStr.split('-');
  return `${dia}/${mes}/${ano}`;
}

// ---- EXPORT ------------------------------------------------
window.sanityClient = {
  getProdutosDestaque,
  getProdutosPorCategoria,
  getDepoimentosAtivos,
  getPostsRecentes,
  getBannerAtivo,
  getConfiguracoes,
  imageUrl,
  estrelas,
  formatarData,
};
