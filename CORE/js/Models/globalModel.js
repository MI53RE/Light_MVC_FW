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