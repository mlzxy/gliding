/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
exports.isFunction = isFunction;

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
}