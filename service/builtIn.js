/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var walk = require('walk');
var template = require('swig');
var fs = require('fs');
var clc = require('cli-color');
var error = clc.red.bold;


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
                if (stat.name.endsWithArray(options.TMPL_EXTENSION)) {
                    var filename = root + stat.name,
                        tpl = template.compileFile(filename);
                    templateHash[filename.slice(len)] = tpl;
                }
                next();
            }
        }
    };

    walk.walkSync(options.PUBLIC, walk_options);



    return {
        render: function(name, json) {
            try {
                return templateHash[name](json);
            } catch (e) {
                console.log(templateHash);
                console.log(options);
                throw new Error(error(e.message + "\n" + "maybe because the file extension of your" +
                    " template files are not specified in the options. The default options.TMPL_EXTENSION = [.tmpl, .html]"));
            }
        }
    };
};

exports.renderer = renderer;
exports.errorHandle = simple_ErrorHandle;
exports.final = undefined;
exports.template = template;