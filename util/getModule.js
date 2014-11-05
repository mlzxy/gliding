/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */




var allModules = function(pathArray) {
    var result = [];
    for (var i = 0; i < pathArray.length; i++)
        result.push(require(pathArray[i]));
    return result;
};

var modulesToService = function(modules) {
    var cM = null,
        thisModule = null,
        serviceSet = {};
    serviceSet['service'] = {};
    serviceSet['handler'] = [];
    debugger;
    for (var mn = 0; mn < modules.length; mn++) {
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

exports.allModules = allModules;
exports.modulesToService = modulesToService;