app.controllers.GlobalController = (function() {
    'use strict';

    function GlobalController(model, view) {
        this.model = {
            [model.name]: model
        };
        this.view = {
            [view.name]: view
        };
        // this.intervals is here to help for touch device, like for 'touchStart' event that would start a new interval
        // and 'touchEnd' event that would end it.
        this.intervals = {};
    };
    /*
     *
     * A Controller can have as many model as you want/need
     *
     */
    GlobalController.prototype.addModel = function(model) {
        this.model[model.name] = model;
        return this;
    };
    /*
     *
     * Same as previous but add as many as you need in one go!
     *
     */
    GlobalController.prototype.addModels = function(...mixedModel) {
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            this.model[arguments[i].name] = arguments[i];
        }
        return this;
    };
    /*
     *
     * And so you might need to remove them at some time
     *
     */
    GlobalController.prototype.removeModel = function(model) {
        delete this.model[model.name];
        return this;
    };
    /*
     *
     * Same as previous but remove as many as you need in one go!
     *
     */
    GlobalController.prototype.removeModels = function(...mixedModel) {
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            delete this.model[arguments[i].name];
        }
        return this;
    };
    /*
     *
     * A Controller can have as many view as you want/need
     *
     */
    GlobalController.prototype.addView = function(view) {
        this.view[view.name] = view;
        return this;
    };
    /*
     *
     * Same as previous but add as many as you need in one go!
     *
     */
    GlobalController.prototype.addViews = function(...mixedView) {
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            this.view[arguments[i].name] = arguments[i];
        }
        return this;
    };
    /*
     *
     * And so you might need to remove them at some time
     *
     */
    GlobalController.prototype.removeView = function(view) {
        delete this.view[view.name];
        return this;
    };
    /*
     *
     * Same as previous but remove as many as you need in one go!
     *
     */
    GlobalController.prototype.removeViews = function(...mixedView) {
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            delete this.view[arguments[i].name];
        }
        return this;
    };
    /*
     *
     * set the list of parameters ('ids') that will be used as values
     * during function call
     *
     */
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
    };
    /*
     *
     * set the first part of the function name that will be call later
     *
     */
    GlobalController.prototype.setName = function(cmd) {
        if (typeof(cmd) !== 'undefined') {
            var cmds = cmd.split(' ');
            var array = [];
            var cL = cmds.length;
            for (var i = 0; i < cL; i++){
                var newCmd = cmds[i].split('_')[0].split('-');
                if (newCmd.indexOf('any') === -1){
                    array[i] = [];
                    array[i].push(newCmd);
                }
            }
            var aL = array.length;
            var data = [];

            for (var i = 0; i < aL; i++) {
                data[i] = data[i] || [];
                var aiL = array[i].length;
                for (var j = 0; j < aiL; j++) {
                data[i].push(array[i][j][0]);
                    var aijL = array[i][j].length;
                    for (var k = 1; k < aijL; k++){
                        data[i][j] += (array[i][j][k].charAt(0).toUpperCase() + array[i][j][k].substring(1));
                    }
                }
            }
            return data;
        } else {
            return [];
        }
    };
    /*
     *
     *
     * update will catch all notify() from any view(s) that have this controller attached
     * the controller will then use information send from the view to automaticaly call the
     * function needed if already defined, else it will do nothing
     *
     *
     */
    GlobalController.prototype.update = function(event) {
        var on = event.on ? event.on.charAt(0).toUpperCase() + event.on.substring(1) : "";
        var cmd = this.setName(event.cmd);
        var val = {
            data: event.val,
            target: event.target,
            id: this.fillIds(event.cmd)
        };
        var fn = [];
        var cmdL = cmd.length;
        for (var i = 0; i < cmdL; i++){
            fn.push(cmd[i] + on + 'Action');
        }
        //console.log(val);
        //
        //
        // You should keep 'console.log(fn);' during developpment process as it will give you
        // the right syntax for your functions name! (So you'll just have to copy/past it into your code ;-) )
        console.log('list of function: ', fn);
        //
        //
        var fnL = fn.length;
        for (var i = fnL - 1; i >= 0; i--) {
            if (typeof this[fn[i]] === 'function') {
                this[fn[i]](val);
            }
        };
    };
    /*
     *
     * documentDOMContentLoadedAction() is the sole mandatory function of the controller as it will
     * allow the call of all the listener that need the DOM to be loaded first
     * but you can add extra calls towards models here if they don't need it!
     *
     */
    GlobalController.prototype.documentDOMContentLoadedAction = function() {
        // this call (this.view['GlobalView'].activateListeners();)
        // is mandatory as it will allow the activations of all
        // the orther listeners that MUST wait for the whole DOM to be loaded
        // leave it at the end if you need to put other call from there
        setTimeout(function() {
            this.model['GlobalModel'].completeInit();
        }.bind(this),150);
    };

    return GlobalController;
}).call(this);

//////////////////////////////////////////
//////////////////////////////////////////
/*
 *
 * For maintenance purpose I suggest you to add your custom methods
 * pass this point or in another file using this syntax:
 *
 * app.controllers.NameOfController.prototype.elmentEventAction = function() {};
 *
 * REMEMBER IF YOU WANT YOU CAN REDEFINE A PROTOTYPE, BUT IT WILL OVERRIDE THE PREVIOUS ONE!!!
 * so make sure of what you are up to before doing so!! 
 *
 */
//////////////////////////////////////////
//////////////////////////////////////////