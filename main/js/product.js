// public/js/product.js
import { initializeFirebase } from './firebase-init.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

export async function initProduct(opts={}) {
  await initializeFirebase();
  const id = new URLSearchParams(location.search).get('id');
  const el = document.getElementById(opts.detailId||'product-detail');
  if (!id || !el) { if(el) el.innerHTML='Product not found'; return; }
  el.innerHTML = '<div class="loading-placeholder">Loading...</div>';
  try {
    const d = await getDoc(doc((await import('./firebase-init.js')).db,'products',id));
    if (!d.exists()) { el.innerHTML='Product not found'; return; }
    const p = d.data();
    el.innerHTML = `
      <div class="product-row">
        <img src="${p.image||'assets/images/placeholder.png'}" alt="${escapeHtml(p.title)}"/>
        <div>
          <h2>${escapeHtml(p.title)}</h2>
          <p class="meta">${escapeHtml(p.category||'')}</p>
          <p>${escapeHtml(p.desc||'')}</p>
          <div class="price">₱${(p.price||0).toFixed(2)}</div>
          <div class="product-actions">
            <button id="add-to-cart" class="btn primary">Add to cart</button>
            <button onclick="location.href='shop.html'" class="btn">Back</button>
          </div>
        </div>
      </div>
    `;
    document.getElementById('add-to-cart').addEventListener('click', ()=> {
      const cart = JSON.parse(localStorage.getItem('emz_cart')||'[]');
      const idx = cart.findIndex(c=>c.id===id);
      if (idx>=0) cart[idx].qty+=1; else cart.push({id, title:p.title||'', price:p.price||0, qty:1, image:p.image||''});
      localStorage.setItem('emz_cart',JSON.stringify(cart));
      alert('Added to cart');
      location.href='cart.html';
    });
  } catch (e) {
    console.error(e);
    el.innerHTML = '<div class="loading-placeholder">Failed to load product.</div>';
  }
}
function escapeHtml(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
