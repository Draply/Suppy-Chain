import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://support.google.com/firebase/answer/7015592
const firebaseConfig = {
  apiKey: "AIzaSyCwPXCuudWOb_I13D46BRvmtPriuB0A7BU",
  authDomain: "custom-c8cae.firebaseapp.com",
  projectId: "custom-c8cae",
  storageBucket: "custom-c8cae.appspot.com",
  messagingSenderId: "889066816855",
  appId: "1:889066816855:web:9cb87bc55f4f2c02b4aa12"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
      
