import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage"; // Import storage

const firebaseConfig = {
  apiKey: "AIzaSyDf0H98HWVUhJk246s6VxmFSknG5W6DOoI",
  authDomain: "sell-your-songs.firebaseapp.com",
  databaseURL: "https://sell-your-songs-default-rtdb.firebaseio.com",
  projectId: "sell-your-songs",
  storageBucket: "sell-your-songs.appspot.com",
  messagingSenderId: "988461220378",
  appId: "1:988461220378:web:c27c573627cde12a5c47a3"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
export const storage = getStorage(app); // Add storage export
export default app;
