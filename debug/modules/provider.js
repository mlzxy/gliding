var gliding = require('../../index.js');

var md = new gliding.Module();

debugger;

md.provider.register('$happy', function() {
    console.log("Happy!!\n");
});

md.provider.register('$final', function($scope) {
    console.log($scope);
});


exports.myModule = md;