// Configuração do Firebase (Client SDK)
// O frontend usa Firebase diretamente para real-time listeners
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSy...",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "afiliados-e32b5.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://afiliados-e32b5-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "afiliados-e32b5",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "afiliados-e32b5.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "36735515286",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:36735515286:web:...",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// URL base da API REST (backend Express)
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
