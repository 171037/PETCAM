const { initializeApp } = require("firebase/app")
const { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } = require("firebase/auth");
const { getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    databaseURL:"",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);




module.exports =  { auth, storage  };



