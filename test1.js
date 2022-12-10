const path = require("path");
const { parse } = require('yargs');
const fs = require('fs');

// 命令行

// Define the options for the command-line arguments
const options = {
    'a': {
        alias: 'add',
        describe: 'Add a new record',
        type: 'boolean'
    },
    'n': {
        alias: 'name',
        describe: 'Name of the person',
        type: 'string'
    },
    'i': {
        alias: 'id',
        describe: 'Identification number of the person',
        type: 'string'
    },
    'm': {
        alias: 'mobile',
        describe: 'Mobile phone number of the person',
        type: 'string'
    },
    'b': {
        alias: 'location',
        describe: 'Current location of the person',
        type: 'string'
    },
    'd': {
        alias: 'delete',
        describe: 'Delete a record',
        type: 'string'
    },
    'l': {
        alias: 'list',
        describe: 'List all records',
        type: 'boolean'
    },
    'u': {
        alias: 'update',
        describe: 'Update a record',
        type: 'string'
    }
}

// Parse the command-line arguments using yargs
const argv = parse(process.argv.slice(2), { options });

// Read the records from the file
// 这里存储数据的是在data文件夹中，每一条数据对应一个JSON文件，读取的时候，遍历data文件夹，读取所有的JSON文件
const directoryPath = path.join(__dirname, '/');
let records = [];
fs.readdir(directoryPath, function (err, files) {
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    files.forEach(function (file) {
        if (file.endsWith('.json')) {
            const filePath = path.join(__dirname, file);
            const record = JSON.parse(fs.readFileSync(filePath, 'utf8'))  // 读取JSON文件
            records.push(record);
        }
    });
});

// Handle the different commands
// 根据不同的命令，执行不同的操作
// json文件组织格式如下：
// {
//     "name": "张三",
//     "stuId": "123456",
//     "email": "zhangsan@example.com",
//     "phone": "13000000000",
//     "hobby": "篮球"
// }
if (argv.add) {
    // Add a new record
    const record = {
        name: argv.name,
        stuId: argv.id,
        email: argv.email,
        phone: argv.mobile,
        hobby: argv.hobby
    };
    const filePath = path.join(__dirname, `${record.stuId}.json`);
    // 写入一个新文件中
    fs.writeFileSync(filePath, JSON.stringify(record));
    records.push(record);
    // Save the updated records to the file
    console.log(`Record added: ${record.id}`);
} else if (argv.delete) {
    // Delete a record
    const id = argv.delete;
    const record = records.find(r => r.id === id);
    if (record) {
        const filePath = path.join(__dirname, `${record.id}.json`);
        // 删除文件并更新记录
        fs.unlinkSync(filePath);
        records = records.filter(r => r.id !== id);
        // Save the updated records to the file
        console.log(`Record deleted: ${record.id}`);
    } else {
        console.log(`Record not found: ${id}`);
    }
} else if (argv.list) {
    // 提供升序和降序两种排序方式，以及默认的按原顺序输出
    // 根据命令行参数，对记录进行排序
    if (argv.sort === 'asc') {
        records.sort((a, b) => a.id - b.id);
    } else if (argv.sort === 'desc') {
        records.sort((a, b) => b.id - a.id);
    } else {
        // 默认按原顺序输出
    }
    // List all records
    records.forEach(record => {
        console.log(`${record.id}\t${record.name}\t${record.id}\t${record.mobile}\t${record.location}`);
    });
    // Show the total number of records
    console.log(`${records.length} record(s) found.`);
} else if (argv.update) {
    // Update a record
    // 在所有文件中找到对应这条记录id的文件，然后更新
    const id = argv.update;
    const record = records.find(r => r.id === id);
    if (record) {
        const filePath = path.join(__dirname, `${record.id}.json`);
        // 更新文件中的记录
        if (argv.name) {
            record.name = argv.name;
        }
        if (argv.id) {
            record.id = argv.id;
        }
        if (argv.mobile) {
            record.mobile = argv.mobile;
        }
        if (argv.location) {
            record.location = argv.location;
        }
    }
} else {
    // Show usage instructions
    console.log('Usage: App [options]');
    console.log('');
    console.log('Options:');
    Object.entries(options).forEach(([key, value]) => {
        console.log(`-${key}, --${value.alias}\t${value.describe}`);
    });
}
