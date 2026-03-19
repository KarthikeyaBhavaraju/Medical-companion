import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAV4-LjrYPrHQ7DVXR2jVEc1Ji8EbYyi5o",
  authDomain: "medicine-companion-afc58.firebaseapp.com",
  projectId: "medicine-companion-afc58",
  storageBucket: "medicine-companion-afc58.firebasestorage.app",
  messagingSenderId: "880735110612",
  appId: "1:880735110612:web:b84ee3a2e5247209450241"
}

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
