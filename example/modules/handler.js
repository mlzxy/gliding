/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */
var gliding = require('../../index.js');

var md = new gliding.Module();


var f0 = function($scope) {
    $scope.timeoutLength = 100;
};


var f1 = function($scope, naiveFactory) {
    $scope.HTML = 'In the naiveFactory: \n';
    $scope.x = naiveFactory.getNumber();
    $scope.HTML += 'naiveFactory.getNumber()!';
};

var f2 = function($scope, $happy) {
    $scope.HTML += $scope.x;
    $happy();
    $scope.HTML += "\nIt Works!!\n";
    return false;
};

var f3 = function($scope) {
    console.log('never reach here');
};



var f4 = function($scope) {
    $scope.TMPL = "index.tmpl";
    $scope.JSON = {
        name: 'Xinyu Zhang'
    };
};



var f5 = function($scope) {
    $scope.HTML = JSON.stringify($scope.PARAMS);
    return false;
};


var f6 = function($scope, $form) {
    $scope.HTML = JSON.stringify($form);
};
var f7 = function($scope) {
    $scope.HTML = '<html> <title>test form</title> <body>' +
        '<form action="/upload" enctype="multipart/form-data" method="post">' +
        '<input type="text" name="title"><br>' +
        '<input type="file" name="upload" multiple="multiple"><br>' +
        '<input type="submit" value="Upload">' +
        '</form>' +
        '</body></html>';
};



md.handler.register("GET", "/1", [f0, f1, f2, f3], {
    'choose': 'a'
}); //ok

md.handler.register("GET", "/2", [f4]); //ok
md.handler.register("GET", "/{base}/{foo}", [f5, f2]); //ok
md.handler.register("GET", "/form", [f7]); //ok
md.handler.register("POST", "/upload", [f6]); //ok


exports.myModule = md;