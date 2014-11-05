/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */

function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
};
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function mergeOptions(a, b) {
    for (var v in b) {
        a[v] = a[v] || b[v];
    }
    return updateOptions(a);
}


function updateOptions(options) {
    if (!options.PUBLIC.endsWith('/')) {
        options.PUBLIC = options.PUBLIC.concat('/');
    }
    options.PUBLIC = options.PATH + options.PUBLIC;
    for (var i = 0; i < options.pathArray.length; i++)
        options.pathArray[i] += options.PATH;
    return options;
}


exports.isFunction = isFunction;
exports.mergeOptions = mergeOptions;
exports.updateOptions = updateOptions;