exports.Module = module;
exports.Export = Export;
exports.Server = server;

var http = require("http");
var url = require("url");







////////////////////////////////////getArguments/////////////////////////////////////
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

String.prototype.startsWith = function(str) {
    return this.indexOf(str) == 0;
};
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};
//////////////////////////////////////////////////////////////////////////////////

var registerProvider = function(name, content) {
    try {
        if (name.startsWith('$')) {
            if (!name.endsWith('Factory')) {
                this.content.push({
                    'key': name,
                    'value': content
                });
            } else {
                throw new Error("Provider: " + name + " should not end with \'Factory\'");
            }
        } else {
            throw new Error("Provider: " + name + " does not begin with \'$\'");
        }
    } catch (e) {}
};

var registerFactory = function(name, content) {
    try {
        if (name.endsWith('Factory')) {
            if (!name.startsWith('$')) {
                this.content.push({
                    'key': name,
                    'value': content
                });
            } else {
                throw new Error("Factory: " + name + " should not begin with \'$\'");
            }
        } else {
            throw new Error("Factory: " + name + " does not end with \'Factory\'");
        }
    } catch (e) {}
};

var registerHandler = function(method, pathName, funChain, template) {
    try {
        if (method == 'POST' || method == 'GET') {
            var t = {};
            t['pathName'] = method + pathName;
            t['funChain'] = funChain;
            t['template'] = method + '_template';
            t[method + '_template'] = template;
            this.content.push(t);
        } else
            throw new Error('Handler method not GET or POST. Remember use capital letter :)\n');
    } catch (e) {}
};


var module = function(mname) {
    this.factory = {};
    this.factory.content = [];
    this.factory.register = registerFactory;

    this.provider = {};
    this.provider.content = [];
    this.provider.register = registerProvider;

    this.handler = {};
    this.handler.content = [];
    this.handler.register = registerHandler;

};


var Export = function(m) {
    exports.module = m;
};

///////////////////////////////////////////get modules///////////////////////////////

var requi = require('requi');

var allModules = function(p) {
    return requi(p, {
        recursive: true
    });
};

var modulesToService = function(modules) {
    var cM = null,
        thisModule = null,
        serviceSet = {};
    serviceSet['factory'] = {};
    serviceSet['provider'] = {};
    serviceSet['handler'] = [];

    for (var mn in modules) {
        cM = modules[mn];
        if (cM.hasOwnProperty('module')) {
            thisModule = cM['module'];
            incorperate(serviceSet.factory, thisModule.factory.content, 'factory');
            incorperate(serviceSet.provider, thisModule.provider.content, 'provider');
            serviceSet.handler = serviceSet.handler.concat(thisModule.handler.content);
        }
    }
    return serviceSet;
};
//////////////////server function utility/////////////////


var incorperate = function(obj, arr, forWhat) {
    for (var i = 0; i < arr.length; i++) {
        item = arr[i];
        obj[item.key] = item.value;
    }
};

var translate = function(system, arr) {
    var result = [];
    for (var i = 1; i < arr.length; i++) {
        var argName = arr[i];
        if (argName.startsWith('$')) {
            result.push(system.provider[argName]);
        } else {
            result.push(system.factory[argName]);
        }
    }
    return result;
};


//////////use swig as the template engine

var defaultOptions = {
    PORT: 8080,
    PATH: "."
};

var server = function(options) {
    options = options || defaultOptions;
    var modules = allModules(options.PATH),
        services = modulesToService(modules);

    var module = {},
        factory = services.factory,
        provider = services.provider,
        templateHash = {},
        handler = {},
        functionToArguments = {};
    module.factory = factory;
    module.templateHash = templateHash;
    module.provider = provider;
    module.handler = handler;
    module.functionToArguments = functionToArguments;

    for (var i = 0; i < services.handler.length; i++) {
        var elm = services.handler[i];
        handler[elm.pathName] = elm.funChain;
        templateHash[elm.template] = elm[elm.template];
        injectChain(elm.funChain, module);
    }

    //////////////////////////////////////////////////////////////////////////////////
    var router = function(request, response) {
        var pathname = request.method + url.parse(request.url).pathname;
        var funChain = handler[pathName];
        if (funChain == undefine) {
            //404 respond
        } else {

            var Scope = {};
            //////////////////////function chain call


            //////////////////////write to respone, using the Scope.JSON
            response;
        }
    };


    //////////////////////////////////////////////////////////////////////////////////
    this.Run = function() {
        http.createServer(router).listen(options.PORT);
        console.log('Server has started.\n');
    };
};


var injectChain = function(funChain, system) {
    var result = [];
    for (var i = 0; i < funChain.length; i++)
        inject(funChain[i], system);
};

var inject = function(fun, system) { //just inject the function info into the system
    var arg = getArguments(fun);
    system.functionToArguments[fun] = translate(system, arg.array); //should be a list
};





//如何feed 静态文件 - > 如何feed 动态文件