
// 회원가입 팝업
function show() {
  document.querySelector(".background").classList.add("show");
}

function hide() {
  document.querySelector(".background").classList.remove("show");
}

document.querySelector("#show").addEventListener("click", show);
document.querySelector("#close").addEventListener("click", hide);


//슬라이더
$('.logslide').slick({
  speed: 200,
  arrows: false,
  infinite: true,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000
});




