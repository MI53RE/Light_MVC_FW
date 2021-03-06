app.views.GlobalView = (function() {
    var Observable = app.libs.Observable;

    function GlobalView(name, model) {
        Observable.call(this);
        this.name = name;
        this.any = 'any',
        this.acceptType = 'all',
        this.prevent = 'not-prevented',
        this.required = 'please complete the mandatory field(s)!',
            this.model = {
                [model.name]: model
            };
        this.init();
    };
    /*
     *
     * set Constructor and extends from Observable.prototype
     *
     */
    GlobalView.prototype = Object.create(Observable.prototype);
    GlobalView.prototype.constructor = GlobalView;
    /*
     *
     * A View can have as many model as you want/need
     *
     */
    GlobalView.prototype.addModel = function(model) {
        this.model[model.name] = model;
        return this;
    };
    /*
     *
     * Same as previous but add as many as you need in one go!
     *
     */
    GlobalView.prototype.addModels = function(...mixedModel) {
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
    GlobalView.prototype.removeModel = function(model) {
        delete this.model[model.name];
        return this;
    };
    /*
     *
     * Same as previous but remove as many as you need in one go!
     *
     */
    GlobalView.prototype.removeModels = function(...mixedModel) {
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            delete this.model[arguments[i].name];
        }
        return this;
    };
    /*
     *
     * init() will be call on application start
     * you can define here any listener that do not depend
     * of dynamic DOM (in case your application view is dynamicaly 
     * generated) The default listener on DOMContentLoaded will
     * allow the launch on other listener that do depend of dynamic DOM
     *
     */
    GlobalView.prototype.init = function() {
        this.addListeners({
            'document': document
        }, 'DOMContentLoaded');
    };
    /*
     *
     * activateListeners() will be call once that init
     * is resolved you can define here any listener
     *
     */
    GlobalView.prototype.activateListeners = function() {
    };
    /*
     *
     * addListeners() is the setup for your event depending of elem.type
     *
     */

    GlobalView.prototype.addListeners = function(obj, onEvent) {
        obj.id = obj.id || null;
        obj.class = obj.class || null;
        obj.tag = obj.tag || null;
        obj.document = obj.document || null;

        if (obj.id !== null) {
            this.setListeners(obj.id, 'id', onEvent);
        }
        if (obj.class !== null) {
            this.setListeners(obj.class, 'class', onEvent);
        }
        if (obj.tag !== null) {
            this.setListeners(obj.tag, 'tag', onEvent);
        }
        if (obj.document !== null) {
            this.setListeners(obj.document, 'document', onEvent);
        }
    };

    GlobalView.prototype.setListeners = function (elems, type, onEvent) {
        if (type === 'document') {
            elems.addEventListener(onEvent, function(event) {
                this.setEvent(event, type, onEvent);
            }.bind(this));      
        } else {
            console.log(type);
            var elemsL = elems.length;
            for (var i = 0; i < elemsL; i++) {
                var elem = elems[i];
                if (typeof elem === 'undefined' || elem === null) {
                    continue;
                }
                if (type === 'id'){
                    elem.addEventListener(onEvent, function(event) {
                        this.setEvent(event, type, onEvent);
                    }.bind(this));
                } else {
                    var elemL = elem.length;
                    for (var j = 0; j < elemL; j++) {
                        elem[j].addEventListener(onEvent, function(event) {
                            this.setEvent(event, type, onEvent);
                        }.bind(this));
                    }
                }
            }
        }
    };
    /*
     *
     * setEvent() will handle all the informations you might need 
     * from the event and send them to the view's controller through 
     * this.sendNotify() where parameters are inside of an object containing (at least):
     * this.sendNotify({
     *  cmd: the instruction's name (ex: event.target.id),
     *  on: the nature of event (ex: 'click'),
     *  val: the value that need to be collected (will always be an object
     *       and be empty if not needed),
     *  target: the target of the event
     * })
     *
     * by default setEvent() will ALWAYS prevent the default action, to prevent such
     * behaviour you'll need to add the 'not-prevented' class to any element that should
     * keep their default behaviour
     *
     */
    GlobalView.prototype.setEvent = function(event, type, onEvent) {
        console.log(type,onEvent);
        if (typeof(event.target.className) === 'undefined' || event.target.className.indexOf(this.prevent) === -1) {
            event.preventDefault();
        }
        if (onEvent === 'DOMContentLoaded') {
            var value = {};
            this.sendNotify({
                cmd: type,
                on: onEvent,
                val: value,
                target: event.target
            });
            return false;
        } else {
            if (this.checkAcceptEventType(event, onEvent) === true) {
                this.sendEvent(event, type, onEvent);
            }
        }
        return false;
    };

    GlobalView.prototype.checkEventType = function(event, typeSource, type) {
        var bool = (typeSource === type && event.target.className !== this.prevent);
        console.log(bool, typeSource, type);
        return bool;
    }

    GlobalView.prototype.checkElemType = function(event, types) {
        types = types || 'undefined';
        // console.log(event.target.dataset.targetType);
        var targetType = event.target.dataset.targetType || '';
        if (targetType === '' || targetType.indexOf(this.any) !== -1 || targetType.indexOf(types) !== -1) {
            return true;
        }
        return false;
    }

    GlobalView.prototype.checkType = function(event, typeSource, type) {
        var bool = this.checkElemType(event, type) && this.checkEventType(event, typeSource, type);
        return bool;
    }
    /*
     *
     * Will check if event type is allowed on target (default: is true);
     *
     */
    GlobalView.prototype.checkAcceptEventType = function(event, onEvent) {
         var acceptEvent = (typeof event.target.dataset.acceptEvent === 'undefined') ? this.acceptType : event.target.dataset.acceptEvent;
         console.log(acceptEvent, onEvent,(acceptEvent !== this.acceptType && acceptEvent.indexOf(onEvent) === -1));
         if (acceptEvent !== this.acceptType && acceptEvent.indexOf(onEvent) === -1) {
            return false;
         }
         return true;
    }
    /*
     *
     * sendEvent() will call all events of same type (eg: 'click') attached to an element 
     *
     */
    GlobalView.prototype.sendEvent = function(event, type, onEvent){
        var value = {};
        if (this.checkType(event, type, 'id')) {
            if (onEvent === 'keydown' || onEvent === 'keypress' || onEvent === 'keyup') {
                this.sendNotify({
                    cmd: event.target.id,
                    on: onEvent,
                    val: event.keyCode,
                    target: event.target
                });
            } else if (event.target.parentNode.getElementsByTagName('input')) {
                value = this.inputHandler(event,value);
                if (value === false){
                    return false;
                }
            }
            this.sendNotify({
                cmd: event.target.id,
                on: onEvent,
                val: value,
                target: event.target
            });
        }
        if (this.checkType(event, type, 'class')) {
            this.sendNotify({
                cmd: event.target.className,
                on: onEvent,
                val: value,
                target: event.target
            });
        }
        if (this.checkType(event, type, 'tag')) {
            this.sendNotify({
                cmd: event.target.tagName,
                on: onEvent,
                val: value,
                target: event.target
            });
        }
        if (this.checkType(event, type, 'document')) {
            this.sendNotify({
                cmd: 'document',
                on: onEvent,
                val: value,
                target: event.target
            });
        }
    }

    GlobalView.prototype.inputHandler = function(event,value){
        var values = event.target.parentNode.getElementsByTagName('input');
        var length = values.length;
        for (var i = 0; i < length; i++) {
            var checkRadBool = (values[i].type === 'checkbox' || values[i].type === 'radio');
            var requiredBool = (values[i].required && ((!checkRadBool && values[i].value !== '') || (checkRadBool && values[i].checked)));
            if (values[i].required === false || requiredBool){
                var key = values[i].id || values[i].name;
                if (checkRadBool && values[i].checked){
                    value[key] = value[key] ? value[key] : [];
                    value[key].push(values[i].value);
                }else if (!checkRadBool) {
                    value[key] = values[i].value;
                }
            }else{
                alert(this.required);
                return false;
            }
        }
        return value;
    };
    /*
     *
     * sendNotify() will set all its parameters to
     * this.notify({}) where {} is an object
     * sendNotify() is here so you can add custom attribute 
     * that migth not be needed everywhere and pass them as parameters
     * when this.sendNotify() is call inside of setEvent()
     *
     * When adding custom attribute make sure to set it like:
     * {
     *   customAttr : obj.customAttr || undefined (or {},[],'',0,etc..), 
     * }
     * Doing so will prevent error if you do not pass the attribute
     * as it will automaticaly set the attribute to undefined if nothing
     * is provided
     * 
     */
    GlobalView.prototype.sendNotify = function(obj) {
        this.notify({
            cmd: obj.cmd || undefined,
            on: obj.on || undefined,
            val: obj.val || {},
            target: obj.target || undefined,
        });
    };

    /*
     *
     * The 3 followings functions are here to simplify the addListeners function as the
     * last one require array for its object parammeter (except for 'document' which only need document as value)
     *
     */


    GlobalView.prototype.getElementsByIds = function() {
        var result = [];
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            result.push(document.getElementById(arguments[i]));
        }
        return result;
    };

    GlobalView.prototype.getElementsByClassName = function() {
        var result = [];
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            result.push(document.getElementsByClassName(arguments[i]));
        }
        return result;
    };

    GlobalView.prototype.getElementsByTagName = function() {
        var result = [];
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            result.push(document.getElementsByTagName(arguments[i]));
        }
        return result;
    };
    /*
     *
     * update will catch all notify() from any model(s) that have this view attached
     * it will then proceed according to the event.cmd value
     *
     */
    GlobalView.prototype.update = function(event) {
        console.log(this.name + ' : event received : ' + event.cmd);
    };
    return GlobalView;
}).call(this);

//////////////////////////////////////////
//////////////////////////////////////////
/*
 *
 * If you need to add method outside of this 'class' (be it past this point inside 
 * this file or in another file), you can do so using this syntax:
 *
 * app.controllers.NameOfModel.prototype.functionName = function() {};
 *
 * REMEMBER IF YOU WANT YOU CAN EDEFINE A PROTOTYPE, BUT IT WILL OVERRIDE THE PREVIOUS ONE!!!
 * so make sure of what you are up to before doing so!!  
 *
 */
//////////////////////////////////////////
//////////////////////////////////////////
