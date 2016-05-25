app.views.GlobalView = (function() {
    var Observable = app.libs.Observable;

    function GlobalView(name, model) {
        Observable.call(this);
        this.name = name;
        this.listToNotPrevent = ['key']; // Here are defined the type of event that are not prevented by default
        this.prevent = 'not-prevented';
        this.required = 'please complete the mandatory field(s)!'; // ON HOLD
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
     * A view can have as many model as you want/need
     *
     */
    GlobalView.prototype.addModel = function(model) {
        this.model[model.name] = model;
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
     * init() will be call on the view creation
     * you can define here any listener that do not depend
     * of dynamic DOM (in case your application is dynamicaly 
     * generated) The default listener on DOMContentLoaded will
     * allow the launch on other listener that do depend of dynamic DOM
     *
     */
    GlobalView.prototype.init = function() {
        var doc = document;
        this.addListeners({
            elem: doc,
            type: 'document'
        }, 'DOMContentLoaded');
    };
    /*
     *
     * activateListeners() will be call once that init
     * is resolved you can define here any listener
     *
     */
    GlobalView.prototype.activateListeners = function() {
        var doc = document;
        this.addListeners({
            elem: doc,
            type: 'id'
        }, 'click');
        this.addListeners({
            elem: doc.getElementsByClassName('hover-class'),
            type: 'class'
        }, 'mouseover');
    };
    /*
     *
     * addListeners() is the setup for your event depending of elem.type
     *
     */
    GlobalView.prototype.addListeners = function(obj, onEvent) {
        obj.type = obj.type || 'document';
        if (obj.type === 'class' || obj.type === 'tag') {
            var elemsL = obj.elem.length;
            for (var i = 0; i < elemsL; i++) {
                obj.elem[i].addEventListener(onEvent, function(event) {
                    this.setEvent(event, obj, onEvent);
                }.bind(this));
            }
        } else {
            obj.elem.addEventListener(onEvent, function(event) {
                this.setEvent(event, obj, onEvent);
            }.bind(this));
        }
    };
    /*
     *
     * preventDefault() will check if event must be prevented or not
     *
     */
    GlobalView.prototype.preventDefault = function(event, obj) {
        obj.prevent = obj.prevent || false;
        var tltnp = this.listToNotPrevent.indexOf(obj.type);
        var toetc = typeof(event.target.className);
        var etcioBool = toetc !== 'undefined' && event.target.className.indexOf(this.prevent) === -1;
        if ((tltnp === -1 || (tltnp !== -1 && obj.prevent)) && (toetc === 'undefined' || etcioBool)) {
            console.log('prevented',tltnp === -1, toetc === 'undefined' ,etcioBool, obj.prevent);
            event.preventDefault();
        }
    }
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
    GlobalView.prototype.setEvent = function(event, obj, onEvent) {
                this.preventDefault(event, obj);
        if (onEvent === 'DOMContentLoaded') {
            var value = {};
            this.sendNotify({
                cmd: obj.type,
                on: onEvent,
                val: value,
                target: event.target
            });
            return false;

        } else {
            if (onEvent === 'keydown' || onEvent === 'keypress' || onEvent === 'keyup') {
                this.sendNotify({
                    cmd: 'key',
                    on: onEvent,
                    val: event.keyCode,
                    target: event.target
                });
                return false;
            } else {
                var notPrevented = (event.target.className && event.target.className !== this.prevent);
                if (typeof(event.target.className) !== 'undefined' && event.target.className.indexOf('any') !== -1) {
                    console.log('any');
                    this.anyEvent(event, obj, onEvent, notPrevented);
                } else {
                    console.log('priority');
                    this.priorityEvent(event, obj, onEvent, notPrevented);
                }
            }
        }
        return false;
    };
    /*
     *
     * anyEvent will call all event attached to an object regardless of 
     * the event's type
     *
     */
    GlobalView.prototype.anyEvent = function(event, obj, onEvent, notPreventedBool) {
        var value = {};
        var toetc = typeof(event.target.className);
        if (obj.type === 'id') {
            if (event.target.parentNode.nodeName === 'FORM') {
                value = this.inputHandler(event, value);
                if (value === false) {
                    this.sendNotify({
                        cmd: 'error',
                        on: 'Required'
                    });
                    return false;
                }
            }
            this.senderHandler(obj, event, onEvent, value);
        }
        if (obj.type === 'class' && notPreventedBool) {
            this.senderHandler(obj, event, onEvent, value);
        }
        if (obj.type === 'tag' && (toetc === 'undefined' || notPreventedBool)) {
            this.senderHandler(obj, event, onEvent, value);
        }
        if (obj.type === 'document' && (toetc === 'undefined' || notPreventedBool)) {
            this.senderHandler(obj, event, onEvent, value);
        }
        return false;
    };
    /*
     *
     * priorityEvent will call one event attached to an object regardless of 
     * the event's type
     *
     */
    GlobalView.prototype.priorityEvent = function(event, obj, onEvent, notPreventedBool) {
        var value = {};
        if (event.target.id) {
            if (obj.type !== 'id' && obj.type !== 'document') {
                return false;
            }
            if (event.target.parentNode.nodeName === 'FORM') {
                value = this.inputHandler(event, value);
                if (value === false) {
                    this.sendNotify({
                        cmd: 'error',
                        on: 'Required'
                    });
                    return false;
                }
            }
            this.senderHandler(obj, event, onEvent, value);
        } else if (notPreventedBool) {
            if (obj.type !== 'class' && obj.type !== 'document') {
                return false;
            }
            this.senderHandler(obj, event, onEvent, value);
        } else if (event.target.tagName && notPreventedBool) {
            if (obj.type !== 'tag' && obj.type !== 'document') {
                return false;
            }
            this.senderHandler(obj, event, onEvent, value);
        } else if (obj.type === 'document' && notPreventedBool) {
            this.senderHandler(obj, event, onEvent, value);
        }
    };

    GlobalView.prototype.senderHandler = function(obj, event, onEvent, value) {
        switch (obj.type) {
            case 'id':
                this.sendNotify({
                    cmd: event.target.id,
                    on: onEvent,
                    val: value,
                    target: event.target
                });
                break;
            case 'class':
                this.sendNotify({
                    cmd: event.target.className,
                    on: onEvent,
                    val: value,
                    target: event.target
                });
                break;
            case 'tag':
                this.sendNotify({
                    cmd: event.target.tagName,
                    on: onEvent,
                    val: value,
                    target: event.target
                });
                break;
            case 'document':
                this.sendNotify({
                    cmd: event.target.id || event.target.className || event.target.tagName,
                    on: onEvent,
                    val: value,
                    target: event.target
                });
            default:
                break;
        }
    }
  
    GlobalView.prototype.inputHandler = function(event, value) {
        var inputValues = event.target.parentNode.getElementsByTagName('input') || [];
        var selectValues = event.target.parentNode.getElementsByTagName('select') || [];
        console.log(selectValues);
        //var inputValues = inputValues.concat(selectValues);
        var length = inputValues.length;
        for (var i = 0; i < length; i++) {
            var checkRadBool = (inputValues[i].type === 'checkbox' || inputValues[i].type === 'radio');
            var requiredBool = (inputValues[i].required && ((!checkRadBool && inputValues[i].value !== '') || (checkRadBool && inputValues[i].checked)));
            if (inputValues[i].required === false || requiredBool) {
                var key = inputValues[i].id || inputValues[i].name;
                if (checkRadBool && inputValues[i].checked) {
                    value[key] = value[key] ? value[key] : [];
                    value[key].push(inputValues[i].value);
                } else if (!checkRadBool) {
                    value[key] = inputValues[i].value;
                }
            } else {
                return false;
            }
        }
        var selectL = selectValues.length;
        for (var j = 0; j < selectL; j++){
            var checkRadBool = (selectValues[j].type === 'checkbox' || selectValues[j].type === 'radio');
            var requiredBool = (selectValues[j].required && ((!checkRadBool && selectValues[j].value !== '') || (checkRadBool && selectValues[j].checked)));
            if (selectValues[j].required === false || requiredBool) {
                var key = selectValues[j].id || selectValues[j].name;
                if (checkRadBool && selectValues[j].checked) {
                    value[key] = value[key] ? value[key] : [];
                    value[key].push(selectValues[j].value);
                } else if (!checkRadBool) {
                    value[key] = selectValues[j].value;
                }
            } else {
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
     * as it will automaticaly set the attribute to a default value if nothing
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
 * For maintenance purpose I suggest you to add your custom methods
 * pass this point or in another file using this syntax:
 *
 * app.controllers.NameOfModel.prototype.functionName = function() {};
 *
 * REMEMBER IF YOU WANT YOU CAN REDEFINE A PROTOTYPE, BUT IT WILL OVERRIDE THE PREVIOUS ONE!!!
 * so make sure of what you are up to before doing so!!  
 *
 */
//////////////////////////////////////////
//////////////////////////////////////////
