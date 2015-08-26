
# jquery-include.js

Simple module library. This let you easily to include remote file (or local template) to web page.

## Usage

### Include remote file

```html
<!-- Include remote file -->
<div data-include="the/path/to/file.html"></div>

<!-- Include remote file with render func -->
<div data-include="the/path/to/foo.html" data-include-render="widgets.foo"></div>
```

### Include local template

```html
<!-- Include local template -->
<div data-include="#my-template"></div>

<script type="text/template" id="my-template"> ... </script>
```


### Render function

Specify the rende function's name at `data-include-render` to process template by javascript.
Render functions should be referable from `window` object.

The functions are to receive content string, then return proccessed string or deferred object
(in case you want to process asynchronously).


```javascript
var widgets = widgets || {};

// Let render function to return content as string
widgets.foo = function(template){
	template.replace("{{name}}", "John");
	return template;
};

// or deferred object (async)
widgets.bar = function(template){
	var df = $.Deferred();
	$.getJSON("/api/bar").done(function(data){
		template = template.replace("{{name}}", data.name);
		// Pass content string to `resolve()`
		df.resolve(template);
	});
	return df.promise();
};
```


### Ready function

To do something when the widget are processed and included,
specify the function at `data-include-ready` attribute.

The ready functions recieve the jquery-object of widget as an argument.

```html
<div data-include="#foo" data-include-ready="widgetsReady.foo"></div>

<script>
	var widgetsReady = widgetsReady || {};

	widgetsReady.foo = function(node){
		node.fadeIn();
	};
</script>
```


### Callback for all ready

Use `$.include.ready()` to do something when all widgets are processed and included.

```javascript
$.include.ready(function(){
	$("[data-include]").fadeIn();
});
```


### Replace option

As default, this library appends content to the element.
Use `data-include-replace` attribute to replace the element with the content.

```html
<div data-include="#foo" data-include-replace="true"></div>
```

