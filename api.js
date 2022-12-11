// 说明：本api.js为后台接口，用于接收前端或APP端的请求，返回数据
// 启动服务器：node api.js即可
// /templates中的前端页面可直接在浏览器中打开，也可go live运行
// app端可通过node app.js运行

// 创建一个服务器
const express = require('express');
const app = express();
const fs = require("fs");
const path = require('path');

// 引入cors库
const cors = require("cors");

// 使用cors中间件，解决跨域问题
app.use(cors({
    // 允许来自指定域名的请求，如果请求的凭据模式为’include’时,响应中的Access-Control-Allow-Origin’头不能为’*’
    // origin: "http://127.0.0.1:5500",
    // 允许来自所有域名的请求
    origin: "*",
    // 允许跨域的请求方式
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // 允许发送身份凭证，但是在发送端设置withCredentials: false，从而不会发送身份凭证
    credentials: true
}));

var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.set('port', process.env.PORT || 1337);  // 设置端口号，同机需要与前端可以不一致
// 读取存储在data文件夹中的文件
__dirname = './data';

// 定义router
const router = express.Router();
// 使用router
app.use(router);

// 网页端，下面是RESTful API接口

// /api/submit接口 √
router.post("/api/submit", function (req, res) {
    console.log("submit");
    var data = req.body;
    console.log(data);
    // 把数据按照collection.js中的格式打包为json，传递到后台
    // 把json数据写入json文件
    console.log(data);
    fs.writeFile(__dirname + "/" + data.id + ".json", JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
            res.json({
                status: 500,
                message: "提交失败\n" + err.message
            });
        } else {
            res.json({
                status: 200,
                message: "提交成功" + __dirname + "/" + data.id + ".json"
            });
        }
    });
});

// /api/show接口 √
router.get("/api/show", function (req, res) {
    console.log("show");
    // 从json文件中读取所有文件的数据
    fs.readdir(__dirname, function (err, files) {
        if (err) {
            console.log(err);
            res.json({
                status: 500,
                message: "获取数据失败"
            });
        } else {
            var data = [];
            for (var i = 0; i < files.length; i++) {
                var file = fs.readFileSync("./data/" + files[i]);
                data.push(JSON.parse(file));
            }
            res.json({
                status: 200,
                message: "获取数据成功",
                data: data
            });
        }
    });
});

// /api/add接口，增加一项数据：新增，和submit重合
router.post("/api/add", function (req, res) {
    // 请求格式为：{data: {id: "xxx", name: "xxx", ...}}
    var data = req.body.data;
    // 判断数据是否存在
    fs.access(__dirname + "/" + data.id + ".json", function (exists) {
        if (!exists) {
            // 数据已存在
            res.json({
                status: 500,
                message: "条目已存在"
            });
        } else {
            // 数据不存在，写入文件
            fs.writeFile(__dirname + "/" + data.id + ".json", JSON.stringify(data), function (err) {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 500,
                        message: "添加失败"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "添加成功"
                    });
                }
            });
        }
    });
});

// /api/delete接口，删除一项数据：删除 √
router.post("/api/delete", function (req, res) {
    var data = req.body; // 请求格式为：{"id": xxx}
    console.log(data);

    // 获取请求体中的id，请求体为字符串，即使是json格式，需要转换为json对象
    // data = JSON.parse(data);

    // 判断数据是否存在：在使用 fs.access() 方法时，如果检查的文件存在，则不会返回任何结果。
    // 如果文件不存在，则才会返回一个错误！因此exists为true时，表示文件不存在！
    // 获取当前文件所在目录
    console.log(path.resolve(__dirname + "/" + data.id + ".json"));

    fs.access(path.resolve(__dirname + "/" + data.id + ".json"), function (exists) {
        if (!exists) {
            // 数据存在，删除文件
            fs.unlink(path.resolve(__dirname + "/" + data.id + ".json"), function (err) {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 500,
                        message: "删除失败"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "删除成功"
                    });
                }
            }
            );
        } else {
            // 数据不存在
            res.json({
                status: 500,
                message: "条目不存在"
            });
        }
    });
});

// /api/update接口，更新一项数据：修改
router.post("/api/update", function (req, res) {
    // 例如：全部的请求为：http://localhost:3000/api/put?data={"id":"1","name":"张三","age":"18"}
    var data = req.body.data;
    // 判断数据是否存在
    fs.access(__dirname + "/" + data.id + ".json", function (exists) {
        console.log(__dirname + "/" + data.id + ".json");
        if (!exists) {
            // 数据存在，更新文件，这里之应该更新有变化的项，没变化的字段不更新
            fs.writeFile(__dirname + "/" + data.id + ".json", JSON.stringify(data), function (err) {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 500,
                        message: "更新失败"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "更新成功"
                    });
                }
            });
        } else {
            // 数据不存在
            res.json({
                status: 500,
                message: "条目不存在"
            });
        }
    });
});

// delete/:id请求，删除某一项数据
router.delete("/api/delete/:id", function (req, res) {
    // 请求体结构应该为：{data: {id: "xxx"}}
    var id = req.params.id;
    // 例如：/api/delete/1
    // 判断数据是否存在
    fs.access(__dirname + "/" + id + ".json", function (exists) {
        if (!exists) {
            // 数据存在，删除文件
            fs.unlink(__dirname + "/" + id + ".json", function (err) {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 500,
                        message: "删除失败"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "删除成功"
                    });
                }
            });
        } else {
            // 数据不存在
            res.json({
                status: 500,
                message: "条目不存在"
            });
        }
    });
});

// 输出所有条目列表，可以指定按时间升序或降序排列：列表
router.get("/api/list", function (req, res) {
    var sort = req.query.sort; // 获取排序方式，升序或降序
    // 例如：http://localhost:3000/api/list?sort=asc
    var list = []; // 创建一个空数组，用来存放所有条目
    fs.readdir(__dirname, function (err, files) { // 读取目录下的所有文件
        if (err) {
            // 如果发生错误，返回错误信息
            res.json({
                status: 500,
                message: "读取目录失败"
            });
        } else {
            // 如果没有错误，遍历所有文件
            files.forEach(function (file) {
                // 把每个文件的内容读取出来，转换为JSON格式
                fs.readFile(__dirname + "/" + file, "utf-8", function (err, data) {
                    if (err) {
                        // 如果发生错误，返回错误信息
                        res.json({
                            status: 500,
                            message: "读取文件失败"
                        });
                    } else {
                        // 如果没有错误，把文件内容转换为JSON格式，并添加到list数组中
                        list.push(JSON.parse(data));
                        // 如果list数组的长度和files数组的长度相同，说明所有文件都已经读取完毕
                        if (list.length == files.length) {
                            // 如果有排序方式，按照排序方式排序
                            if (sort) {
                                list.sort(function (a, b) {
                                    return sort == "asc" ? a.id - b.id : b.id - a.id;
                                });
                            }
                            // 返回list数组
                            res.json({
                                status: 200,
                                message: "读取成功",
                                data: list
                            });
                        }
                    }
                });
            });
        }
    });
});

// 输出某一项条目的详细信息：详情：api/find/:id
router.get("/api/find/:id", function (req, res) {
    var id = req.params.id;
    // 例如：/api/find/1
    // 判断数据是否存在
    fs.access(__dirname + "/" + id + ".json", function (exists) {
        if (!exists) {
            // 数据存在，读取文件
            fs.readFile(__dirname + "/" + id + ".json", "utf-8", function (err, data) {
                if (err) {
                    console.log(err);
                    res.json({
                        status: 500,
                        message: "读取失败"
                    });
                } else {
                    res.json({
                        status: 200,
                        message: "读取成功",
                        data: JSON.parse(data)
                    });
                }
            });
        } else {
            // 数据不存在
            res.json({
                status: 500,
                message: "条目不存在"
            });
        }
    });
});

// TODO: 优化，高内聚低耦合，可以抽象出来代码重用，例如上面减少重复代码，如读取文件，转换为JSON格式，返回数据等
// 几个主要问题：
// 1、代码没有考虑文件已存在的情况，如果客户端重复提交数据，文件可能会被更新。这主要是基于学号唯一的标准。
// 2、代码没有使用 Promise 来管理异步操作，可以使用 async/await 来改进代码的可读性。
// 3、代码没有给所有api提供路由参数，部分api无法处理单独的文件。这主要是基于有些api是针对整个目录的考虑。

// 监听端口，这里以localhost的1337端口为例
app.listen(app.get('port'), () => {
    console.log('Server listening on: http://localhost:', app.get('port'));
});

// 上面的代码是服务端的代码，下面是APP端的代码，见app.js