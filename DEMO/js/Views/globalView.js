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
        // event.cmd will indicate the action the view need to apply
        if (event.cmd === 'hello') {
            this.printTitle({
                num: 1
            });
            this.printTitle({
                num: 1,
                level: 2,
                value: 'Under me you will have event to test!'
            });

            // Even if they do have the same look the 'any' css-class will impact how an element will respond to an 
            // event as it will tell if said element will catch all event or just one! 
            // As of now priority order is (from left to right):
            // id > class > tag > document
            // by default all element work with the priority event type. 
            this.printTitle({
                num: 1,
                classe: 'hover-class',
                level: 3,
                value: 'click me maybe? :D (priority event type, depend on the property of element AND the event\'s type)'
            });
            this.printTitle({
                num: 2,
                classe: 'hover-class',
                level: 3,
                value: 'hover me maybe? :D (priority event type)'
            });
            this.printTitle({
                num: 3,
                classe: 'hover-class any',
                level: 3,
                value: 'click me maybe? :D (all possible event type, catch)'
            });
            this.printTitle({
                num: 4,
                classe: 'hover-class any',
                level: 3,
                value: 'hover me maybe? :D (all possible event type)'
            });
        }
        if (event.cmd === 'newForm') {
            this.createForm(event.val);
        }
        if (event.cmd === 'color') {
            this.setColor(event.val, 1);
        }
        // in a single event.cmd it is also possible to pass several order using indexOf to 
        // retrieve them after
        if (event.cmd.split(' ').indexOf('color') !== -1) {
            this.setColor(event.val, 1);
            this.messItUp(1);
            // it is also possible to throw and event upon another one!!
            this.sendNotify({
                cmd: 'h1_',
                on: 'done'
            });
        }
        if (event.cmd === 'done') {
            this.setColor(event.val, 1);
        }

    };
    return GlobalView;
}).call(this);
/*
 *
 * Here you will be able to add your custom method that will then be called in the update function
 * the following method have only been defined for the sake of the Demo.
 * 
 * You can also add them in a separate file (wich I would personnaly recommend) so you could keep
 * the core of the MVC clean and just swap your methods files according to your needs
 *
 * REMEMBER IF YOU WANT YOU CAN REDEFINE A PROTOTYPE, BUT IT WILL OVERRIDE THE PREVIOUS ONE!!!
 * so make sure of what you are up to before doing so!!  
 *
 */
app.views.GlobalView.prototype.shuffle = function(array) {
    for (var j, x, i = array.length; i; j = Math.floor(Math.random() * i), x = array[--i], array[i] = array[j], array[j] = x);
    return array;
};

app.views.GlobalView.prototype.setColor = function(color, num) {
    document.getElementById('h1_' + num.toString()).setAttribute('style', 'color:' + color + ';');
};

app.views.GlobalView.prototype.removeElement = function(main, id) {
    var elem = document.getElementById(main + id);
    elem.parentNode.removeChild(elem);

};

app.views.GlobalView.prototype.createForm = function(obj) {
    var forms = obj.form.body;
    var labels = obj.form.labels;
    if (typeof(obj.id) !== 'undefined') {
        this.removeElement('form_', obj.id);
    }
    var length = forms.length;
    var form = document.createElement('form');
    var select;
    var id = '';
    var not = 0;
    for (var i = 0; i < length; i++) {
        if (typeof(forms[i]['appendTo']) === 'undefined') {
            if(forms[i]['type'] === 'select' || forms[i]['type'] === 'option' ){
                var input = this.setSelect(forms[i]);
            }else{
                var input = document.createElement('input');
                for (attr in forms[i]) {
                    console.log(attr, forms[i][attr]);
                    input.setAttribute(attr, forms[i][attr]);
                }
            }
            if (i < length && labels.length >= i) {
                var lab = labels.length > 1 ? labels[i - not] : labels[0];
                if (lab.br)  {
                    form.appendChild(document.createElement('br'));
                }
                if (lab.val) {
                    var label = document.createElement('label');
                    label.setAttribute('for', lab.to);
                    label.innerHTML = lab.val;
                    form.appendChild(label);
                }
            }
            form.appendChild(input);
            
        } else {
            not++;
            id = forms[i].appendTo;
            form.setAttribute('id', forms[i].formId);
        }
    }
    console.log(form);
    document.getElementById(id).appendChild(form);
};

app.views.GlobalView.prototype.setSelect = function(formObj){
    if (formObj['type'] === 'select'){
        select = document.createElement('select');
        for (attr in formObj) {
            console.log(attr, formObj[attr]);
            select.setAttribute(attr, formObj[attr]);;
        }
    }else{
        var option = document.createElement('option');
        option.innerHTML = formObj.value
        select.appendChild(option);
    }
    return select;
};
app.views.GlobalView.prototype.printTitle = function(obj) {
    obj.num = obj.num || 1;
    obj.classe = obj.classe || undefined;
    obj.level = obj.level || 1;
    obj.value = obj.value || 'Hello world!';
    var classe = obj.classe ? 'class="' + obj.classe + '"id="h' + obj.level + '_' + obj.num.toString() + '"' : 'id="h' + obj.level + '_' + obj.num.toString() + '"';
    var newElem = document.createElement('div');
    document.getElementById('div_1').appendChild(newElem);
    newElem.innerHTML = '<h' + obj.level + ' ' + classe + '>' + obj.value + '</h' + obj.level + '>';
};
app.views.GlobalView.prototype.done = function() {
    alert("I'm done!!");
};

app.views.GlobalView.prototype.messItUp = function(num) {
    var elem = document.getElementById('h1_' + num);
    var mess = elem.innerHTML.split(' ');
    mess = this.shuffle(mess);
    var endMess = mess[mess.length - 1];
    for (var i = mess.length - 2; i >= 0; i--) {
        endMess += ' ' + mess[i];
    };
    elem.innerHTML = endMess;
};
