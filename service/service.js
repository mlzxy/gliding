/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var builtIn = require('../service/builtIn.js');

var builtInService = function(options) {
    var provider = {};
    provider['$render'] = builtIn.renderer(options);
    provider['$template'] = builtIn.template;
    provider['$errorHandle'] = builtIn.errorHandle;
    provider['$final'] = builtIn.final;
    provider['$form'] = builtIn.form;
    provider['$cookie'] = builtIn.cookie;
    return provider;
};

function merge(service, allService) {
    for (v in allService) {
        service[v] = allService[v];
    }
    return service;
};

exports.builtInService = builtInService;
exports.merge = merge;