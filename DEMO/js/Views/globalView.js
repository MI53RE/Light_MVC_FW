app.views.GlobalView = (function() {
    var Observable = app.libs.Observable;

    function GlobalView(name, model) {
        Observable.call(this);
        this.name = name;
        this.prevent = 'not-prevented',
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
     * init() will be call on application start
     * you can define here any listener that do not depend
     * of dynamic DOM (in case your application view is dynamicaly 
     * generated)
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
            type: 'document'
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
        if (typeof(event.target.className) === 'undefined' || event.target.className.indexOf(this.prevent) === -1) {
            event.preventDefault();
        }
        if (event.target.id) {
            var value = {};
            if (onEvent === 'keydown' || onEvent === 'keypress' || onEvent === 'keyup') {
                this.sendNotify({
                    cmd: event.target.id,
                    on: onEvent,
                    val: event.keyCode,
                    target: event.target
                });
                return false;
            } else if (event.target.parentNode.getElementsByTagName('input')) {
                var values = event.target.parentNode.getElementsByTagName('input');
                var length = values.length;
                for (var i = 0; i < length; i++) {
                    var key = values[i].id || values[i].name;
                    if (((values[i].type === 'checkbox' || values[i].type === 'radio') && values[i].checked) 
                        || (values[i].type !== 'checkbox' && values[i].type !== 'radio')){
                        value[key] = values[i].value;
                    }
                }
            }
            this.sendNotify({
                cmd: event.target.id,
                on: onEvent,
                val: value,
                target: event.target
            });
            return false;
        } else if (onEvent === 'DOMContentLoaded') {
            this.sendNotify({
                cmd: obj.type,
                on: onEvent,
                val: value,
                target: event.target
            });
            return false;
        } else if (obj.type === 'class' && event.target.className !== this.prevent) {
            this.sendNotify({
                cmd: event.target.className,
                on: onEvent,
                val: value,
                target: event.target
            });
            return false;
        } else if (obj.type === 'tag' && event.target.className !== this.prevent) {
            this.sendNotify({
                cmd: event.target.className,
                on: onEvent,
                val: value,
                target: event.target
            });
            return false;
        }
        return false; // EQUIVALENT AU 'default' D'UN SWITCH CASE -> si l'event n'est pas définie correctement ne fait rien!
    };
    /*
     *
     * sendNotify() will set all its parameters to
     * this.notify({}) where {} is an object
     * sendNotify() is here so you can add custom attribute 
     * that migth not be needed everywhere and pass them as parameters
     * when this.sendNotify() is call inside of setEvent()
     *
     * When adding custom attribute make sure to set it like so:
     * {
     *   customAttr : obj.customAttr || undefined, 
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
            val: obj.val || undefined,
            target: obj.event || undefined,
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
            this.printHello(1,'hover-class');
            this.printHello(2);
            this.createForm(formParameters)
        }
        if (event.cmd === 'color') {
            this.setColor(event.val, 2);
        }
        // in a single event.cmd it is also possible to pass several order using indexOf to 
        // retrieve them after
        if (event.cmd.split(' ').indexOf('color') !== -1) {
            this.setColor(event.val, 2);
            this.messItUp(2);
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
    console.log(j, x, i, array.length);
    return array;
}

app.views.GlobalView.prototype.setColor = function(color, num) {
    document.getElementById('h1_' + num.toString()).setAttribute('style', 'color:' + color + ';');
};

app.views.GlobalView.prototype.createForm = function(arrayOfObj){
    var length = arrayOfObj.length;
    var form = document.createElement('form');
    console.log(form);
    for (var i = 0; i < length; i++){
        var input = document.createElement('input');
        for (attr in arrayOfObj[i]){
            console.log(attr, arrayOfObj[i][attr]);
            input.setAttribute(attr, arrayOfObj[i][attr]);
        }
        form.appendChild(input);
    }
    document.getElementById('body').appendChild(form);
}

app.views.GlobalView.prototype.printHello = function(num, classe) {
    classe = classe ? 'class="'+ classe + '"' : 'id="h1_' + num.toString() + '"';
    var newElem = document.createElement('div');
    document.getElementById('div_1').appendChild(newElem);
    newElem.innerHTML = "<h1 " + classe + ">Hello World (click me please!!!)</h1>";
};
app.views.GlobalView.prototype.done = function() {
    alert("I'm done!!");
};

app.views.GlobalView.prototype.messItUp = function(num) {
    var elem = document.getElementById('h1_' + num)
    var mess = [
        'Hello',
        'World',
        'click',
        'me',
        'please',
        '!!!',
    ];
    mess = this.shuffle(mess);
    elem.innerHTML = mess[0] + ' ' + mess[1] + ' ' + mess[2] + ' ' + mess[3] + ' ' + mess[4] + ' ' + mess[5];
};

var formParameters = [{
    name: 'bibi',
    value: 'none',
    type: 'text'
},{
    name: 'baba',
    value: 'niop',
    'class': 'not-prevented', 
    type: 'checkbox'
},{
    value: 'send it!',
    name: 'baba',
    id: 'plop', 
    type: 'button'
}]