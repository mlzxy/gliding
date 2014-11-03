exports.builtInService = builtInService;
exports.buildDep = buildDep;


var builtIn = require('../service/buildIn.js');


var builtInService = function(factory, provider, options) {
    provider['$db'] = builtIn.db;
    provider['$template'] = builtIn.template;
    provider['$static'] = builtIn.static;
    provider['$scope'] = builtIn.scope;
    provider['$http'] = builtIn.http;
};




function buildDep(factory, provider, userFactory, userProvider, serviceToJSON) {
    //todo Build JSON for each service
};