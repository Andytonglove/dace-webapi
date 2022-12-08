var fs = require('fs');
var folder = process.cwd() + '/templates/';
var encoding = 'utf8';

module.exports = main;

function main(name) {

    try {
        return fs.readFileSync(folder + name, encoding);
    }
    catch (ex) {
        return undefined;
    }
}
