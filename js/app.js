// Catonut vitrin sitesi: ürünler urunler.json dosyasından okunur, satın alma Shopier'de yapılır.
(async function () {
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const tl = n => Number(n || 0).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
  const nl2p = s => esc(s).split(/\n{2,}/).map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`).join('');
  const q = new URLSearchParams(location.search);
  const page = document.body.dataset.page;
  const main = document.getElementById('icerik');

  let data;
  try { data = await (await fetch('urunler.json', { cache: 'no-cache' })).json(); }
  catch (e) { main.innerHTML = '<section class="wrap"><p class="alert">Ürünler yüklenemedi, sayfayı yenileyin.</p></section>'; return; }
  const s = data.ayarlar || {}, cats = data.kategoriler || [], all = data.urunler || [];
  const catName = k => (cats.find(c => c.kod === k) || {}).ad || '';

  const logo = `<a class="logo" href="./" aria-label="Catonut ana sayfa"><svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><path d="M20 5c-9 0-15 7-15 16 0 8 7 14 15 14s15-6 15-14C35 12 29 5 20 5z" fill="#a0612f"/><path d="M6 17c4-6 9-8 14-8s10 2 14 8c-4-2-9-3-14-3S10 15 6 17z" fill="#5a3418"/><path d="M20 3v6" stroke="#5a3418" stroke-width="3" stroke-linecap="round"/><ellipse cx="14" cy="24" rx="3.5" ry="2.2" fill="#ffffff40"/></svg><span>cato<b>nut</b></span></a>`;
  document.getElementById('ust').innerHTML = `<div class="topbar">${esc(s.duyuru)}</div>
<header class="header"><div class="wrap head-row">${logo}
<form class="search" action="ara.html"><input name="q" placeholder="Ürün ara..." aria-label="Ürün ara" value="${esc(q.get('q'))}"><button>Ara</button></form>
<nav class="head-links">${s.shopier_magaza ? `<a href="${esc(s.shopier_magaza)}" rel="noopener">Mağazamız</a>` : ''}<a href="iletisim.html">İletişim</a></nav></div>
<nav class="catnav"><div class="wrap"><a href="./">Ana Sayfa</a>${cats.map(c => `<a href="kategori.html?k=${esc(c.kod)}">${esc(c.ad)}</a>`).join('')}<a href="hakkimizda.html">Hakkımızda</a></div></nav></header>`;
  document.getElementById('alt').innerHTML = `<section class="trust"><div class="wrap trust-row"><div><b>Hızlı Kargo</b><span>DHL ile hızlı gönderim</span></div><div><b>Güvenli Ödeme</b><span>Shopier güvencesiyle kartla ödeme</span></div><div><b>Taze Ürün</b><span>Yeni mahsul, özenli paketleme</span></div><div><b>Kolay İade</b><span>14 gün içinde iade hakkı</span></div></div></section>
<footer class="footer"><div class="wrap foot-grid"><div>${logo}<p>Karadeniz'in doğal lezzetlerini sofranıza getiriyoruz.</p></div>
<div><h4>Kategoriler</h4>${cats.map(c => `<a href="kategori.html?k=${esc(c.kod)}">${esc(c.ad)}</a>`).join('')}</div>
<div><h4>Kurumsal</h4><a href="hakkimizda.html">Hakkımızda</a><a href="iade.html">İade ve Değişim</a><a href="kvkk.html">KVKK Aydınlatma Metni</a></div>
<div><h4>İletişim</h4><p>${esc(s.telefon)}<br>${esc(s.eposta)}${s.instagram ? `<br><a href="${esc(s.instagram)}" rel="noopener">Instagram</a>` : ''}</p></div>
</div><div class="wrap copy">© ${new Date().getFullYear()} Catonut · Tüm hakları saklıdır.</div></footer>`;

  const buyBtn = (p, cls = '') => !p.stokta ? `<button class="btn ghost ${cls}" disabled>Tükendi</button>`
    : p.shopier_link ? `<a class="btn ${cls}" href="${esc(p.shopier_link)}" rel="noopener">Satın Al</a>`
    : `<button class="btn ghost ${cls}" disabled>Yakında satışta</button>`;
  const card = p => `<article class="card"><a href="urun.html?u=${esc(p.kod)}" class="card-img">${p.eski_fiyat ? `<span class="tag">%${Math.round((1 - p.fiyat / p.eski_fiyat) * 100)} İndirim</span>` : ''}<img src="${esc(p.gorsel || 'img/placeholder.svg')}" alt="${esc(p.ad)}" loading="lazy"></a>
<div class="card-body"><a href="urun.html?u=${esc(p.kod)}" class="card-name">${esc(p.ad)}</a><div class="price">${p.eski_fiyat ? `<s>${tl(p.eski_fiyat)}</s>` : ''}<b>${tl(p.fiyat)}</b></div>${buyBtn(p)}</div></article>`;
  const grid = ps => ps.length ? `<div class="grid">${ps.map(card).join('')}</div>` : '<p class="empty">Bu bölümde henüz ürün yok.</p>';
  const setTitle = t => { document.title = t + ' | Catonut'; };

  if (page === 'ana') {
    const img = k => (all.find(p => p.kategori === k) || {}).gorsel || 'img/placeholder.svg';
    const pic = c => esc((all.find(p => p.kod === c) || {}).gorsel || 'img/placeholder.svg');
    const shop = esc(s.shopier_magaza || '#urunler');
    main.innerHTML = `<section class="banner" aria-label="Kampanya"><a href="${shop}" rel="noopener" class="bn-mobile"><img src="img/banner/banner-mobil.jpg" alt="Çatonut ürün ailesiyle tanışın"></a>
<div class="bn-slides"><a href="${shop}" rel="noopener" class="on"><img src="img/banner/banner-1.jpg" alt="Dünyanın en dengeli fındık ve kakao dansı"></a><a href="${shop}" rel="noopener"><img src="img/banner/banner-2.jpg" alt="Çatonut ürün ailesiyle tanışın" loading="lazy"></a><div class="bn-dots"><button class="on" aria-label="1. görsel"></button><button aria-label="2. görsel"></button></div></div></section>
<section class="hero"><div class="wrap hero-row"><div class="hero-text"><span class="eyebrow">Yağlı Fındıktan</span><h1>Karadeniz'den sofranıza<br><em>taze ve doğal</em> lezzet</h1><p>Günlük kavrulan iç fındık, %85 fındıklı saf ezme ve kakaolu fındık kreması. Katkısız, özenle paketlenir, kapınıza gelir.</p><div class="hero-cta"><a class="btn big" href="#urunler">Alışverişe Başla</a><a class="btn big light" href="kategori.html?k=findik">Fındıkları İncele</a></div></div>
<div class="hero-pics"><img class="p1" src="${pic('kavrulmus-ic-findik-1kg')}" alt=""><img class="p2" src="${pic('saf-findik-ezmesi')}" alt=""><img class="p3" src="${pic('kakaolu-findik-kremasi')}" alt=""></div></div></section>
<section class="perks"><div class="wrap perk-row"><div><b>🌰 Yağlı fındıktan</b><span>Aroması yoğun, seçilmiş fındık</span></div><div><b>🔥 Taze kavrum</b><span>Siparişe yakın kavrulur</span></div><div><b>🔒 Güvenli ödeme</b><span>Shopier ile kart veya havale</span></div><div><b>🚚 Hızlı kargo</b><span>DHL ile Türkiye'nin her yerine</span></div></div></section>
<section class="wrap"><h2 class="sec-title">Kategoriler</h2><div class="cats">${cats.map(c => `<a class="cat" href="kategori.html?k=${esc(c.kod)}"><img src="${esc(img(c.kod))}" alt="" loading="lazy"><span>${esc(c.ad)}</span></a>`).join('')}</div></section>
<section class="wrap"><h2 class="sec-title">Öne Çıkan Ürünler</h2>${grid(all.filter(p => p.one_cikan))}</section>
<section class="wrap" id="urunler"><h2 class="sec-title">Tüm Ürünler</h2>${grid(all)}</section>`;
    const sl = [...main.querySelectorAll('.bn-slides > a')], dots = [...main.querySelectorAll('.bn-dots button')];
    let cur = 0; const show = i => { cur = i; sl.forEach((a, j) => a.classList.toggle('on', j === i)); dots.forEach((d, j) => d.classList.toggle('on', j === i)); };
    dots.forEach((d, i) => d.addEventListener('click', () => show(i)));
    setInterval(() => show((cur + 1) % sl.length), 5000);
  } else if (page === 'kategori') {
    const k = q.get('k'), name = catName(k) || 'Ürünler'; setTitle(name);
    main.innerHTML = `<section class="wrap"><nav class="crumbs"><a href="./">Ana Sayfa</a> / ${esc(name)}</nav><h1>${esc(name)}</h1>${grid(all.filter(p => p.kategori === k))}</section>`;
  } else if (page === 'ara') {
    const t = (q.get('q') || '').toLocaleLowerCase('tr').trim(); setTitle('Arama');
    const res = t ? all.filter(p => [p.ad, p.baslik, p.kisa].join(' ').toLocaleLowerCase('tr').includes(t)) : [];
    main.innerHTML = `<section class="wrap"><h1>“${esc(q.get('q'))}” için sonuçlar</h1>${grid(res)}</section>`;
  } else if (page === 'urun') {
    const p = all.find(x => x.kod === q.get('u'));
    if (!p) { main.innerHTML = '<section class="wrap narrow"><h1>Ürün bulunamadı</h1><p><a href="./">Ana sayfaya dön</a></p></section>'; return; }
    setTitle(p.baslik || p.ad);
    const rel = all.filter(x => x.kategori === p.kategori && x.kod !== p.kod).slice(0, 4);
    main.innerHTML = `<section class="wrap"><nav class="crumbs"><a href="./">Ana Sayfa</a> / <a href="kategori.html?k=${esc(p.kategori)}">${esc(catName(p.kategori))}</a> / ${esc(p.ad)}</nav>
<div class="pd"><div class="pd-img"><img src="${esc(p.gorsel || 'img/placeholder.svg')}" alt="${esc(p.ad)}"></div>
<div class="pd-info"><h1>${esc(p.baslik || p.ad)}</h1><p class="lead">${esc(p.kisa)}</p>
<div class="price big">${p.eski_fiyat ? `<s>${tl(p.eski_fiyat)}</s>` : ''}<b>${tl(p.fiyat)}</b></div>
<p class="stock ${p.stokta ? 'in' : 'out'}">${p.stokta ? 'Stokta var' : 'Tükendi'}</p>
<div class="buy">${buyBtn(p, 'big')}</div>
<ul class="perks"><li>Ödeme Shopier güvencesiyle kredi/banka kartı ile</li><li>DHL ile hızlı teslimat</li></ul></div></div>
<div class="pd-desc"><h2>Ürün Açıklaması</h2>${nl2p(p.aciklama)}</div>
${rel.length ? `<h2 class="sec-title">Benzer Ürünler</h2>${grid(rel)}` : ''}</section>`;
  } else if (page === 'iletisim') {
    main.querySelector('.iletisim-bilgi').innerHTML = `Telefon: ${esc(s.telefon)}<br>E-posta: ${esc(s.eposta)}`;
  }
})();
