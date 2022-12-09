// 创建一个服务器
const express = require('express');
const app = express();
const fs = require("fs");
// 引入cors库
const cors = require("cors");

// 使用cors中间件，解决跨域问题
app.use(cors({
    // 设置允许跨域的域名，限定本机，不能是*
    accessControlAllowOrigin: "http://localhost:5500",
    // 允许来自指定域名的请求
    origin: "http://127.0.0.1:5500",
    // 允许发送身份凭证
    credentials: true
}));

app.set('port', process.env.PORT || 1337);  // 设置端口号，同机需要与前端可以不一致
// 读取存储在data文件夹中的文件
__dirname = './data';

// 定义router
const router = express.Router();
// 使用router
app.use(router);

// /api/submit接口
router.post("/api/submit", function (req, res) {
    console.log("submit");
    var data = req.body;
    // 把数据按照collection.js中的格式打包为json，传递到后台
    // 把json数据写入json文件
    console.log(data);
    fs.writeFile(__dirname + data.stuId + ".json", JSON.stringify(data), function (err) {
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

// TODO


// 处理get请求，返回某一项数据
app.get('/api/get/:id', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        // 在文件夹所有文件中查找对应名称的文件
        data = JSON.parse(data);
        const index = data.findIndex(x => x.id == req.params.id);
        res.send(data[index]);
    });
});

// 处理post请求，返回某一项数据
app.post('/api/post', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        data = JSON.parse(data);
        const index = data.findIndex(x => x.id == req.params.id);
        res.send(data[index]);
    });
});


// put请求，更新某一项数据
app.put('/api/put', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        data = JSON.parse(data);
        const index = data.findIndex(x => x.id == req.params.id);
        data[index] = req.body;
        saveJson(data);
        res.send(data);
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

// 获取所有数据请求，返回所有数据
app.get('/api/getAll', (req, res) => {
    fs.readFile(jsonFile, 'utf8', (err, data) => {
        // 返回文件夹内所有文件中的数据
        data = JSON.parse(data);
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