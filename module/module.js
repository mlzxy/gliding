/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */

var util = require('../util/util.js');

var registerProvider = function(name, content) {
    if (name.startsWith('$')) {
        if (!name.endsWith('Factory')) {
            this.content.push({
                'key': name,
                'value': content
            });
        } else {
            throw new Error("Provider: " + name + " should not end with \'Factory\'");
        }
    } else {
        throw new Error("Provider: " + name + " does not begin with \'$\'");
    }

};

var registerFactory = function(name, content) {

    if (!util.isObject(content))
        throw new Error("Factory: " + name + " is not a object!\n" + name + "is a type of " + typeof content);
    if (name.endsWith('Factory')) {
        if (!name.startsWith('$')) {
            this.content.push({
                'key': name,
                'value': content
            });
        } else {
            throw new Error("Factory: " + name + " should not begin with \'$\'");
        }
    } else {
        throw new Error("Factory: " + name + " does not end with \'Factory\'");
    }
};

var registerHandler = function(method, pathName, funChain, options) {

    for (var v = 0; v < funChain.length; v++) {
        if (!util.isFunction(funChain[v]))
            throw new Error("Handler: " + pathName + "\n" + "Method:" + method + "\n There are non-functions in the function array!\n");
    }
    method = method.toUpperCase();

    if (method == 'POST' || method == 'GET')
        this.content.push({
            'pathName': method.slice(0, 3) + pathName,
            'funChain': funChain,
            'options': options
        });
    else
        throw new Error('Handler method not GET or POST, currently only GET and POST methods are supported. Also remember use capital letter :)\n');

};


var myModule = function() {
    this.factory = {};
    this.factory.content = [];
    this.factory.register = registerFactory;

    this.provider = {};
    this.provider.content = [];
    this.provider.register = registerProvider;

    this.handler = {};
    this.handler.content = [];
    this.handler.register = registerHandler;

};



exports.Module = myModule;