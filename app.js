// 创建一个服务器
const express = require('express');
const app = express();
const fs = require("fs");

app.set('port', process.env.PORT || 1337);  // 设置端口号，同机需要与前端可以不一致
// 读取存储在data文件夹中的文件
__dirname = '/data';

// 定义router
const router = express.Router();
// 使用router
app.use(router);

// /api/submit接口
router.post("/api/submit", function (req, res) {
    var data = req.body;
    console.log(data);
    // 把数据按照collection.js中的格式打包为json，传递到后台
    // 把json数据写入json文件
    console.log(data);
    fs.writeFile("./data/" + data.stuId + ".json", JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
            res.json({
                status: 500,
                message: "提交失败"
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
    fs.readdir("./data", function (err, files) {
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

// TODO


// get请求
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// post请求
app.post('/', (req, res) => {
    res.send('Got a POST request');
});

// put请求
app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

// delete请求
app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});

//添加
app.post('/api/submit', (req, res) => {
    // 获取index.html中发出的JSON数据
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        data = JSON.parse(data);
        // data.
        const index = data.findIndex(x => x.id == req.params.id);
        data.splice(index, 1);
        console.log(data);
        saveJson(data);
        res.send(data);
    });
});

// 获取所有数据
app.get('/api/getAll', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        res.send(data);
    });
});

// api/show展示文件夹内所有数据
app.get('/api/show', (req, res) => {
    fs.readdir(__dirname, (err, files) => {
        if (err) {
            console.log(err);
        } else {
            // 将文件内容依次返回给前端
            var data = [];
            files.forEach(file => {
                var content = fs.readFileSync
                    (__dirname + '/' + file, 'utf8');
                data.push(content);
            });
            res.send(data);
        }
    });
});

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