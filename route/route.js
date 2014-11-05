/*!
 * gliding
 * Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn
 * MIT Licensed
 */

var route = require('router');
var walk = require('walk'); // for file serving
var getArg = require('../util/getArg.js');
var mime = require('mime');


var myRoute = function(options) {
    var rou = router();
    var simple_server = function(request, response) {
        var pathname = url.parse(request.url).pathname;
        var realPath = options.PUBLIC + pathname;
        path.exists(realPath, function(exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                response.write("This request URL " + pathname + " was not found on this server.");
                response.end();
            } else {
                var contentType = mime.lookup(realPath);
                fs.readFile(realPath, "binary", function(err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': contentType
                        });
                        response.end(err);
                    } else {
                        response.writeHead(200, {
                            'Content-Type': contentType
                        });
                        response.write(file, "binary");
                        response.end();
                    }
                });

            }
        });
    };

    rou.get(options.STATIC_SERVER || simple_server);
    return rou;
};

var coreRoute = function(system) {
    var routeHandler = {}; // all functions in the routeHandler must accept request and response

    for (v in system.handler)
        routeHandler[v] = getRouteHandler(system.handler[v], system.handlerOptions[v], system.service);

    return routeHandler;
};




var getRouteHandler = function(funChain, options, service) {
    var f2arg = {};
    for (f in funChain) {
        f2arg[f] = getArg.getArguments(f).slice(1);
    }

    return function(request, response) { //use bind

        var funQueue = [];
        copyArray(funQueue, funChain);
        var argQueue = [];
        argQueue.stage = undefined;

        ////////////////////////////now the two queue are ready
        var $scope = {};
        $scope.HTTP = {};
        $scope.HTTP.Request = request;
        $scope.HTTP.Response = response;
        $scope.PARAMS = request.params;
        var realArgList = [$scope];

        function final() {

            response.writeHead($scope.HTTP.status, $scope.HTTP.Head);
            if ($scope.HTML != undefined) {
                response.write(service['$template'].render($scope.HTML, $scope.JSON));
                response.end();
            } else if ($scope.TMPL != undefined) {
                response.write(service['$render'].render($scope.TMPL, $scope.JSON));
                response.end();
            } else {
                response.write($scope.JSON);
                response.end();
            }
        }

        function fun2arg() {
            var f = dequeue(funQueue);
            copyArray(argQueue, f2arg[f]);
            argQueue.stage = f;
        }

        function fall(sv) { ////     this.callback = function(data, options, funChain)
            if (sv != undefined) // so you must pass a defined object when use it
                realArgList.push(sv);
            if (argQueue.length == 0) {
                if (argQueue.stage == undefined) { //be the first time
                    fun2arg();
                    fall();
                } else {
                    if (funQueue.length == 0) { // also could be the end
                        argQueue.stage.apply(this, realArgList); //call the last function in the chain and do the final procedure
                        ///////////////////////////FINAL PROCEDURE//////////////////////////
                        final();
                    } else {
                        // get another fun from funChain, could terminated by null return. Also push $scope, and if this function has no argument, if not , then call directly
                        var retureValue = argQueue.stage.apply(this, realArgList);
                        if (retureValue != false) {
                            realArgList = [$scope];
                            fun2arg();
                            fall();
                        } else { // end soon
                            final();
                        }
                    }
                }

            } else {
                // callback and get another arg from argQueue, if this arg don't have callback, then it is an utility ,push it into the realArglist
                var nowArg = dequeue(argQueue),
                    nowService = service[nowArg];

                if (hasCallback(nowService)) {
                    nowService.callback($scope, options, fall);
                } else {
                    realArgList.push(nowService);
                    fall();
                }
            }
        }

        try {
            // 1 2 3!! jump!
            fall();
        } catch (e) {}
    };
};


//////////////////////utility//////////////////////
function dequeue(a) {
    var x = a[0];
    a.shift();
    return x;
}


function enqueue(a, elm) {
    a.push(elm);
}

function hasCallback(a) {
    return a.hasOwnProperty('callback');
}

function copyArray(a, o) {
    for (var v in o) a[v] = o[v];
}

// completely no inherite, and pass scope, options into the callback, so it could do a lot of things.

//handler => {"path": [f1,f2,f3]};
//service => {"$service": obj}
//handlerOptions => {"path": options}
exports.Router = myRoute;
exports.coreRoute = coreRoute;