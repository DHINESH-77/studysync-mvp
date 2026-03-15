import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAyXrDRquy3skfeYtqqmCRA-jkJLUzb9pE",
  authDomain: "studysync-mvp-techsprint.firebaseapp.com",
  databaseURL: "https://studysync-mvp-techsprint-default-rtdb.firebaseio.com",
  projectId: "studysync-mvp-techsprint",
  storageBucket: "studysync-mvp-techsprint.firebasestorage.app",
  messagingSenderId: "367280967382",
  appId: "1:367280967382:web:abfb1bfcc222e4c2957597",
  measurementId: "G-6MBX221TQM"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();