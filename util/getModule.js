exports.allModules = allModules;
exports.modulesToService = modulesToService;

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
    serviceSet['service'] = {};
    serviceSet['handler'] = [];

    for (var mn in modules) {
        cM = modules[mn];
        if (cM.hasOwnProperty('myModule')) {
            thisModule = cM['myModule'];
            incorperate(serviceSet.service, thisModule.factory.content);
            incorperate(serviceSet.service, thisModule.provider.content);
            serviceSet.handler = serviceSet.handler.concat(thisModule.handler.content);
        }
    }
    return serviceSet;
};


var incorperate = function(obj, arr) {
    for (var i = 0; i < arr.length; i++) {
        item = arr[i];
        obj[item.key] = item.value;
    }
};