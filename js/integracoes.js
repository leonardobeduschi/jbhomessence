// ============================================================
// JB Home Essence — Integrações com Sanity
// ============================================================

// --- DEPOIMENTOS ---
async function carregarDepoimentos() {
  const container = document.getElementById('depoimentos-container');
  if (!container) return;

  const depoimentos = await window.sanityClient.getDepoimentosAtivos();
  if (!depoimentos || depoimentos.length === 0) return; // mantém HTML estático se vazio

  container.innerHTML = depoimentos.map(d => `
    <div class="depoimento-card" style="background:#fff;border-radius:12px;padding:20px 24px;box-shadow:0 2px 12px rgba(0,0,0,0.07);display:flex;flex-direction:column;gap:8px;">
      <div style="color:#f4a821;font-size:18px;">${window.sanityClient.estrelas(d.estrelas || 5)}</div>
      <p style="font-size:14px;line-height:1.7;color:#444;font-style:italic;">"${d.texto}"</p>
      <div style="margin-top:4px;">
        <strong style="font-size:13px;color:#1a1a1a;">${d.nomeCliente}</strong>
        ${d.cidade ? `<span style="font-size:12px;color:#888;"> · ${d.cidade}</span>` : ''}
        ${d.tipo ? `<br><span style="font-size:11px;color:#aaa;">${d.tipo}</span>` : ''}
      </div>
    </div>
  `).join('');
}

// --- PRODUTOS EM DESTAQUE ---
async function carregarProdutosDestaque() {
  const container = document.getElementById('produtos-destaque-container');
  if (!container) return;

  const produtos = await window.sanityClient.getProdutosDestaque();
  if (!produtos || produtos.length === 0) return; // mantém HTML estático se vazio

  container.innerHTML = produtos.map(p => {
    const imgUrl = p.imagemRef
      ? window.sanityClient.imageUrl(p.imagemRef, 400)
      : '';
    const msgWA = p.mensagemWhatsapp
      ? encodeURIComponent(p.mensagemWhatsapp)
      : encodeURIComponent(`Olá! Tenho interesse no produto: ${p.nome}`);
    const whatsappLink = `https://wa.me/47997152830?text=${msgWA}`;

    return `
      <div class="produto-card" style="text-align:center;position:relative;">
        ${p.novidade ? '<span style="position:absolute;top:8px;right:8px;background:#1a7f40;color:#fff;font-size:10px;padding:2px 8px;border-radius:20px;font-weight:600;">Novidade</span>' : ''}
        ${imgUrl ? `<img src="${imgUrl}" alt="${p.nome}" loading="lazy" style="width:100%;border-radius:8px;aspect-ratio:1;object-fit:cover;">` : ''}
        <h3 style="font-size:15px;margin:10px 0 4px;">${p.nome}</h3>
        ${p.faixaPreco ? `<p style="font-size:13px;color:#1a7f40;font-weight:500;margin:0 0 8px;">${p.faixaPreco}</p>` : ''}
        <a href="${whatsappLink}" target="_blank" style="display:inline-block;font-size:13px;color:#25d366;text-decoration:none;font-weight:500;">
          💬 Pedir pelo WhatsApp
        </a>
      </div>
    `;
  }).join('');
}

// --- INICIALIZAÇÃO ---
document.addEventListener('DOMContentLoaded', async () => {
  await carregarDepoimentos();
  await carregarProdutosDestaque();
});
