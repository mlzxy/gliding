var gliding = require('../../index.js');

var md = new gliding.Module();

debugger;
md.provider.register('$happy', function() {
    console.log("Happy!!\n");
});


exports.myModule = md;