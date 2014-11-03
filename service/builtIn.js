exports.db = db;
exports.template = template;
exports.scope = scopeMaker;
exports.http = httpMaker;
exports.static = staticMaker;



var db = {};

var template = require('swig');

var scopeMaker = function() {
    return {};
};

var httpMaker = function(request, response) { //this one is special, built in.
    this.Request = request;
    this.writeHead = function(o) {
        response.writeHead(o);
    };
    this.buffer = [];
    this.write = function(thing) {
        this.buffer.push(thing);
    };
    this.flush = function() {
        for (var i = 0; i < this.buffer.length; i++)
            response.write(this.buffer[i]);
        this.buffer = [];
    };
};

var staticMaker = function(options) {
    //TODO solve static file serving problem mainly in here
};

//work flow, finish coding
//debuging
//write package JSON+license
// commit to github
//