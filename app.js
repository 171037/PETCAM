const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { auth, storage } = require("./config");
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, signInWithPopup, getRedirectResult } = require("firebase/auth");
const { getDownloadURL, ref, uploadBytes, listAll } = require("firebase/storage");
const multer = require('multer');
const upload = multer().single('up'); // 입력 필드 이름이 'up'로 가정



app.set('view engine', 'ejs');
app.set('views', './views');


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(express.static(__dirname + "/public"));

// 로그인 상태 확인 및 유지
app.use((request, response, next) => {
    const { currentUser } = auth;

    if (currentUser) {
        response.locals.user = currentUser;
    }

    next();
});

// 홈 페이지 미들웨어
const homeMiddleware = (request, response, next) => {
    const { currentUser } = auth;

    
    
    // 로그인한 사용자가 없다면 로그인 페이지로 리다이렉션
    if (!currentUser) {
        response.redirect('/');
    } else {
        next();
    }
};

app.get("/", (_, response) => {
    response.render("index");
});

// 로그인
app.post('/login', (request, response) => {
    const { email, pass } = request.body;

    signInWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
            const user = userCredential.user;
            
            
            response.write("<script>window.location=\"/home\"</script>");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(error);

            response.write("<script>alert('try again')</script>");
            response.write("<script>window.location=\"/\"</script>");
        });
});


// 로그아웃
app.get('/logout', (request, response) => {
    signOut(auth)
        .then(() => {
            
            response.write("<script>window.location=\"/\"</script>");
        })
        .catch((error) => {
            response.write("<script>alert('try again')</script>");
            response.write("<script>window.location=\"/\"</script>");
        });
});

// 비밀번호 재설정
app.post('/reset', (request, response) => {
    const { resetemail } = request.body;

    sendPasswordResetEmail(auth, resetemail)
    .then(() => {
      // Password reset email sent!
      // ..
      response.write("<script>alert('OK')</script>");
      response.write("<script>window.location=\"/\"</script>");
         
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ..
      console.error(error);
      response.write("<script>alert('no')</script>");
    });
});

function dataURItoBlob(dataURI)
{
    let byteString = atob(dataURI.split(',')[1]); // base64 인코딩 문자열을 디코딩하는 작업
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0] // 타입 뽑아내는 작업
    let ab = new ArrayBuffer(byteString.length); // 버퍼 생성
    let ia = new Uint8Array(ab); // 코드값을 전달하기 위한 버퍼 내부 타입 정의
    for (var i = 0; i < byteString.length; i++)
    {
        ia[i] = byteString.charCodeAt(i); // 디코딩된 값을 적절한 형태로 하나씩 이동하는 작업
    }
    var bb = new Blob([ab], { "type": mimeString });
    return bb;
}

app.post("/main", (req, res) => {

    const originalFileName = `capture_${new Date().getTime()}.png`;
    const storageRef = ref(storage, `images/${originalFileName}`);

    uploadBytes(storageRef, dataURItoBlob(req.body.files))
        .then((snapshot) => {
            console.log(snapshot)
        })
        .catch((error) => {
            console.error(error);
        });

    res.send({ message: "OK" })
})


// 사진 다운로드
app.post("/photo", (request, response) => {
    const listRef = ref(storage, 'images/');


    listAll(listRef)
        .then((res) => {
            const images = res.items;

            const downloadURLPromises = images.map((imageRef) => {
                return getDownloadURL(imageRef);
            });

            Promise.all(downloadURLPromises)
                .then((urls) => {
                    response.send({ urls });
                })
                .catch((error) => {
                    console.error(error);
                    response.status(500).send({ message: "Error getting download URLs" });
                });
        })
        .catch((error) => {
            console.error(error);
            response.status(500).send({ message: "Error listing images" });
        });
});

// 회원가입
app.post("/", (request, response) => {
    const { joinpass, joinemail, joinpasscheck } = request.body;

    if (joinpass !== joinpasscheck) {
        response.write("<script>alert('try again')</script>");
        response.write("<script>window.location=\"/\"</script>");
        return;
    }

    createUserWithEmailAndPassword(auth, joinemail, joinpass)
        .then((userCredential) => {
            const user = userCredential.user;
            response.write("<script>alert('good')</script>");
            response.write("<script>window.location=\"/\"</script>");
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(error);

            response.write("<script>alert('try again')</script>");
            response.write("<script>window.location=\"/\"</script>");
        });
});



// 홈 페이지
app.get("/home", homeMiddleware, (_, response) => {
    response.render("home");
});

// 지도 페이지
app.get("/map", homeMiddleware, (_, response) => {
    response.render("map");
});

// 메인 페이지
app.get("/main", homeMiddleware, (_, response) => {
    response.render("main");
});

// 포토 페이지
app.get("/photo", homeMiddleware, (_, response) => {
    response.render("photo");
});

app.listen(3000, () => {
    console.log("Now Running...");
});