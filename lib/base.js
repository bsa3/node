#!/usr/local/bin/node
/*jshint esversion: 6 */
//  ./lib/base.js
// ./node_modules/jshint/bin/jshint ./lib/base.js
// tests inline

const fs = require("fs");
const path = require('path');
const callback = err => {
    if (err) {throw err;}
};

Reset = "\x1b[0m";
Bright = "\x1b[1m";
Dim = "\x1b[2m";
Underscore = "\x1b[4m";
Blink = "\x1b[5m";
Reverse = "\x1b[7m";
Hidden = "\x1b[8m";

FgBlack = "\x1b[30m";
FgRed = "\x1b[31m";
FgGreen = "\x1b[32m";
FgYellow = "\x1b[33m";
FgBlue = "\x1b[34m";
FgMagenta = "\x1b[35m";
FgCyan = "\x1b[36m";
FgWhite = "\x1b[37m";

BgBlack = "\x1b[40m";
BgRed = "\x1b[41m";
BgGreen = "\x1b[42m";
BgYellow = "\x1b[43m";
BgBlue = "\x1b[44m";
BgMagenta = "\x1b[45m";
BgCyan = "\x1b[46m";
BgWhite = "\x1b[47m";

//   node -p -e 'require("./lib/base.js").getSubDirectories("./");' 
//  const getSubDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory());
module.exports.getSubDirectories = function (rootDir) {
    let srcPath = require('path').resolve(rootDir);
    //console.log("getSubDirectories: " + srcPath);
    return fs.readdirSync(srcPath)
        .map(file => path.join(srcPath, file))
        .filter(path => fs.statSync(path).isDirectory());
};

function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
        return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
}

function flatten2(arr) {
    return arr.reduce((flat, toFlatten) => flat.concat(toFlatten), []);
}

module.exports.logError = function(configObj, SOMETHING_BAD="error") {
    console.log(FgRed+ "### " + SOMETHING_BAD + " ###");
    var stream = fs.createWriteStream(configObj.logfile, { flags: 'a' });
    stream.write(`\n ${JSON.stringify(configObj, undefined, 2)}`);
    stream.write(`\n ${SOMETHING_BAD}`);
    stream.on('drain', function () {
        process.exit(1);
    });
    //
    throw new Error(SOMETHING_BAD);
};

module.exports.log = function(logfile="app.log", message="message", message_type="info") {
//  node -p 'require("./lib/base.js").log(logfile="app.log", message="message", type="info");'
    if (message_type == "error") {message_color = FgRed;} else {message_color = FgYellow;}
    console.log(message_color + '%s\x1b[0m', `### docCI ${message_type}: ` + message + " ###");
    var stream = fs.createWriteStream(logfile, { flags: 'a' });
    stream.write(`\n ${message_type}: ${message}`);
    stream.on('drain', function () {
    });
};

module.exports.getArgs = function getArgs () {
//  node -p 'require("./lib/base.js").getArgs();'
    const args = {};
    process.argv
        .slice(2, process.argv.length)
        .forEach( arg => {
        // long arg
        if (arg.slice(0,2) === '--') {
            const longArg = arg.split('=');
            const longArgFlag = longArg[0].slice(2,longArg[0].length);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === '-') {
            const flags = arg.slice(1,arg.length).split('');
            flags.forEach(flag => {
            args[flag] = true;
            });
        }
    });
    //console.log(args);
    return args;
};

module.exports.isArray = function(a) {
//  return bool on check if var is a array
//  node -p -e 'require("./lib/base.js").isArray([]);'
    return Array.isArray(a);
    //return (!!a) && (a.constructor === Array);
};

module.exports.isObject = function(a) {
//  check if var is a object
//  node -e 'let res=require("./lib/base.js").isObject({}); console.log(res)'
    return (!!a) && (a.constructor === Object);
};

module.exports.createDirectory = function(userDirectory) {
//  recursive create userDirectory
//  node -e 'let res=require("./lib/base.js").createDirectory("./node_modules/testxyz"); console.log(res)'
    if (fs.existsSync(userDirectory)) {
        let mkdirResult = "mkdir: " + userDirectory + ": exists";
        console.log(mkdirResult);
        //process.exit(1);
        return mkdirResult;
    } else {
        console.log("mkdir: " + userDirectory);
        return fs.mkdirSync(userDirectory, { recursive: true });
        //fs.mkdir(userDirectory, callback)
    }
};

module.exports.writeJSONFile = function(filePath, userData, sort=true) {
// stringify a json object into a pretty file
//  node -e 'require("./lib/base.js").writeJSONFile("./tests/testFile.json", {});'
    //console.log(userData);
    if (sort) {
        const sorted_userData = {};
        Object.keys(userData).sort().forEach(function(key) {
            sorted_userData[key] = userData[key];
        });
        userData = sorted_userData;
    }
    const userDirectory = path.dirname(filePath);
    try {
        exports.createDirectory(userDirectory);
    } catch (error) {console.log( error );}
    try {
        console.log("writeJSONFile: " + filePath);
        if ( typeof userData !== 'undefined' ) { fs.writeFile(filePath, JSON.stringify(userData, null, 3), callback); }
        else { console.log("WARN: userData is undefined");
            fs.writeFile(filePath, JSON.stringify("undefined", null, 3), callback);
        }      
    } catch (error) {console.log( error + " ERROR: can not writeFile ");}
};

module.exports.readFile = function(filePath, options={encoding:"utf8"}) {
//  stringify a json object into a pretty file
//  node -p 'require("./lib/base.js").readFile("./test/output");'
//  node -p 'JSON.parse(require("./lib/base.js").readFile("./x", {encoding:"utf8"}))'
    //var fileArray=require("./base.js").listFilesSync("./"); console.log(fileArray);
    console.log("readFile: " + path.resolve(filePath));
    return fs.readFileSync(path.resolve(filePath), options.encoding);
};

module.exports.readJSONFile = function(jsonFile) {
//  get a json object out of a file

    let jsonData = require(path.resolve(jsonFile));
    return jsonData;
};

var defaultExtensions = [".md"];
module.exports.listFilesWithExtensionSync = function(userPath='.', userExtensions=defaultExtensions, recursive=false) {
//  returns and Array of files matching a user defined file extension (case insentive extension)
    // node -p -e 'require("./lib/base.js").listFilesWithExtensionSync(".");'

    const srcPath = require('path').resolve(userPath);
    //console.log("listFilesWithExtensionSync: " + srcPath);
    const files = fs.readdirSync(srcPath);
    //console.log(files)
    var returnFileList = [];
    var lowercaseUserExtensions = [];
    //console.log(userExtensions);
    userExtensions.forEach(suffix => {
        lowercaseUserExtensions.push(suffix.toLowerCase()) ;
    });
    //console.log(lowercaseUserExtensions);
    if (recursive){
        const directories = exports.listDirsSync(userPath, true);
        //console.log(directories);
        directories.forEach(dir => { 
            let dirfilelist = exports.listFilesWithExtensionSync(dir, userExtensions, false);
            if (dirfilelist.length > 1 && dirfilelist != undefined) { returnFileList.push(dirfilelist); }
        });
        return flatten(returnFileList);
    }

    if (exports.isArray(files)) {
        files.filter(function(file) {
            if (lowercaseUserExtensions.indexOf(path.extname(file).toLowerCase()) > -1) {
                //console.log(file);
                returnFileList.push(`${srcPath}/${file}`);
            }
        });
        //console.log(jsonFileList)
        return returnFileList;
    } else {
        return returnFileList;
    }
};

module.exports.listDirsSync = function(rootDir='./', recursive=false) {
// node -p -e 'require("./lib/base.js").listDirsSync("./");' 
    let srcPath = require('path').resolve(rootDir);
    //console.log("listDirSync: " + srcPath);
    function getDirectoriesRecursive(srcPath) {
        return [srcPath, ...flatten(exports.getSubDirectories(srcPath).map(getDirectoriesRecursive))];
    }
    if (recursive){
        return getDirectoriesRecursive(srcPath);
    } else {
        return exports.getSubDirectories(srcPath);
    }
};

module.exports.listFilesSync = function(directory="./", recursive=false) {
    //list every item in a directory; returns a recursive list
    //test: node -e 'var fileArray=require("./lib/base.js").listFilesSync("./", true); console.log(fileArray);'

    let totalFilesCollection = [];
    let filesCollection = [];
    function readDirectorySynchronously(directory) {
        var currentDirectory = fs.readdirSync(directory, 'utf8');
        currentDirectory.forEach(item => {
            var pathOfCurrentItem = path.join(directory + '/' + item);
            if (fs.statSync(pathOfCurrentItem).isFile()) {
                filesCollection.push(pathOfCurrentItem);
            }
            else if (fs.statSync(pathOfCurrentItem).isDirectory())  {
                var directorypath = path.join(directory + '/' + item);
               
                if (recursive) {
                    readDirectorySynchronously(directorypath);
                }
            }
        });
        return filesCollection;
    }
    totalFilesCollection=readDirectorySynchronously(directory);
    //console.log(JSON.stringify(filesCollection)) ///MAY BE A VERY VERY LONG LIST!!!
    return totalFilesCollection;
};

module.exports.removeDir = function(userDirectory){
//    node -e 'require("./lib/base.js").removeDir("./tests");'

    fs.rmdir(userDirectory, callback);
};

module.exports.exec = function(command){
//test:   node -e 'require("./lib/base.js").exec("ls -la")'
    var cpe = require('child_process').exec(command, (err, stdout, stderr) => {
        if (err) {console.error(`exec error: ${err}`);
            return err;
        }
        if (stderr) {console.log(`stderr: ${stderr}`); return stderr;}
        if (stdout) {console.log(`stdout: ${stdout}`); return stdout;}
    });
    process.on('exit', function () {
        //console.log("kill")
        cpe.kill();
    });
};

module.exports.shallowMerge = function (obj1, obj2) {
    //  node -p 'require("./lib/base.js").shallowMerge(obj1, obj2);'
    //  shallowMerge obj2 --> obj1
        return Object.assign({}, obj1, obj2);
};

module.exports.deepMerge = function (obj1, obj2) {
    //  deepMerge obj2 --> obj1
    //  node -p 'require("./lib/base.js").deepMerge(obj1, obj2);'
    const merge = require('deepmerge');
    const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
    return merge(obj1, obj2, { arrayMerge: overwriteMerge });
};

//  node -p 'require("./lib/base.js").titleCase("this string");'
module.exports.titleCase = function (str) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 };
 

//console.log(exports)
///////////  TESTS     ///////////////
module.exports.tests = function(){
//  node -p 'require("./lib/base.js").tests()'
    exports.writeJSONFile("./tests-temp/testFile.json", []);
    exports.exec("rm -rf ./tests-temp && echo 1-PASS");
};


//////////// DEV  ONLY /////////////////

