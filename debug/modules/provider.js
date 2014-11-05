var gliding = require('../../index.js');

var md = new gliding.Module();

md.provider.register('$happy', function($scope) {
    console.log("Happy!!\n");
});

// md.provider.register('$final');  actually the $final is a handler function, should not be an object


exports.myModule = md;