import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Inicializa o Firebase Admin SDK
// Para produção, use uma service account key. 
// Para desenvolvimento, configure as variáveis de ambiente abaixo.
let db;

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID || 'afiliados-e32b5',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL || 'https://afiliados-e32b5-default-rtdb.firebaseio.com',
  });
}

db = admin.database();

export { db };
export default admin;
