exports.Server = server;

var http = require("http");
var url = require("url");
var service = require('../service/service.js');
var getArg = require('../util/getArg.js');
var getModule = require('../util/getModule.js');
var router = require('router');
var routeGlobal = router();






var defaultOptions = {
    PORT: 8080,
    PATH: ".",
    PUBLIC: "./public"
};

var server = function(options) {
    this.options = options || defaultOptions;
    var modules = getModule.allModules(options.PATH),
        services = getModule.modulesToService(modules);

    var factory = {},
        provider = {},
        handler = {},
        functionToArguments = {},
        serviceToJSON = {};


    builtInService(factory, provider, options);
    buildDep(factory, provider, services.factory, services.provider, serviceToJSON);
    this.serviceToJSON = serviceToJSON;
    this.factory = factory;
    this.provider = provider;


    this.handler = handler;
    this.functionToArguments = functionToArguments;
    for (var i = 0; i < services.handler.length; i++) {
        var elm = services.handler[i];
        handler[elm.pathName] = elm.funChain;
        getArg.getArgFunChain(elm.funChain, this); //map the function name to the arg List
    }


    for (v in handler) {
        if (v.startsWith('POST')) {
            routeGlobal.post(v.slice(4), routeCallBack);
        } else {
            routeGlobal.get(v.slice(3), routeCallBack);
        }
    }

    this.Run = function() {
        http.createServer(routeGlobal).listen(this.options.PORT);
        console.log('Server has started.\n');
    };
};





var routeCallBack = function(request, response) {
    //todo
};