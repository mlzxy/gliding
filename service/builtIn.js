/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
exports.renderer = render;
exports.errorHandle = simple_ErrorHandle;
exports.final = undefined;
var walk = require('walk');
var template = require('swig');

var simple_ErrorHandle = function() {
    this.printError = function(e) {
        console.log(e);
    };
};
///////////////////////////////////////////////////////////////////////////////////////
var render = function() {
    if (!options.PUBLIC.endsWith('/')) {
        options.PUBLIC = options.PUBLIC.concat('/');
    }
    var len = options.PUBLIC.length;
    var templateHash = {};

    var myTemplate = options.TEMPLATE_ENGINE || template;

    walk_options = {
        listeners: {
            file: function(root, stat, next) {
                if (stat.name.endsWith(options.TMPL_EXTENSION)) {
                    var filename = root + stat.name,
                        data = fs.readFileSync(filename, options.TMPL_ENCODE);
                    templateHash[filename.slice(len)] = data;
                }
                next();
            }
        }
    };

    walk.walkSync(options.PUBLIC, walk_options);



    return function() {
        this.render = function(name, json) {
            return myTemplate.render(templateHash[name], json);
        };
    };
}();