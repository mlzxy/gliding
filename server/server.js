/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var util = require('../util/util.js');
var service = require('../service/service.js');
var getModule = require('../util/getModule.js');
var route = require('../route/route.js');
var http = require('http');

var defaultOptions = {
    PORT: 8080,
    PATH: undefined,
    MODULES: [],
    PUBLIC: "./public",
    TMPL_EXTENSION: [".tmpl", ".html"],
    TEMPLATE_ENGINE: undefined,
    STATIC_SERVER: undefined
};



var server = function(options) {
    debugger;
    this.options = util.mergeOptions(options, defaultOptions);
    var modules = getModule.allModules(options),
        all = getModule.modulesToService(modules);


    this.handler = {};
    this.handlerOptions = {};
    this.service = {};


    this.service = service.builtInService(options);
    this.service = service.merge(this.service, all.service);



    /////////////////////////////////////////////////////////////
    for (var i = 0; i < all.handler.length; i++) {
        var elm = all.handler[i];
        this.handler[elm.pathName] = elm.funChain;
        this.handlerOptions[elm.pathName] = elm.options;
    };
    /////////////////////////////////////////////////////////
    var Router = route.Router(this.options);

    this.routeHandler = route.coreRoute(this);
    for (var v in this.handler) {
        var p = v.slice(3);
        switch (v.slice(0, 3)) {
            case "POS": //post
                Router.post(p, this.routeHandler[v]);
                break;
            case "GET":
                Router.get(p, this.routeHandler[v]);
                break;
            case "PUT":
                Router.put(p, this.routeHandler[v]);
                break;
            case "HEA": //head
                Router.head(p, this.routeHandler[v]);
                break;
            case "DEL":
                Router.del(p, this.routeHandler[v]);
                break;
            case "OPT": //options
                Router.options(p, this.routeHandler[v]);
                break;
            case "ALL":
                Router.all(p, this.routeHandler[v]);
                break;
            default:
        }
    }

    this.Run = function() {
        http.createServer(Router).listen(this.options.PORT);
        console.log('Server has started.');
        console.log('Runing at localhost:' + this.options.PORT);
    };
};

exports.Server = server;