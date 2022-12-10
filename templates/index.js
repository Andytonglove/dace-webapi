// Path: dace\templates\index.html

// 对index.html中的学号输入框进行正则表达式检查
function checkId() {
    var stuId = document.getElementById("inputId3").value;
    // 判断是8-13位数的正则表达式
    var reg = /^\d{8,13}$/;
    if (reg.test(stuId)) {
        // 学号输入框边框变为绿色
        document.getElementById("inputId3").style.borderColor = "green";
        return true;
    } else {
        commonUtil.message("学号格式错误", "danger");
        // 学号输入框边框变为红色
        document.getElementById("inputId3").style.borderColor = "red";
        return false;
    }
}

// 对index.html中的手机号码进行正则表达式检查
function checkPhone() {
    var phone = document.getElementById("inputPhone3").value;
    var reg = /^1[34578]\d{9}$/;
    if (reg.test(phone)) {
        document.getElementById("inputPhone3").style.borderColor = "green";
        return true;
    } else {
        commonUtil.message("手机号格式错误", "danger");
        document.getElementById("inputPhone3").style.borderColor = "red";
        return false;
    }
}

// 对index.html中的邮箱进行正则表达式检查
function checkEmail() {
    var email = document.getElementById("inputEmail3").value;
    var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
    if (reg.test(email)) {
        document.getElementById("inputEmail3").style.borderColor = "green";
        return true;
    } else {
        commonUtil.message("邮箱格式错误", "danger");
        document.getElementById("inputEmail3").style.borderColor = "red";
        return false;
    }
}

function check() {
    console.log("提交按钮被点击 执行check()函数");
    if (checkId() && checkPhone() && checkEmail()) {
        // 将表单信息传递到后台
        var name = document.getElementById("inputName3").value;
        var stuId = document.getElementById("inputId3").value;
        var email = document.getElementById("inputEmail3").value;
        var phone = document.getElementById("inputPhone3").value;
        var hobby = document.getElementById("inputHobby3").value;

        // 把数据按照collection.js中的格式打包为json，传递到后台，注意json字段名要有双引号！！！
        var data = {
            "name": name,
            "id": stuId,
            "email": email,
            "phone": phone,
            "hobby": hobby
        };
        console.log(data);
        // 把json数据写入json文件
        $.ajax({
            // 后台接口
            url: "http://localhost:1337/api/submit",  // 后台接口，需要自己写，参考collection.js，这里是写在app中，所以是/api/submit
            // 指定请求为CORS请求
            xhrFields: {
                withCredentials: false
            },
            type: "POST",
            data: JSON.stringify(data), // 将json数据转换为字符串，传递给后台，后台再转换为json格式
            // {
            //     "name": "张三",
            //     "id": "123456",
            //     "email": "zhangsan@example.com",
            //     "phone": "13000000000",
            //     "hobby": "篮球"
            // }
            contentType: "application/json",
            success: function (data) {
                console.log(data);
                if (data.status == 200) {
                    commonUtil.message("提交成功！");
                } else {
                    commonUtil.message("提交失败！", "danger");
                }
            },
            error: function (data) {
                console.log(data);
                commonUtil.message("提交失败！", "danger");
            }
        });
        commonUtil.message("已提交！", "info");
        // 在此页面停留1秒钟，下滑到本页面的底部
        setTimeout(function () {
            window.scrollTo(0, document.body.scrollHeight);
        }, 1000);
    } else {
        commonUtil.message("提交失败！", "danger");
    }
}

// 点击重置按钮时，清空所有输入框
function onreset() {
    document.getElementById("inputName3").value
        = document.getElementById("inputId3").value
        = document.getElementById("inputEmail3").value
        = document.getElementById("inputPhone3").value
        = document.getElementById("inputHobby3").value
        = "";
}

// 个人信息采集查看页面
function show() {
    // 从后台获取json文件中的数据给表格中for item in data
    $.ajax({
        url: "http://localhost:1337/api/show",
        // CORS处理跨域请求
        // 指定请求为CORS请求
        xhrFields: {
            withCredentials: false
        },
        type: "GET",
        success: function (data) {
            console.log(data);
            if (data.status == 200) {
                var html = "";
                for (var i = 0; i < data.data.length; i++) {
                    html += "<tr>";
                    html += "<td>" + data.data[i].name + "</td>";
                    html += "<td>" + data.data[i].id + "</td>";
                    html += "<td>" + data.data[i].email + "</td>";
                    html += "<td>" + data.data[i].phone + "</td>";
                    html += "<td>" + data.data[i].hobby + "</td>";
                    html += "</tr>";
                }
                document.getElementById("tbody").innerHTML = html;
            } else {
                commonUtil.message("获取数据失败！", "danger");
            }
        },
        error: function (data) {
            console.log(data);
            commonUtil.message("获取数据失败！", "danger");
        }
    });
}

window.onload = show; // 页面加载即调用show



// 消息提示框组件
var commonUtil = {
    /**
     * 弹出消息框
     * @param msg 消息内容
     * @param type 消息框类型（参考bootstrap的alert）
     */
    alert: function (msg, type) {
        if (typeof (type) == "undefined") { // 未传入type则默认为success类型的消息框
            type = "success";
        }
        // 创建bootstrap的alert元素
        var divElement = $("<div></div>").addClass('alert').addClass('alert-' + type).addClass('alert-dismissible').addClass('col-md-4').addClass('col-md-offset-4');
        divElement.css({ // 消息框的定位样式
            "position": "absolute",
            "top": "80px"
        });
        divElement.text(msg); // 设置消息框的内容
        // 消息框添加可以关闭按钮
        var closeBtn = $('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>');
        $(divElement).append(closeBtn);
        // 消息框放入到页面中
        $('body').append(divElement);
        return divElement;
    },

    /**
     * 短暂显示后上浮消失的消息框
     * @param msg 消息内容
     * @param type 消息框类型
     */
    message: function (msg, type) {
        var divElement = commonUtil.alert(msg, type); // 生成Alert消息框
        var isIn = false; // 鼠标是否在消息框中

        divElement.on({ // 在setTimeout执行之前先判定鼠标是否在消息框中
            mouseover: function () { isIn = true; },
            mouseout: function () { isIn = false; }
        });

        // 短暂延时后上浮消失
        setTimeout(function () {
            var IntervalMS = 20; // 每次上浮的间隔毫秒
            var floatSpace = 60; // 上浮的空间(px)
            var nowTop = divElement.offset().top; // 获取元素当前的top值
            var stopTop = nowTop - floatSpace;    // 上浮停止时的top值
            divElement.fadeOut(IntervalMS * floatSpace); // 设置元素淡出

            var upFloat = setInterval(function () { // 开始上浮
                if (nowTop >= stopTop) { // 判断当前消息框top是否还在可上升的范围内
                    divElement.css({ "top": nowTop-- }); // 消息框的top上升1px
                } else {
                    clearInterval(upFloat); // 关闭上浮
                    divElement.remove();    // 移除元素
                }
            }, IntervalMS);

            if (isIn) { // 如果鼠标在setTimeout之前已经放在的消息框中，则停止上浮
                clearInterval(upFloat);
                divElement.stop();
            }

            divElement.hover(function () { // 鼠标悬浮时停止上浮和淡出效果，过后恢复
                clearInterval(upFloat);
                divElement.stop();
            }, function () {
                divElement.fadeOut(IntervalMS * (nowTop - stopTop)); // 这里设置元素淡出的时间应该为：间隔毫秒*剩余可以上浮空间
                upFloat = setInterval(function () { // 继续上浮
                    if (nowTop >= stopTop) {
                        divElement.css({ "top": nowTop-- });
                    } else {
                        clearInterval(upFloat); // 关闭上浮
                        divElement.remove();    // 移除元素
                    }
                }, IntervalMS);
            });
        }, 1500);
    }
}
