// 创建一个服务器
const express = require('express');
const app = express();
const fs = require("fs");

app.set('port', process.env.PORT || 5500);
// 读取存储在data文件夹中的文件
__dirname = '/data';


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

app.listen(app.get('port'), () => {
    console.log('Server listening on: http://localhost:', app.get('port'));
});