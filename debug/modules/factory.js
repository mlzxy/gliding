var gliding = require('../../index.js');

var md = new gliding.Module();

var naiveFactory = function() {

    function double(x) {
        return 2 * x;
    };

    function mySetTimeout(x, y) {
        setTimeout(x, y);
    }

    this.callback = function(data, options, fun) { //must have interface

        var next = function() {
            var x = {};
            x.getNumber = function() {
                return 1;
            };
            fun(x);
        };

        switch (options.choose) {
            case 'a':
                setTimeout(next, data.timeoutLength);
                break;
            default:
                mySetTimeout(next, data.timeoutLength);
        }
    };
};


md.factory.register('naiveFactory', naiveFactory());


exports.myModule = md;