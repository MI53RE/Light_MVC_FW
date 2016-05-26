app.models.GlobalModel = (function() {
    var Observable = app.libs.Observable;

    function GlobalModel(name) {
        Observable.call(this);
        // here goes attributes;
        this.name = name;

    }
    GlobalModel.prototype = Object.create(Observable.prototype);
    GlobalModel.prototype.constructor = GlobalModel;

    return GlobalModel;
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
 */
//////////////////////////////////////////
//////////////////////////////////////////