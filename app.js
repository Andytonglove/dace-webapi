const program = require('commander'); // 用于解析命令行参数的库

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

// 对应上面的API，提供APP端的命令行操作，这里命令行操作实现可以直接调用上面的API
// 长、短项：单「-」代表短选项，双「--」代表长选项。长短项表示的效果相同，可随意选择使⽤
// 联合选项：-u id {-n｜-i|-m|-b}, 即-u选项必须附带最少后⾯的四个选项之⼀才
// 能工作，否则警告提示 - a { -n - i - m - b }, 即 - a选项必须同时附带后面的4个选项才能工作，否则警告提示
program
    .version('0.0.1')
    .description('An app of Personal Information Collection System')
    .option('-a, --add', 'add a new item')
    .option('-u, --update', 'update an item')
    .option('-d, --delete <id>', 'delete an item')
    .option('-l, --list [sort]', 'list all items')
    .option('-n, --name <name>', 'add a new name')
    .option('-i, --id <id>', 'add a new id')
    .option('-m, --mobile <mobile>', 'add a new mobile')
    .option('-b, --hobby <hobby>', 'add a new hobby')
    .option('-e, --email <email>', 'add a new email')
    .option('-f, --find <id>', 'find an item')
    .parse(process.argv);

// 当选择-a和-u选项时，提示用户不能同时选择
if (program.add && program.update) {
    console.log('不能同时选择-a和-u选项');
    process.exit(1);
}

// 当选择-a选项时，必须输入--name、--id、--mobile、--hobby、--email参数，支持短参数和长参数
if (program.add) {
    if (!program.name || !program.id || !program.mobile || !program.hobby || !program.email) {
        console.log('添加条目时，必须输入--name、--id、--mobile、--hobby、--email参数');
        process.exit(1);
    }
}

// 当选择-u选项时，必须输入--id参数，支持短参数和长参数
if (program.update) {
    if (!program.id) {
        console.log('更新条目时，必须输入--id参数');
        process.exit(1);
    }
}

// 示例：node app -a -n "张三" -i "1234567890" -m "17345678901" -b "篮球" -e "zhangsan@example.com"

// 如果没有输入命令，则默认输出帮助信息
if (!process.argv.slice(2).length) {
    program.outputHelp();
}

// 如果输入了命令，执行对应的命令
if (program.add) {
    // 添加条目，读取--name、--id、--mobile、--hobby、--email参数，支持短参数和长参数，以及中文
    var name = program.name;
    var id = program.id;
    var mobile = program.mobile;
    var hobby = program.hobby;
    var email = program.email;
    // 如果没有输入参数，提示用户输入参数
    if (!name || !id || !mobile || !hobby || !email) {
        console.log('请输入参数');
        return;
    }
    // 使用request模块发送POST请求，添加条目，调用上面服务端的API：
    request.post({
        url: 'http://localhost:1337/api/add',
        // 如果使用了中文，需要设置编码格式
        form: {
            name: name,
            id: id,
            mobile: mobile,
            hobby: hobby,
            email: email
        }
    }, function (err, httpResponse, body) {
        if (err) {
            console.log('添加失败');
        } else {
            console.log('添加成功');
        }
    });
} else if (program.update) {
    // 更新条目，读取--name、--id、--mobile、--hobby、--email参数
    var name = program.name;
    var id = program.id;
    var mobile = program.mobile;
    var hobby = program.hobby;
    var email = program.email;
    // 如果没有输入参数，提示用户输入参数
    if (!name || !id || !mobile || !hobby || !email) {
        console.log('请输入参数');
        return;
    }
    if (!isValidId(id) || !isValidMobile(mobile) || !isValidEmail(email)) {
        console.log('参数不合法');
        return;
    }
    // 使用request模块发送POST请求，更新条目，只更新新输入的参数，调用上面服务端的API：
    request.post({
        url: 'http://localhost:1337/api/update',
        form: {
            name: name,
            id: id,
            mobile: mobile,
            hobby: hobby,
            email: email
        }
    }, function (err, httpResponse, body) {
        if (err) {
            console.log('更新失败');
        } else {
            console.log('更新成功');
        }
    });
    // 退出程序
    process.exit(0);
} else if (program.delete) {
    // 删除条目，读取--id参数
    var id = program.id;
    // 如果没有输入参数，提示用户输入参数
    if (!id) {
        console.log('请输入参数');
        return;
    }
    // 使用request模块发送POST请求，删除条目
    request.post({
        url: 'http://localhost:1337/api/delete',
        form: {
            id: id
        }
    }, function (err, httpResponse, body) {
        if (err) {
            console.log('删除失败');
        } else {
            console.log('删除成功');
        }
    });
} else if (program.list) {
    // 调用上面服务端的API：api/list，列出所有条目
    var sort = program.sort;
    // 如果没有输入参数，按照原始顺序列出所有条目
    if (!sort) {
        // 使用request模块发送GET请求，列出所有条目
        request.get('http://localhost:1337/api/list', function (err, httpResponse, body) {
            if (err) {
                console.log('列出失败');
            } else {
                console.log(body);
            }
        });
    } else if (sort === 'asc') {
        // 使用request模块发送GET请求，列出所有条目
        request.get('http://localhost:1337/api/list?sort=asc', function (err, httpResponse, body) {
            if (err) {
                console.log('列出失败');
            } else {
                console.log(body);
            }
        });
    } else if (sort === 'desc') {
        // 使用request模块发送GET请求，列出所有条目
        request.get('http://localhost:1337/api/list?sort=desc', function (err, httpResponse, body) {
            if (err) {
                console.log('列出失败');
            } else {
                console.log(body);
            }
        });
    } else {
        console.log('请输入正确的参数');
    }
} else if (program.find) {
    // 查找条目，读取--id参数
    var id = program.id;
    // 如果没有输入参数，提示用户输入参数
    if (!id) {
        console.log('请输入参数');
        return;
    }
    // 使用request模块发送GET请求，查找条目
    request.get('http://localhost:1337/api/find?id=' + id, function (err, httpResponse, body) {
        if (err) {
            console.log('查找失败');
        } else {
            console.log(body);
        }
    });
} else {
    console.log('请输入正确的参数');
}

// 以上是APP端的代码
