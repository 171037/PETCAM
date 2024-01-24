const { initializeApp } = require("firebase/app")
const { getAuth, setPersistence, signInWithEmailAndPassword, browserSessionPersistence, sendPasswordResetEmail, signInWithPopup, GoogleAuthProvider } = require("firebase/auth");
const { getStorage, ref, uploadBytes, getDownloadURL} = require("firebase/storage");

const firebaseConfig = {
    apiKey: "AIzaSyAbsnrv1V48Afy3kFGF5FjQ7qe2NPWkgKQ",
    authDomain: "home-ebddf.firebaseapp.com",
    projectId: "home-ebddf",
    databaseURL:"https://home-ebddf-default-rtdb.firebaseio.com/",
    storageBucket: "home-ebddf.appspot.com",
    messagingSenderId: "701662885710",
    appId: "1:701662885710:web:00cb728e62209719e8501f",
    measurementId: "G-4L5HSMC0ZZ"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);




module.exports =  { auth, storage  };



