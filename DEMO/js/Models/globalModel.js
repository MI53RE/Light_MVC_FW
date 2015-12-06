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


app.models.GlobalModel.prototype.sayHello = function() {
        this.notify({
            cmd: 'hello'
        });
    };
app.models.GlobalModel.prototype.setColor = function(color) {
        this.notify({
            cmd: 'color',
            val: color
        });
    };