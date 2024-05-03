import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';      
const firebaseConfig = {
    apiKey: "AIzaSyARSvGk-cEqRutJoiBe49QaKCkU-bF-oMU",
    authDomain: "loreto-847ab.firebaseapp.com",
    projectId: "loreto-847ab",
    storageBucket: "loreto-847ab.appspot.com",
    messagingSenderId: "760393724374",
    appId: "1:760393724374:web:d26cff5a90e13ef23ef477"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const firestore = getFirestore(app);    
export { firestore };