/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var gliding = require('../../index.js');

var md = new gliding.Module();

md.provider.register('$happy', function($scope) {
    console.log("Happy!!\n");
});

/*jshint multistr: true */
md.provider.register('$final', function($scope, naiveFactory, $happy) {
    console.log("I am the $final component, if I m not undefind, I would be executed at the end of each handlers chain,\
                even the chain return false in the middle.");
    console.log('naiveFactory again, get a number from this mock database: ' + naiveFactory.getNumber());
    $happy();
});


exports.myModule = md;