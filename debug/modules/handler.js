var gliding = require('../../index.js');

var md = new gliding.Module();


var f1 = function($scope, naiveFactory) {
    console.log('In the naiveFactory: \n');
    $scope.x = naiveFactory.getNumber();
    console.log('naiveFactory.getNumber()!');
};

var f2 = function($scope, $happy) {
    $happy();
    console.log($scope.x);
    $scope.HTML = "It Works!!";
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




md.handler.register("GET", "/1", [f1, f2, f3], {
    'choose': 'a'
});

md.handler.register("GET", "/2", [f4]);





exports.myModule = md;