app.controllers.GlobalController = (function() {
    'use strict';

    function GlobalController(model, view) {
        this.model = {
            [model.name]: model
        };
        this.view = {
            [view.name]: view
        };
    }
    /*
     *
     * A Controller can have as many model as you want/need
     *
     */
    GlobalController.prototype.addModel = function(model) {
        this.model[model.name] = model;
        return this;
    }
    /*
     *
     * A Controller can have as many view as you want/need
     *
     */
    GlobalController.prototype.addView = function(view) {
        this.view[view.name] = view;
        return this;
    }
    /*
     *
     * And so you might need to remove them at some time
     *
     */
    GlobalController.prototype.removeModel = function(model) {
        delete this.model[model.name];
        return this;
    }
    /*
     *
     * And so you might need to remove them at some time
     *
     */
    GlobalController.prototype.removeView = function(view) {
        delete this.view[view.name];
        return this;
    }

    // Remove '_' character for passing several parameters through id event.id
    GlobalController.prototype.fillIds = function(event) {
        if (typeof(event) !== 'undefined') {
            var array = event.split('_');
            var aL = array.length;
            var data = [];
            for (var i = 1; i < aL; i++) {
                data.push(array[i]);
            }
            return data;
        } else {
            return [];
        }
    }

    // Remove '-' character for function's name creation
    GlobalController.prototype.setName = function(event) {
        if (typeof(event) !== 'undefined') {
            var array = event.split('_')[0].split('-');
            var aL = array.length;
            var data = "";
            data += array[0];
            for (var i = 1; i < aL; i++) {
                data += (array[i].charAt(0).toUpperCase() + array[i].substring(1));
            }
            return data;
        } else {
            return "";
        }
    }

    GlobalController.prototype.update = function(event) {
        var on = event.on ? event.on.charAt(0).toUpperCase() + event.on.substring(1) : "";
        var cmd = this.setName(event.cmd);
        var val = {
            data: event.val ? event.val : {},
            target: event.target,
            id: this.fillIds(event.cmd)
        };
        var fn = (cmd + on + 'Action');
        console.log(val);
        //
        //
        // You should keep 'console.log(fn);' during developpment process as it will give you
        // the right syntax for your functions name! (So you'll just have to copy/past it into your code ;-) )
        console.log(fn);
        //
        //
        if (typeof this[fn] === 'function') {
            this[fn](val);
        }
    }

    GlobalController.prototype.documentDOMContentLoadedAction = function() {
        this.model['GlobalModel'].sayHello();
        this.view['GlobalView'].activateListeners();
    }

    return GlobalController;
}).call(this);



    app.controllers.GlobalController.prototype.h1ClickAction = function() {
        var color = ['red', 'blue', 'black', 'green'];
        var col = color[Math.floor(Math.random() * 4)];
        this.model['GlobalModel'].setColor(col);
    }

    app.controllers.GlobalController.prototype.hoverClassMouseoverAction = function(){
        this.model['GlobalModel'].setColor('purple');
    }