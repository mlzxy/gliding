exports.Export = Export;
exports.Module = module;


var registerProvider = function(name, content) {
    try {
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
    } catch (e) {}
};

var registerFactory = function(name, content) {
    try {
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
    } catch (e) {}
};

var registerHandler = function(method, pathName, funChain, template) {
    try {
        if (method == 'POST' || method == 'GET')
            this.content.push({
                'pathName': method + pathName,
                'funChain': funChain
            });
        else
            throw new Error('Handler method not GET or POST. Remember use capital letter :)\n');
    } catch (e) {}
};


var module = function(mname) {
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


var Export = function(m) {
    exports.module = m;
};