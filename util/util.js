/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */



String.prototype.startsWith = function(str) {
    return this.indexOf(str) === 0;
};
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

String.prototype.endsWithArray = function(arr) {
    for (var v in arr)
        if (this.endsWith(arr[v]))
            return true;
    return false;
};




//////////////////////////////////////////////////////////////////

function mergeOptions(a, b) {
    for (var v in b) {
        a[v] = a[v] || b[v];
    }
    return updateOptions(a);
}

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function isObject(obj) {
    return typeof obj == 'object';
}

function updateOptions(options) {
    if (!options.PUBLIC.endsWith('/')) {
        options.PUBLIC = options.PUBLIC.concat('/');
    }
    options.PUBLIC = options.PATH + options.PUBLIC;
    for (var i = 0; i < options.MODULES.length; i++)
        options.MODULES[i] = options.PATH + options.MODULES[i];
    return options;
}


exports.isFunction = isFunction;
exports.isObject = isObject;
exports.mergeOptions = mergeOptions;
exports.updateOptions = updateOptions;