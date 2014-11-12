<!-- gliding -->
<!-- Copyright(c) 2014 Xinyu Zhang bevis@mail.ustc.edu.cn -->
<!-- MIT Licensed -->

# Gliding

# Overview
Gliding is a web framework on nodejs, minimal (only 400 or more lines of code) and modular, extremely easy to be extended. 


This is __the first javascript program__ I write, I just start to learn javescript and nodejs, and want to try it on the server side programming. But soon I found the [__callback hell problem__](http://callbackhell.com/) is really annoying, making your code more and more unreadable as you code along. 

<br>

>However, since you use nodejs, you could not escape that, that's the beautiful way that node deal with async IO, only with callback and event we need not to worry about those complex lock and sync, while in the same time making cpu and io working more parallel and gain more efficiency.

<br>
So after thinking quite a long time, I come up with a simple idea to try to make lives a little bit easier.

Also I have some tastes on [angularjs](https://github.com/angular), so I want it to look like it.




<br>
<br>
<br>
# Usage 

## Update news

- Now provide easy "api" for `$form` and `$cookie`, also fix bug on `$scope.JSON` in this version.

- Also fix bugs in [route.js](https://github.com/BenBBear/gliding/blob/master/route/route.js), you don't necessarily have attribute `callback` on the __factory__ and __provider__ that register to use those non-blocking functions. This way will do fine, in the handler:

```js
function($scope,$render ,$dbFactory){
$dbFactory.query($scope.username, function(data){
      $scope.HTTP.Response.write($render(filename,json))
      $scope.HTTP.Response.end();
  };
}
```

But because by default the __gliding__ would help you to write the `HTTP.Response` based on the `$scope.JSON` and `$scope.HTML, $scope.TMPL` after the execution of handler chain. So if you use callback function on your own, then `$scope.JSON` must be `undefined` when the handler function return. The following code in [route.js](https://github.com/BenBBear/gliding/blob/master/route/route.js) explains why:
```js
            if ($scope.HTML !== undefined) {
                response.writeHead($scope.HTTP.status, $scope.HTTP.Head);
                response.write(service['$template'].render($scope.HTML, $scope.JSON));
                response.end();
            } else if ($scope.TMPL !== undefined) {
                response.writeHead($scope.HTTP.status, $scope.HTTP.Head);
                response.write(service['$render'].render($scope.TMPL,
                    $scope.JSON
                ));
                response.end();
            } else if ($scope.JSON !== undefined) {
                response.writeHead($scope.HTTP.status, $scope.HTTP.Head);
                response.write(JSON.stringify($scope.JSON));
                response.end();
            }
```


Also, non-blocking functions inside the *handler chain* would mess up the order of execution, so the non-blocking functions must occur in the tail of the __handler chain__. The last thing added, if the `$final` provider is defined when you have non-blocking in the *handler chain*, which will exectue at end of each handler execution chain, its behavior would be restricted because of the execution order.




## Installation

Once you have node and npm installed properly, just use

```shell
npm install gliding
```
to install. __current version: 0.3.2_



## General Process
- register components as provider or factory
- register handler that use components as function arguments (deal with callback internally), and it looks like angularjs 
```js
function($scope, $form, $db, $utility){  // function that registered as handlers
//use $form.fields, $db.user, $utility(x,y,z) 
}
```
- Run


## A overly simple example

### In the index.js
```js
var gliding = require('gliding');
var myServer = new gliding.Server(options);
myServer.Run(); 
```

### In the other.js
```js
var gliding = require('gliding');
var md = new gliding.Module(); 
md.provider.register('$fun', foo);
md.factory.register('dbFactory',obj);
md.handler.register('GET','/',[ function($scope,$fun,$form,$cookie,dbFactory){
}]);
exports.myModule = md;
```

### Run
run `node index.js` in the shell, then it's running in the `localhost:8080`.


<br>
<br>
<br>

# Documentation

How to use in details, please see [__Documentation__](https://github.com/BenBBear/gliding/blob/master/doc/Documentation.md).


Example could be found in [__Example__](https://github.com/BenBBear/gliding/blob/master/doc/example.md)

<br>
<br>
<br>

# How it works
## Core Code
It works based a very simple idea. The following is the pseudo-code Process of this framework __(just show the process, not strictly correct)__:

```js
var allModules = collectModules(options.MODULES),
    service = getService(allModules) //provider and factory are treated the same internally
    handler = getHandler(allModules);

route.get(path, procedure(path ,service, handler))

function procedure(path, service, handler){
  var certainFunChain = handler[path],
      argHash = getArgument(certainFunChain).slice(1), //argHash = {fun: ['$form','$factory']} , slice(1) since every function has $scope as the first argument
      arglist = [$scope];,
      funQueue = copy(funChain),
      argQueue = [],
      options = getOptions(path); // get the option of this path
      return function (request,response){  // the actually function passed in route.get
                var $scope = {};
                var $scope.HTTP = {Request:request,Response:response}; //pass data across handlers and services
                var fall = function(service){
                      if (service != undefine)
                          arglist.push(service);
                       if (isEmpty(funQueue))   
                          end();
                       if (isEmpty(argQueue)){  // get all the services
                                 currentFun.apply(this,arglist);
                                 arglist = [$scope]
                                 argQueue = copy(argHash[dequeue(funQueue)]);
                                 fall();
                            } else{
                            var arg = dequeue(argQueue),
                                nowService = service[arg];  //get the service that this string correspond
                                if (hasCallback(sev)){
                                  nowService.callback($scope, options, fall);
                                }else{
                                  argList.push(nowService);
                                  fall();
                                }
                            }                             
                }                               
          //begins 
           fall();
      }
}

```
<br>
## Explain 

- collect modules, and get all handlers and services that registered

- for each path, `procedure` return a route function

- the key part in the route function is the `fall`, ideas are:
  - call service while passing `fall` itself as argument, so control could be obtained back to the `fall`.
  - when completing IO, service call `fall` in the callback, while pass what the result into `fall`, `fall` save it into arglist
  - use closure a lot lot. __(remember you could not change service, or options in the service's callback that you write)__
 
<br>
#### The following is about how we fall:
Once it start to `fall`, it would `fall` into a service that you register which has `callback`, those don't have callback wouldn't be fall into but just:

```js 
  argList.push(nowService); 
  
```

but it would pass fall as argument to the callback, so in the callback, it would be call again, just like the previous example
```js
   form.parse(data.HTTP.Request, function(err, fields, files) {
       fun({'fields': fields, 'files': files });
   });
```
and then, we back to `fall`, save this value to our list
```js
            if (sv !== undefined)
                argList.push(sv);
```
once we `fall` all the services that the arguments of this function correspond to, it would call this function with 
```js
            currentFun.apply(this, argList);
```
and then refill the `argQueue`, dequeue the `funQueue`, and `fall` again
```js
argList = [$scope];
argQueue = copy(argHash[dequeue(funQueue)]);
fall();
```
util the end;
```js
if (isEmpty(funQueue))   
    end();
```

<br>
<br>
<br>
#  Current State

### ready to use?
No, I think, it haven't been tested a lot yet, also it lacks a lot of other features maybe, so still a long way to go.

### development

I am trying to apply to graduate school these days, and I have serveral projects and courses at the same time, so I'm very very busy. So [__gliding__](https://github.com/BenBBear/gliding) wou't be developed so actively like I did at the beginning three days. But I would still work on it, and will have more time on it when my other burning priorities pass.
