$(function () {
	//判断是否有service参数
    if (service && service!='') {
    	$("#qrLoginForm").attr("action",$("#qrLoginForm").attr("action")+"?display=qrLogin&service="+encodeURIComponent(service));
    	$("#codeA").attr("href",$("#codeA").attr("href")+"?service="+encodeURIComponent(service));
    	$("#invalidA").attr("href",$("#invalidA").attr("href")+"?service="+encodeURIComponent(service));
    }

    getQrCode();
});

function refresh() {
    getQrCode($("#uuid").val());
    $("#qr_code").show();
    $("#qr_invalid").hide();
    $("#qr_success").hide();
    if(!isQrLogin){
    	window.location.reload();
    }
}

function getQrCode(uuid) {
    $.ajax({
        url: contextPath + "/qrCode/getToken?ts=" + new Date().getTime(),
        data: {"uuid": uuid},
        dataType: "text",
        success: function (data, textStatus) {
            if (textStatus == "success" && data != "") { // 请求成功
                var src = contextPath + "/qrCode/getCode?uuid=" + data;
                $("#qr_img").attr("src", src);
                $("#invalid_img").attr("src", src);
                $("#uuid").val(data);
            }
            countDown();
        }
    });
}

var qr_time;
function countDown() {
    qr_time = setTimeout(function () {
        isUsed();
        countDown();
    }, 1000);
}

//二维码状态
function isUsed() {
    $.ajax({
        url: contextPath + "/qrCode/getStatus.htl?ts=" + new Date().getTime(),
        data: {"uuid": $("#uuid").val()},
        dataType: "text",
        timeout: 5000,
        error: function () {
            clearTimeout(qr_time);
        },
        success: function (data, textStatus) {
            if (textStatus == "success" && data == "1") { // 请求成功
                clearTimeout(qr_time);
                $("#qrLoginForm").submit();
            }
            if (textStatus == "success" && data == "2") { // 二维码已被扫描跳
                $("#qr_code").hide();
                $("#qr_invalid").hide();
                $("#qr_success").show();
            }
            if (textStatus == "success" && data == "3") { // 二维码已失效页面
                clearTimeout(qr_time);
                $("#qr_code").hide();
                $("#qr_success").hide();
                $("#qr_invalid").show();
            }
        }
    });
}

