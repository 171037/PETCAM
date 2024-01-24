document.querySelector(".btn1").addEventListener("click", function () {
    var audio1 = new Audio("style/img/napal.mp3");
    audio1.loop = false;// 반복재생하지 않음
    audio1.volume = 0.5;
    audio1.play();
});
    
document.querySelector(".btn2").addEventListener("click", function () {
    var audio2 = new Audio("style/img/Wistle.mp3");
    audio2.loop = false; // 반복재생하지 않음
    audio2.volume = 0.5;
    audio2.play();
    
});

document.querySelector(".btn3").addEventListener("click", function () {
    var audio2 = new Audio("style/img/beep.mp3");
    audio2.loop = false; // 반복재생하지 않음
    audio2.volume = 0.5;
    audio2.play();
    
});
    
