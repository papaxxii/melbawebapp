// public/js/auth.js
import { initializeFirebase } from '../js/firebase-init.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js';

let auth, db;
export async function initAuth() {
  const cfg = await initializeFirebase();
  auth = cfg.auth;
  db = cfg.db;

  onAuthStateChanged(auth, async (user) => {
    const btn = document.getElementById('auth-toggle');
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      btn.textContent = 'Account';
      // Optionally show profile menu
    } else {
      btn.textContent = 'Sign In';
    }
  });

  // user button: go to profile if signed in else go to login page
  document.getElementById('auth-toggle')?.addEventListener('click', () => {
    if (auth && auth.currentUser) window.location = 'profile.html';
    else window.location = 'login.html';
  });
}

export async function loginWithEmail(email, pass) {
  if (!auth) {
    const cfg = await initializeFirebase(); auth = cfg.auth; db = cfg.db;
  }
  return signInWithEmailAndPassword(auth, email, pass);
}

export async function registerWithEmail(email, pass, name) {
  if (!auth) {
    const cfg = await initializeFirebase(); auth = cfg.auth; db = cfg.db;
  }
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  await setDoc(doc(db, 'users', cred.user.uid), { email, name, role: 'customer', createdAt: new Date() });
  return cred;
}
