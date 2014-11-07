# Documentation
<br>
<br>
<br>
# Options 
`var server = new gliding.Server(options)` <- here

The options have these following attributes that could be configured.

### STATIC_SERVER

__Gliding__ has its own static file server, but it's very simple, just for development and debug, in the [__route.js__](https://github.com/BenBBear/gliding/blob/master/route/route.js). But you could easily change the file server implementation, just change `options.STATIC_SERVER` to what you like it to be(should be a `function(req,res){stuff;}`). Or make gliding works behind nginx, also good choice.


### TEMPLATE_ENGINE

By default, it uses [__swig__](http://paularmstrong.github.io/swig/), as its templating engine, but you could also change it, only to make sure that it support two function like __swig__:
```js
swig.render(string,json); //result
var tpl = swig.compileFile('filename');
tpl(json); //result
```

### MODULES

`options.MODULES` tell __gliding__ what modules that it need to import and get providers, handlers, factories, support filename, regex, Modules, but it's based on `options.PATH`, example in your index.js:

```js
options.PATH = __dirname; // '~/workspace/web/src'
options.MODULES = [
    /modules\/provider.+/, //use regex, match all inside options.PATH recursively, and avoid hidden file 
    'modules/factory.js', // common file '~/workspace/web/src/modules/factory.js'
    'xee|m'  //  add |m in the end tell gliding that xee is a module.
];
```



### other

- __PATH__: as above

- __PUBLIC__: the public directory, where you put .tmpl files, js, css, images and so on.

- __PORT__: the port where gliding are running.

- __TMP\_EXTENSION__: the files that being saw as templates, default is `['.tmpl','.html']`


<br>
<br>
<br>
# Module()
`var md = new gliding.Module();` <- here

The file that use `Module()` should be included by gliding accroding to `options.MODULES`. After we get a new Module, we could use 
```js
md.factory.register()
md.provider.register()
md.hander.register()
```
After inject our components, we must export it with the name `myModule`, as `exports.myModule = md;`
<br>
<br>
<br>
# provider & factory
`md.provider.register('$form', f);` <- here
`md.factory.register('dbfactory',obj)` <- here

In fact, provider and factory are treated exact the same internally in the gliding. I seperate them because I think this may be better for a clean and unified code style. Rules that throw exception otherwise:
- provider must start with `$` and not end with `Factory`
- factory must end with `Factory` and not start with `$`
- factory must be an `object`
### general interface from provider & factory: this.callback

- provider or factory may or may not have an attribute __callback__
- if not, here is how gliding treat them(see more in [__How it works__](https://github.com/BenBBear/gliding#how-it-works)):
```js
  argList.push(nowService); 
```
the argument in the handler would be exact the same with what you inject.

- if it has attribute callback, it must be in this format
```js
    callback: function(data, options, fall) { //must have three, and only three arguments
        IO_op(data, function(x) {
             fall(x);
        });
    }
```
the data is `$scope` which you could change at will inside handlers, for the options you could specify in the `handler.register`. Though there is only one callback, base on options and data, you could choose different function to call internally, for example, `databasequery`,`databasedelete` kind of things, but anyway, `fall(x)` must have inside, you could literally define a function

```js
var f = function(x,y){
 fall({x:x,y:y});
}
```
and 
```js
switch(data.cmd || options.cmd){
case 'query':  query(data.user,f);break;
case 'insert':  insert(data.user,f);break;
default:  nothing(data.user,f);
}
```

<br>
<br>
<br>
## Default Services

### $scope
You store all you data inside $scope and share them accross handlers and services. It has some special attributes

- HTTP:
 - HTTP.Request & HTTP.Response: no need to explain
 - HTTP.status & HTTP.Head: the http head that would return in this connection, default are `200`, `'text/html'`;,you could change it before the end of your handler chain.

- HTML: 
 the string that contain html content, get rendered by `$template.render($scope.HTML,$scope.JSON)`

- TMPL:
the file that you want to render, `$render.render($scope.TMPL, $scope.JSON)`, if TMPL and HTML both set, HTML is rendered, if both not set, then just write the `$scope.JSON` into response. And it relies on `options.PATH`, if the file is `/public/index.tmpl`, `PATH = /public`, then TMPL should be `index.tmpl`.

- JSON: 
no need to explain.



### $final

`$final` though is a provider, is a special handler by default is `undefined`, if defined, would get called at the end of your handler chain even you chain stop in the middle, follow the same rule with handlers.

### $errorHandle
Super Simple function, just an remind of that you could inject errorhandler as provider.
```js
function() {
    this.printError = function(e) {
        console.log(e);
    };
};
```

### $render
The File renderer of __gliding__, has one method: `this.render($scope.TMPL,$scope.JSON)`.

### $template

Direct access with the template engine, default is __swig__


The [$render](#$render) and [$template](#$template)  not be used in the handlers usually, the gliding will automatically render data and write stream, you only need to set $scope.

# handler
`md.handler.register("GET", "/form", [f7,], options);` <- here
- The first arguments are method, support: put,get,post,head,options,delete and also all to match all. (just as the [router](https://github.com/gett/router) did.)
- the second argument is path
- the third argument is a array of function, they are executed in order and share data on $scope like
```
function f1($scope, $service){
  $scope.x = 1;
}
function f2($scope, $service){
  console.log($scope.x);
}
```
- __IMPORTANT:__ all handler function must have one argument, and the first argument must be $scope!
- the fourth argument is optional, the options would pass to all the services' callback, so in this way control the behavior of the service.

## Dependency 

__Gliding__ use packages:

- "cli-color": for printing
- "formidable": in the example code
- "mime": for the static server
- "router": for routing
- "swig": for templating
- "walk": for easy read file.

<br>
<br>
<br>
# Limitation

Since there are too many, I only list these here, __TO BE CONTINUE__

- When import modules, hidden File detection only Support: 
 - .file
 - file\~

- static file server too simple, access disk every time.

<br>
<br>
<br>
# Example

See [__Example__](https://github.com/BenBBear/gliding/blob/master/doc/example.md)


