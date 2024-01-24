function show() {
    document.querySelector(".background").classList.add("show");
  }
  
  function hide() {
    document.querySelector(".background").classList.remove("show");
  }
  
  document.querySelector("#show").addEventListener("click", show);
  document.querySelector("#close").addEventListener("click", hide);