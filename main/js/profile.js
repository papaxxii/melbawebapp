import { initializeFirebase } from './firebase-init.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { doc, getDoc, setDoc, query, collection, where, getDocs, orderBy } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

let auth, db;

export async function initProfile() {
  const cfg = await initializeFirebase();
  auth = cfg.auth; db = cfg.db;

  onAuthStateChanged(auth, async (user) => {
    if (!user) return window.location = 'login.html';
    // load user profile
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const data = userDoc.exists() ? userDoc.data() : { email: user.email };
    document.getElementById('profile-email').textContent = data.email || '';
    document.getElementById('profile-name').value = data.name || '';
    document.getElementById('profile-phone').value = data.phone || '';
    document.getElementById('profile-address').value = data.address || '';

    // load orders
    const ordersEl = document.getElementById('orders-list');
    if (ordersEl) {
      const q = query(collection(db, 'orders'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      ordersEl.innerHTML = snap.docs.map(d => {
        const o = d.data();
        return `<div class='order-row'>
            <strong>Order ${d.id}</strong> — ${o.status || 'pending'}<br>
            Items: ${(o.items||[]).map(i => i.title).join(', ')}
            <div>Placed: ${o.createdAt ? new Date(o.createdAt.seconds*1000).toLocaleString() : ''}</div>
          </div>`;
      }).join('') || '<div>No orders yet</div>';
    }
  });

  document.getElementById('profile-form')?.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const user = auth.currentUser;
    if (!user) return window.location = 'login.html';

    const data = {
      name: document.getElementById('profile-name').value.trim(),
      phone: document.getElementById('profile-phone').value.trim(),
      address: document.getElementById('profile-address').value.trim(),
      email: document.getElementById('profile-email').textContent,
      updatedAt: new Date()
    };

    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
    alert('Profile updated');
  });

  document.getElementById('logout-btn')?.addEventListener('click', async () => {
    await signOut(auth);
    window.location = 'index.html';
  });
}
