const video = document.querySelector("#webcam");
const canvas = document.querySelector(".capture");
$( "#dialog" ).hide()

document.querySelector("#cbtn").addEventListener("click", () => {
    
    video.src = "http://localhost:8001/video_feed";

    let img = new Image();
    img.src = "http://localhost:8001/video_feed";
    img.crossOrigin = 'Anonymous';
    img.onload = function() {
        canvas.width = this.width;
        canvas.height = this.height;
        canvas.getContext("2d").drawImage(img, 0, 0);
        canvas.style.display = "none";
        saveImgAndUpload(canvas.toDataURL('image/png'), 'image.png');
    };
    
    $( "#dialog" ).dialog();
    $(".ui-dialog-titlebar-close").addClass("ui-button ui-corner-all ui-widget ui-button-icon-only")
    $(".ui-dialog-titlebar-close").html('<span class="ui-button-icon ui-icon ui-icon-closethick"></span>')
});

const saveImgAndUpload = (uri, filename) => {
    $.ajax({
        url: 'http://localhost:3000/main',
        type: 'POST',
        dataType: 'json',
        data: { files: uri },
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.error('Error sending image to server:', error);
        }
    });
};

// #dbtn 클릭 시에 업로드 수행
$("#dbtn").click(function() {
    console.log(canvas.toDataURL('image/png'));

    $.ajax({
        url: 'http://localhost:3000/main',
        type: 'POST',
        dataType: 'json',
        data: { files: canvas.toDataURL('image/png') },
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.error('Error sending image to server:', error);
        }
    });

    // 추가된 부분: 업로드 완료 시에 알림
    
});


let timeout_l;
let timeout_r;

// 좌 우 조종 버튼
const servo_control_l = function(){
    $.ajax({
        url: 'http://localhost:8001/servo_control?direction=L',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            console.log(data);
        }
    })
}
const servo_control_r = function(){
    $.ajax({
        url: 'http://localhost:8001/servo_control?direction=R',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            console.log(data);
        }
    })
}
$("#lbtn").mousedown(function(){
    servo_control_l()
    timeout_l = setInterval(function(){ servo_control_l() }, 100)
})
$('#lbtn').mouseup(function(){
    console.log("timeout_l:", timeout_l)
    clearInterval(timeout_l)
})
$("#rbtn").mousedown(function(){
    servo_control_r()
    timeout_r = setInterval(function(){ servo_control_r() }, 100)
})
$('#rbtn').mouseup(function(){
    console.log("timeout_r:", timeout_r)
    clearInterval(timeout_r)
})

// 자동 수동 버튼
$("#rbtn").attr("disabled", "true")
$("#lbtn").attr("disabled", "true")

$("#is-auto-btn").click(function(){
    $(this).toggleClass("active")

    if($(this).hasClass("active")){

        $(this).text("자동")
        $("#rbtn").attr("disabled", "true")
        $("#lbtn").attr("disabled", "true")

    }else{

        $(this).text("수동")
        $("#rbtn").removeAttr("disabled")
        $("#lbtn").removeAttr("disabled")

    }
    $.ajax({
        url: 'http://localhost:8001/toggle_auto',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            console.log(data);
        }
    })
})


// 온도, 습도
const sensorvalue= function(){
    $.ajax({
        url: 'http://localhost:8001/get_sensor_value',
        type: 'GET',
        dataType: 'text',
        success: function (data) {
            const Tempmatch = data.match(/Temp: (\d+)/);
            const Hempmatch = data.match(/Humi: (\d+)/);
            if(Tempmatch){
                $("#temp").text(Tempmatch[1] + 'C');    
            }
            if(Hempmatch){
                $("#humi").text(Hempmatch[1] + '%');    
            }
        }
    })
}

$("#temp").ready(function(){
    sensorvalue()
})
$("#humi").ready(function(){
    sensorvalue()
})

$(document).ready(function(){
    setInterval(function(){
        sensorvalue()       
    }, 5000)   
})