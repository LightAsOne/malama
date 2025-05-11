// firebase-init.js
const firebaseConfig = {
  apiKey: "AIzaSyA6C65XgjxpN1a7IowyRaJxr7poqsYV9TA",
  authDomain: "malama-247ad.firebaseapp.com",
  projectId: "malama-247ad",
  storageBucket: "malama-247ad.firebasestorage.app",
  messagingSenderId: "83778882351",
  appId: "1:83778882351:web:599a8aebcc5ebd7b8eefda",
  measurementId: "G-3NS9NX3HPZ"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();