$.post("/photo", function (data) {   
    if (data.urls && data.urls.length > 0) {
        data.urls.forEach(function(item){
            // 문자열 자르기 후 날짜 변환 파트
            let date_int = parseInt(item.split('capture_')[1].substring(0, 13))

            
            const div = $("<div class='child'></div>")
            const img = $(`<img src='${item}' />`)
            const div2 = $("<div class='child2'></div>")
            const img2 = $(`<img id="mainimg" src='${item}' />`)
            const p = $(`<p>${new Date(date_int).toLocaleString()}</p>`)
                            
            div.append(img)
            div2.append(img2)
            div2.append(p)
            $(".images").append(div)
            $(".text").append(div2)
            
        })
        $('.images').slick({
            speed: 200,
            infinite: true,
            slidesToShow: 6,
            slidesToScroll: 1,
            asNavFor: '.text'

        });
        $('.text').slick({
            speed: 200,
            slidesToShow: 1,
            slidesToScroll: 1,
            asNavFor: '.images',
            arrows: false,
            focusOnSelect: true
        })
        
                        
    } else {
        
    }

});