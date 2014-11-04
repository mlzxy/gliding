exports.Server = server;


var util = require('../util/util.js');


var service = require('../service/service.js');
var getModule = require('../util/getModule.js');


var route = require('../route/route.js');





var defaultOptions = {
    PORT: 8080,
    PATH: ".",
    PUBLIC: "./public",
    TMPL_EXTENSION: ".tmpl",
    TMPL_ENCODE: "utf8",
    TEMPLATE_ENGINE: undefined,
    STATIC_SERVER: undefined
};



var server = function(options) {
    this.options = util.mergeOptions(options, defaultOptions);
    var modules = getModule.allModules(options.PATH),
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

    this.routeHandler = route.coreRoute(this); // map the url path to the real handlefunction
    for (v in this.handler) {
        if (v.startsWith('POST')) {
            Router.post(v.slice(4), this.routeHandler[v]);
        } else {
            Router.get(v.slice(3), this.routeHandler[v]);
        }
    }

    this.Run = function() {
        http.createServer(Router).listen(this.options.PORT);
        console.log('Server has started.\n');
    };
};