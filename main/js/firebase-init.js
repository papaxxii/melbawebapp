// js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-analytics.js";

export async function initializeFirebase() {
  const firebaseConfig = {
  apiKey: "AIzaSyBgK9a_Dsr5MIMNGZL-eaSkONIQE466ozw",
  authDomain: "emzsnacks-88225.firebaseapp.com",
  projectId: "emzsnacks-88225",
  storageBucket: "emzsnacks-88225.firebasestorage.app",
  messagingSenderId: "599274527177",
  appId: "1:599274527177:web:6a04dd10bc92fcd36ab018",
  measurementId: "G-RVNV88VX3L"
};


  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);
  const analytics = getAnalytics(app);

  return { app, auth, db, storage, analytics };
}
