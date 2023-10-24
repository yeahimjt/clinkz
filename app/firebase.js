import { initializeApp, getApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCdfeZVN6LhiVa_qHiWt_94xOa763hNF-Y',
  authDomain: 'clinkz-42a4b.firebaseapp.com',
  projectId: 'clinkz-42a4b',
  storageBucket: 'clinkz-42a4b.appspot.com',
  messagingSenderId: '733493677966',
  appId: '1:733493677966:web:190b8621e1ca7fb3145edf',
  measurementId: 'G-5VWT1NN074',
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const firestore = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, firestore, auth, storage };
