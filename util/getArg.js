/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var P = /\(.*\)\ *\{/;





var getArguments = function(f) {
    debugger;
    var source = f.toString();
    var argStr = source.match(P);
    var arg = removeALL(argStr[0], '(', ')', ' ', '{');
    arg = arg.split(',');
    for (s in arg)
        arg[s] = arg[s].trim();
    return arg;
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

exports.getArguments = getArguments;