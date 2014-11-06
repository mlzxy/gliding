/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var walk = require('walk');
var util = require('./util.js');
var shouldInclude = function(path, options) { //whether this module should be included
    var r;
    var PUBLIC = options.PUBLIC;
    for (var idx in options.MODULES) {
        r = options.MODULES[idx];
        if (util.isString(r)) { //path and r are all relative
            if (r == path) {
                return true;
            }
        } else if (util.isRegex(r)) {
            var t = path.match(r);
            if (t !== null && t[0] == t.input)
                return true;
        } else {
            throw new Error("the module:" + r + " that you specify in the options is not a Regex or String.\n");
        }
    }
    return false;
};

var filter = function(pathArray, options) {
    var result = [];
    for (var idx in pathArray) {
        if (shouldInclude(pathArray[idx], options))
            result.push(options.PATH + pathArray[idx]);
    }
    return result;
};


var allPath = function(root, options) {
    var pathArray = [];
    var f = function(root, stat, next) { //should deal with hidden file?
        var filename = root + '/' + stat.name;
        if (!util.isHidden(filename)) {
            filename = filename.slice(options.PATH.length);
            if (filename[0] == '/') filename = filename.slice(1);
            //if not hidden
            pathArray.push(filename); // pathArray = ['modules/a','modules/b/a'];
        }
        next();
    };
    var walk_options = {
        listeners: {
            file: f
        }
    };
    walk.walkSync(root, walk_options);

    pathArray = filter(pathArray, options);
    return pathArray;
};
var allModules = function(options) {
    var result = [],
        reglist = options.MODULES,
        PATH = options.PATH;
    for (var v in reglist) {
        var t = reglist[v];
        if (util.isString(t) && t.endsWith('|m')) {
            result.push(require(t.slice(0, t.length - 2)));
            options.MODULES = reglist.removeIndexAt(v);
        }
    }
    var pathArray = allPath(PATH, options);
    for (var i = 0; i < pathArray.length; i++)
        result.push(require(pathArray[i]));
    return result;
};

var modulesToService = function(modules) {
    var cM = null,
        thisModule = null,
        serviceSet = {};
    serviceSet['service'] = {};
    serviceSet['handler'] = [];
    for (var mn = 0; mn < modules.length; mn++) {
        cM = modules[mn];
        if (cM.hasOwnProperty('myModule')) {
            thisModule = cM['myModule'];
            incorperate(serviceSet.service, thisModule.factory.content);
            incorperate(serviceSet.service, thisModule.provider.content);
            serviceSet.handler = serviceSet.handler.concat(thisModule.handler.content);
        }
    }
    return serviceSet;
};


var incorperate = function(obj, arr) {
    for (var i = 0; i < arr.length; i++) {
        item = arr[i];
        obj[item.key] = item.value;
    }
};

exports.allModules = allModules;
exports.modulesToService = modulesToService;