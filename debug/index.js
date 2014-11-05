var gliding = require('../index.js');

var options = {};


options.PATH = __dirname;
options.MODULES = [
    '/modules/provider.js',
    '/modules/factory.js',
    '/modules/handler.js'
];


options.PUBLIC = '/public/';

var myServer = gliding.Server(options);
myServer.Run();