exports.getArguments = getArguments;


var P = /\(.*\)\ *\{/;
var getArguments = function(f) {
    var source = f.toString();
    var argStr = source.match(P)[0];
    var arg = removeALL(argStr, '(', ')', ' ', '{');
    return arg.split(',').sort();
};

remove = function(str, c) {
    return str.replace(c, '');
};

removeALL = function(str) {
    var t = str,
        i = 1;
    while (i < arguments.length) {
        t = t.remove(arguments[i]);
        i = i + 1;
    }
    return t;
};