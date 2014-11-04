exports.builtInService = builtInService;
exports.merge = merge;
var builtIn = require('../service/buildIn.js');

var builtInService = function(options) {
    var provider = {};
    provider['$render'] = builtIn.renderer;
    provider['$errorHandle'] = builtIn.errorHandle;
    provider['$final'] = builtIn.final;
    return provider;
};

function merge(service, allService) {
    for (v in allServices) {
        service[v] = allService[v];
    }
    return service;
};