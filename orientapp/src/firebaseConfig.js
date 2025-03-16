import { initializeApp } from "firebase/app";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Your Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyCS6IcokYqV2wbIEkWgNcQcauO93qotOzs",
    authDomain: "my-first-website-40f76.firebaseapp.com",
    projectId: "my-first-website-40f76",
    storageBucket: "my-first-website-40f76.appspot.com",
    messagingSenderId: "171137188691",
    appId: "1:171137188691:web:b15a81ddda10b71e4f97a6",
    measurementId: "G-VDMBMVNYCV"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Firestore with Caching Enabled (Speeds Up Loading)
const db = initializeFirestore(app, {
    localCache: persistentLocalCache()
});
  
// ✅ Initialize Storage
const storage = getStorage(app);

export { db, storage };
