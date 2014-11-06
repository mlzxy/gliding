/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var gliding = require('../../index.js');
var formidable = require('formidable');
var md = new gliding.Module();


var form = new formidable.IncomingForm();

var f = {
    callback: function(data, options, fun) { //must have interface
        form.parse(data.HTTP.Request, function(err, fields, files) {
            fun({
                'fields': fields,
                'files': files
            });
        });
    }
};

md.provider.register('$form', f);




exports.myModule = md;