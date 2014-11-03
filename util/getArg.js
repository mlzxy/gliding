exports.getArguments = getArguments;
exports.getArgFunChain = getArgFunChain;
var P = /\(.*\)\ *\{/;

var getArgFunChain = function(funChain, system) {
    var result = [],
        arg = null,
        fun = null;
    for (var i = 0; i < funChain.length; i++) {
        fun = funChain[i];
        arg = getArg.getArguments(fun);
        system.functionToArguments[fun] = arg.array;
    }
};




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

String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
};
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};