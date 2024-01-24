import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";  // 수정된 import 문
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-analytics.js";

const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const provider = new GoogleAuthProvider();
const auth = getAuth();


document.getElementById('google').addEventListener('click', () => {
    signInWithPopup(auth, provider)
    .then((result) => {
        // 구글 액세스 토큰을 얻습니다. Google API에 액세스하는 데 사용할 수 있습니다.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        // 로그인한 사용자 정보
        const user = result.user;
        // getAdditionalUserInfo(result)를 사용하여 사용자 정보를 얻을 수 있습니다.
        // ...
        
    }).catch((error) => {
        // 여기서 오류를 처리합니다.
        const errorCode = error.code;
        const errorMessage = error.message;
        // 사용된 사용자 계정의 이메일
        const email = error.customData.email;
        // 사용된 AuthCredential 유형
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });
});
