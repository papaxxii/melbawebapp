// public/js/shop.js
import { initializeFirebase } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

let dbRef, products = [];

export async function initShop(opts = {}) {
  const cfg = await initializeFirebase();
  dbRef = cfg.db;
  const grid = document.getElementById(opts.productGridId || 'product-grid');
  const search = document.getElementById(opts.searchId || 'search');
  const catList = document.getElementById(opts.categoryListId || 'category-list');
  const cartCountEl = document.getElementById(opts.cartCountId || 'cart-count');

  // load products
  try {
    const q = query(collection(dbRef, 'products'), orderBy('title'));
    const snap = await getDocs(q);
    products = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderProducts(products, grid);
    // build category list dynamically from loaded products
    const catListEl = document.getElementById(opts.categoryListId || 'category-list');
    if (catListEl) {
      const cats = Array.from(new Set(products.map(p => (p.category || 'uncategorized').toLowerCase())));
      catListEl.innerHTML = ['all', ...cats].map(c => {
        const slug = c.replace(/[^a-z0-9]+/g, '-');
        return `<li data-cat="${c}" data-filter=".${slug==='all'? 'all' : 'category-'+slug}" class="${c==='all'? 'active':''}">${escapeHtml(c[0].toUpperCase()+c.slice(1))}</li>`;
      }).join('');
      // add classes on product cards for isotope filtering
      products.forEach(p => p._categorySlug = (p.category || 'uncategorized').toLowerCase().replace(/[^a-z0-9]+/g,'-'));
      renderProducts(products, grid);
    }
    updateCartCount(cartCountEl);
  } catch (e) {
    grid.innerHTML = `<div class="loading-placeholder">Error loading products.</div>`;
    console.error(e);
  }

  // search
  if (search) {
    search.addEventListener('input', (ev) => {
      const term = ev.target.value.trim().toLowerCase();
      const filtered = products.filter(p => (p.title || '').toLowerCase().includes(term) || (p.desc||'').toLowerCase().includes(term));
      renderProducts(filtered, grid);
    });
  }

  // categories
  if (catList) {
    catList.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-cat]');
      if (!li) return;
      Array.from(catList.children).forEach(c => c.classList.remove('active'));
      li.classList.add('active');
      const cat = li.dataset.cat.toLowerCase();
      const filtered = cat === 'all' ? products : products.filter(p => {
        const pCat = (p.category || 'uncategorized').toLowerCase();
        return pCat === cat;
      });
      renderProducts(filtered, grid);
    });
  }

  // apply price filter (simple)
  const applyBtn = document.getElementById('apply-price');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const min = Number(document.getElementById('min-price').value || 0);
      const max = Number(document.getElementById('max-price').value || Infinity);
      renderProducts(products.filter(p => (p.price || 0) >= min && (p.price || 0) <= max), grid);
    });
  }
}

function renderProducts(list, grid) {
  if (!grid) return;
  if (!list.length) {
    grid.innerHTML = `<div class="loading-placeholder">No products found</div>`;
    return;
  }
  grid.innerHTML = list.map(p => productCard(p)).join('');
  attachAddEvents(grid);
}

function productCard(p) {
  const price = (p.price || 0).toFixed(2);
  const img = p.image || 'assets/images/placeholder.png';
  const catSlug = p._categorySlug || ((p.category||'uncategorized').toLowerCase().replace(/[^a-z0-9]+/g,'-'));
  return `
    <article class="card all category-${catSlug}" data-id="${p.id}">
      <img src="${img}" alt="${escapeHtml(p.title)}" loading="lazy" />
      <h3>${escapeHtml(p.title)}</h3>
      <p class="price">₱${price}</p>
      <button class="btn add-to-cart" data-id="${p.id}">Add to cart</button>
    </article>
  `;
}

function attachAddEvents(grid) {
  grid.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.dataset.id;
      const item = products.find(p => p.id === id);
      if (!item) return;
      addToCart(item);
    });
  });
}

function addToCart(item) {
  const cart = JSON.parse(localStorage.getItem('emz_cart') || '[]');
  const idx = cart.findIndex(c => c.id === item.id);
  if (idx >= 0) cart[idx].qty += 1;
  else cart.push({ id: item.id, title: item.title, price: item.price || 0, qty: 1, image: item.image || '' });
  localStorage.setItem('emz_cart', JSON.stringify(cart));
  updateCartCount(document.getElementById('cart-count'));
  showAddedToast();
}

function updateCartCount(el) {
  if (!el) return;
  const cart = JSON.parse(localStorage.getItem('emz_cart') || '[]');
  const count = cart.reduce((s,i) => s + (i.qty||0), 0);
  el.textContent = count;
}

// small helpers
function escapeHtml(s = '') {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function showAddedToast() {
  // simple visual feedback (can be replaced with nicer UI)
  const t = document.createElement('div');
  t.className = 'loading-placeholder';
  t.textContent = 'Added to cart';
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1000);
}
