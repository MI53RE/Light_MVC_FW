app.libs.Observable = (function(){
    function Observable(){
        
        this.observers = [];
    };

    // add an obsever type object to this.observer list so it can be notify from this.notify
    Observable.prototype.attach = function(obs){
        this.observers.push(obs);
    };

    // if you need to attach one obsever type object to several other, use this method instead
    Observable.prototype.attachTo = function(...mixedObs){
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            arguments[i].attach(this);
        }
    };

    // remove an obsever type object to this.observer list so it can be notify from this.notify
    Observable.prototype.detach = function(obs){
        var idx = this.observers.indexOf(obs);

        if (idx !== -1){
            this.observers.splice(idx , 1);
        }
    };

    // if you need to detach one obsever type object from several other, use this method instead
    Observable.prototype.detachFrom = function(...mixedObs){
        var argsL = arguments.length;
        for (var i = 0; i < argsL; i++) {
            arguments[i].detach(this);
        }
    };

    Observable.prototype.notify = function(event){
        console.log(this.observers);
        this.observers.forEach(function(obs){
            obs.update.call(obs, event);
        });
    };

    Observable.prototype.notifyTo = function(event, obs){
        this.observers.forEach(function(obs){
            obs.update.call(obs, event);
        });
    };
    return Observable;
}).call(this);