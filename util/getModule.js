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


var incorperate = function(obj, arr, forWhat) {
    for (var i = 0; i < arr.length; i++) {
        item = arr[i];
        obj[item.key] = item.value;
    }
};