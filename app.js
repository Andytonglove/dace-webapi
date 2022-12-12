const program = require('commander'); // 用于解析命令行参数的库
const request = require('request'); // 用于发送HTTP请求的库

// 以下是APP端的代码，api代码在api.js中

function isValidEmail(email) {
    return /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(email);
}

function isValidMobile(phone) {
    return /^1[3456789]\d{9}$/.test(phone);
}

function isValidId(id) {
    return /^\d{8,13}$/.test(id);
}

// 对应上面的API，提供APP端的命令行操作，这里命令行操作实现可以直接调用上面的API，
// 长、短项：单「-」代表短选项，双「--」代表长选项。长短项表示的效果相同，可随意选择使⽤
// 联合选项：-u id {-n｜-i|-m|-b}, 即-u选项必须附带最少后面的四个选项之⼀才能工作，否则警告提示
// 同理，- a { -n - i - m - b }, 即 - a选项必须同时附带后面的4个选项才能工作，否则警告提示
// 互斥选项：-a | -d | -u | -l ,即该4个选项只能同时选择⼀个。如果选择多个，警告提示
// 以上选项，均为非强制选项（即：如果运行时无选项，则按照「 --list=descend」操作（因为这是⼀个安全操作）

// command和option的区别：command是命令，option是选项，这里用option的方式实现上面的功能
program
    .version('0.0.1')
    .description('An app of Personal Information Collection System')
    .option('-a, --add', 'add a new item')
    .option('-u, --update', 'update an item')
    .option('-d, --delete <id>', 'delete an item')
    .option('-l, --list [sort]', 'list all items', /^(ascend|descend)$/i, 'descend')
    .option('-f, --find <id>', 'find an item')
    .option('-n, --name <name>', 'add a new name')
    .option('-i, --id <id>', 'add a new id')
    .option('-m, --mobile <mobile>', 'add a new mobile')
    .option('-b, --hobby <hobby>', 'add a new hobby')
    .option('-e, --email <email>', 'add a new email')
    .parse(process.argv);

var options = program.opts(); // 获取命令行参数，这句话一定要！！！

// 如果没有输入命令，则默认输出帮助信息，TODO：也可按照「 --list=descend」操作
if (!process.argv.slice(2).length) {
    program.outputHelp();
    process.exit(1);
}

// 互斥选项：-a | -d | -u | -l ,即该4个选项只能同时选择⼀个。如果选择多个，警告提示
if (options.add + options.delete + options.update + options.list > 1) {
    console.log('互斥选项：-a | -d | -u | -l ,即该4个选项只能同时选择⼀个');
    process.exit(1);
}

// 联合选项：当选择-a选项时，必须输入--name、--id、--mobile、--hobby、--email参数，支持短参数和长参数
if (options.add) {
    if (!options.name || !options.id || !options.mobile || !options.hobby || !options.email) {
        console.log('添加条目时，必须输入--name、--id、--mobile、--hobby、--email参数');
        process.exit(1);
    }
}

// 联合选项：当选择-u选项时，必须输入--id参数，支持短参数和长参数，还需要至少输入一个更新参数
if (options.update) {
    if (!options.id) {
        console.log('更新条目时，必须输入--id参数');
        process.exit(1);
    }
    if (!options.name && !options.mobile && !options.hobby && !options.email) {
        console.log('更新条目时，必须输入至少一个更新参数');
        process.exit(1);
    }
}

// 示例：node app -a -n "张三" -i "1234567890" -m "17345678901" -b "篮球" -e "zhangsan@example.com"

// 如果输入了命令，执行对应的命令
if (options.add) {
    // 添加条目，读取--name、--id、--mobile、--hobby、--email参数，支持短参数和长参数，以及中文
    var name = options.name;
    var id = options.id;
    var mobile = options.mobile;
    var hobby = options.hobby;
    var email = options.email;

    // 参数校验，如果参数不合法，则直接退出
    if (!isValidId(id) || !isValidMobile(mobile) || !isValidEmail(email)) {
        console.log('参数不合法');
        return;
    }

    // 使用request请求，添加条目，调用上面服务端的API：
    request.post({
        url: 'http://localhost:1337/api/add',
        // form和data都可以，但是form是表单提交，data是json提交
        // 服务器端req.body为空，body-parser中间件不起作用，需要使用qs.stringify()方法
        data: JSON.stringify({
            "name": name,
            "id": id,
            "email": email,
            "phone": mobile,
            "hobby": hobby
        }),
        headers: {
            // application/x-www-form-urlencoded用于post请求，application/json用于get请求
            'Content-Type': 'application/json'
        }

    }, function (err, httpResponse, body) {
        if (err) {
            console.log('添加失败 ' + err);
        } else {
            // 返回的body是字符串，需要转换成对象，否则无法访问对象的属性
            body = JSON.parse(body);
            if (body.status === 500) {
                console.log('添加失败 ' + body.message);
                return;
            } else {
                console.log('添加条目：' + name + ' ' + id + ' ' + email + ' ' + mobile + ' ' + hobby);
                console.log('添加成功 ' + body.message);
            }
        }
    });

    // 也可使用axios请求或使用ajax请求，不能退出程序！因为是异步请求，如果退出程序，请求还没发出去！！！
    // process.exit(0);
} else if (options.update) {
    // 更新条目，读取--name、--id、--mobile、--hobby、--email参数
    var name = options.name;
    var id = options.id;
    var mobile = options.mobile;
    var hobby = options.hobby;
    var email = options.email;

    if (!isValidId(id) || !isValidMobile(mobile) || !isValidEmail(email)) {
        console.log('参数不合法');
        return;
    }

    console.log('更新条目：' + name + ' ' + id + ' ' + email + ' ' + mobile + ' ' + hobby);

    // 使用request模块发送POST请求，更新条目，只更新新输入的参数，调用上面服务端的API：
    request.post({
        url: 'http://localhost:1337/api/update',
        form: {
            name: name,
            id: id,
            mobile: mobile,
            hobby: hobby,
            email: email
        },
    }, function (err, httpResponse, body) {
        if (err) {
            console.log('更新失败');
        } else {
            console.log('更新成功');
        }
    });

} else if (options.delete) {
    // 删除条目，读取id参数
    var id = options.delete;

    if (!isValidId(id)) {
        console.log('参数不合法');
        return;
    }
    // 如果没有输入参数，提示用户输入参数
    if (!id) {
        console.log('请输入参数');
        return;
    }
    console.log('删除条目：' + id);

    // 使用request模块发送请求，删除条目
    request.delete('http://localhost:1337/api/delete/' + id, function (err, httpResponse, body) {
        if (err) {
            console.log('删除失败' + err.message);
        } else {
            body = JSON.parse(body);
            console.log('删除成功' + body.message);
        }
    });

} else if (options.find) {
    // 查找条目，读取find的id参数
    var id = options.find;
    // 如果没有输入参数，提示用户输入参数

    if (!id) {
        console.log('请输入参数');
        return;
    }
    if (!isValidId(id)) {
        console.log('参数不合法');
        return;
    }
    console.log('查找条目：' + id);
    // 使用request模块发送GET请求，查找条目
    request.get('http://localhost:1337/api/find/' + id, function (err, httpResponse, body) {
        if (err) {
            console.log('查找失败');
        } else {
            body = JSON.parse(body);

            if (body.status === 500) {
                console.log('查找失败 ' + body.message);
                return;
            } else {
                console.log('查找成功');
                console.log('查找结果：' + body.data.name + ' ' + body.data.id + ' ' + body.data.email + ' ' + body.data.mobile + ' ' + body.data.hobby);
            }
        }
    });

} else if (options.list) {
    // 调用上面服务端的API：api/list，列出所有条目
    var sort = options.list;
    // 如果没有输入参数，按照des列出所有条目

    console.log('列出条目：' + sort);

    if (sort === 'ascend') {
        // 使用request模块发送GET请求，列出所有条目
        request.get('http://localhost:1337/api/list?sort=asc', function (err, httpResponse, body) {
            if (err) {
                console.log('列出失败');
            } else {
                // 返回的body是字符串，需要转换成对象，否则无法访问对象的属性
                body = JSON.parse(body);
                // 打印出body.data，按照表格形式组织
                console.log(body.data);
            }
        });
    } else if (sort === 'descend') {
        // 使用request模块发送GET请求，列出所有条目
        request.get('http://localhost:1337/api/list?sort=desc', function (err, httpResponse, body) {
            if (err) {
                console.log('列出失败');
            } else {
                body = JSON.parse(body);
                console.log(body.data);
            }
        });
    }
    // 输入参数为空，按照des安全选项列出所有条目
    else if (!sort) {
        // 使用request模块发送GET请求，列出所有条目
        request.get('http://localhost:1337/api/list?sort=desc', function (err, httpResponse, body) {
            if (err) {
                console.log('列出失败');
            } else {
                body = JSON.parse(body);
                console.log(body.data);
            }
        });
    } else {
        console.log('请输入正确的参数');
    }

} else {
    // 为什么直接跳到这里？因为没获取到命令行参数
    console.log('请输入正确的命令行参数，可通过 node app -h 查看帮助');
}

// 以上是APP端的代码
