/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
exports.getArguments = getArguments;
var P = /\(.*\)\ *\{/;





var getArguments = function(f) {
    var source = f.toString();
    var argStr = source.match(P)[0];
    var arg = removeALL(argStr, '(', ')', ' ', '{');
    var result = {};
    result.array = arg.split(',').sort();
    result.string = arg;
    return result;
};

var remove = function(str, c) {
    return str.replace(c, '');
};

var removeALL = function(str) {
    var t = str,
        i = 1;
    while (i < arguments.length) {
        t = remove(t, arguments[i]);
        i = i + 1;
    }
    return t;
};