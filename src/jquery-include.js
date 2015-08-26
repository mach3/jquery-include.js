!function($){

	$.include = {

		EVENT_READY: "includeready",

		doc: $(document),
		_ready: false,

		init: function(){
			var my, items, count;

			my = this;
			items = $("[data-include]");
			count = items.length;
			items.each(function(){
				my.include(this).done(function(){
					if(! --count){
						my._ready = true;
						my.doc.trigger(my.EVENT_READY);
					}
				});
			});
		},

		ready: function(callback){
			if(this._ready){
				return callback();
			}
			this.doc.on(this.EVENT_READY, callback);
		},

		findFunction: function(path){
			var obj = window;
			if(! path){
				return null;
			}
			$.each(path.split("."), function(i, name){
				if(! (name in obj)){
					obj = null;
					return false;
				}
				obj = obj[name];
			});
			return $.isFunction(obj) ? obj : null;
		},

		include: function(el){
			var my, vars;

			el = $(el);
			my = this;

			vars = el.data();
			vars.el = el;
			vars.replace = (vars.includeReplace === "") ? true : vars.includeReplace;
			vars.render = this.findFunction(vars.includeRender);
			vars.ready = this.findFunction(vars.includeReady);
			vars.dfd = $.Deferred();

			try {
				vars.node = $(vars.include);
				if(! vars.node.length){ throw new Error(); }
				this.render(vars.node.html(), vars);
			} catch(e){
				$.ajax({url: vars.include})
				.done(function(html){
					my.render(html, vars);
				});
			}

			return vars.dfd.promise();
		},

		process: function(content, vars){
			var df = $.Deferred();
			content = vars.render ? vars.render(content) : content;
			if(content){
				if($.isFunction(content.done)){
					content.done(function(data){
						df.resolve(data);
					});
				} else {
					df.resolve(content);
				}
			}
			return df.promise();
		},

		render: function(content, vars){
			this.process(content, vars).done(function(data){
				var node;
				if(vars.replace){
					node = $("<div>").append(data).children().insertBefore(vars.el);
					vars.el.remove();
				} else {
					node = vars.el.append(data);
				}
				vars.ready && vars.ready(node);
				vars.dfd.resolve();
			});
		}
	};

	$(function(){
		$.include.init();
	});

}(jQuery);
