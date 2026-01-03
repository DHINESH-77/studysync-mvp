import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD_JGA3DluAhE09zHxaGokicITV2IbsGXg",
  authDomain: "studysync-mvp-techsprint.firebaseapp.com",
  databaseURL: "https://studysync-mvp-techsprint-default-rtdb.firebaseio.com",
  projectId: "studysync-mvp-techsprint",
  storageBucket: "studysync-mvp-techsprint.firebasestorage.app",
  messagingSenderId: "557002966496",
  appId: "1:557002966496:web:d8cd5f2b088a9df5bf5785"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();