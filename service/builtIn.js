/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var walk = require('walk');
var template = require('swig');
var fs = require('fs');
var simple_ErrorHandle = function() {
    this.printError = function(e) {
        console.log(e);
    };
};
///////////////////////////////////////////////////////////////////////////////////////
var renderer = function(options) {
    var len = options.PUBLIC.length;
    var templateHash = {};


    template = options.TEMPLATE_ENGINE || template;
    var myTemplate = template;

    var walk_options = {
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



    return new function() {
        this.render = function(name, json) {
            return myTemplate.render(templateHash[name], json);
        };
    }();
};

exports.renderer = renderer;
exports.errorHandle = simple_ErrorHandle;
exports.final = undefined;
exports.template = template;