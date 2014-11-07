# A more detailed example
Here is a example shows how to use inject a `$form` service to the framework, and then use it:

## In the index.js
```js
var gliding = require('gliding');
var myServer = new gliding.Server(options); // need to set options, so to find the components that would get injected into the server, also change Port or something like that
myServer.Run(); 
```
## In the provider.js
```js
var gliding = require('gliding');
var md = new gliding.Module(); 
var form = new formidable.IncomingForm();
var f = {
    callback: function(data, options, fun) { //must have interface
        form.parse(data.HTTP.Request, function(err, fields, files) {
             fun({'fields': fields, 'files': files });
        });
    }
};
md.provider.register('$form', f); // inject the service
```

## In the handler.js
```js
var f6 = function($scope, $form) { //use the service here, and no callback anymore
    $scope.HTML = JSON.stringify($form); //$form = {fields:stuff, files:stuff}
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
md.handler.register("GET", "/form", [f7,]); 
md.handler.register("POST", "/upload", [f6,]);
exports.myModule = md;
```


## result
![](./img/form.png)
after upload a file, print the json on the page.
![](./img/form2.png)



# More example

In the [example](https://github.com/BenBBear/gliding/tree/master/example) fold that you find __all usages__.

