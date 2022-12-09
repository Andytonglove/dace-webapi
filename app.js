// 创建一个服务器
const express = require('express');
const app = express();
const fs = require("fs");

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
    // 允许发送身份凭证
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

// 网页端

// /api/submit接口
router.post("/api/submit", function (req, res) {
    console.log("submit");
    var data = req.body;
    // 把数据按照collection.js中的格式打包为json，传递到后台
    // 把json数据写入json文件
    console.log(data);
    fs.writeFile(__dirname + "/" + data.stuId + ".json", JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
            res.json({
                status: 500,
                message: "提交失败\n" + err.message
            });
        } else {
            res.json({
                status: 200,
                message: "提交成功"
            });
        }
    });
});

// /api/show接口
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

// /api/add接口，增加一项数据
router.post("/api/add", function (req, res) {
    var data = req.body.data;
    // 判断数据是否存在
    fs.access(__dirname + "/" + data.id + ".json", function (exists) {
        if (exists) {
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

// /api/delete接口，删除一项数据
router.post("/api/delete", function (req, res) {
    var data = req.body.data;
    // 判断数据是否存在
    fs.access(__dirname + "/" + data.id + ".json", function (exists) {
        if (exists) {
            // 数据存在，删除文件
            fs.unlink(__dirname + "/" + data.id + ".json", function (err) {
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

// /api/put接口，更新一项数据
router.post("/api/put", function (req, res) {
    var data = req.body.data;
    // 判断数据是否存在
    fs.access
        (__dirname + "/" + data.id + ".json", function (exists) {
            if (exists) {
                // 数据存在，更新文件
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


// delete请求，删除某一项数据
app.delete('/api/delete', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        data = JSON.parse(data);
        const index = data.findIndex(x => x.id == req.params.id);
        data.splice(index, 1);
        saveJson(data);
        res.send(data);
    });
});

// 输出所有条目列表，可以指定按时间升序或降序排列
router.get("/api/list", function (req, res) {
    var sort = req.query.sort; // 获取排序方式，升序或降序
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

// TODO:

//删除
app.get('/delete/:id', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        data = JSON.parse(data);
        const index = data.findIndex(x => x.id == req.params.id);
        data.splice(index, 1);
        console.log(data);
        saveJson(data);
        res.send(data);
    });
});

//保存到文件
function saveJson(data) {
    fs.writeFile(jsonFile, JSON.stringify(data), "utf-8", err => {
        if (!err) {
            console.log('写入成功！')
        } else {
            console.log('写入失败！')
        }
    });
}

// 监听端口，这里以localhost的1337端口为例
app.listen(app.get('port'), () => {
    console.log('Server listening on: http://localhost:', app.get('port'));
});


// APP

// 对应上面的API，提供APP端的命令行操作
const program = require('commander');
// 编写支持命令行的api
program
    .version('0.0.1')
    .option('-a, --add', 'add a new item')
    .option('-u, --update', 'update an item')
    .option('-d, --delete', 'delete an item')
    .option('-l, --list', 'list all items')
    .parse(process.argv);

// 如果没有输入命令，提示用户输入命令
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// 如果输入了命令，执行对应的命令
if (program.add) {
    console.log('add');
}
if (program.update) {
    console.log('update');
}
if (program.delete) {
    console.log('delete');
}
if (program.list) {
    console.log('list');
}