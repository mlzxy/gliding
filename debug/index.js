/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var gliding = require('../index.js');

var options = {};


options.PATH = __dirname;
options.MODULES = [
    '/modules/provider.js',
    '/modules/factory.js',
    '/modules/handler.js'
];

options.PUBLIC = '/public/';

var myServer = new gliding.Server(options);
myServer.Run();