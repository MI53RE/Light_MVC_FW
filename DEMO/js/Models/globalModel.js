app.models.GlobalModel = (function() {
    var Observable = app.libs.Observable;

    function GlobalModel(name) {
        Observable.call(this);
        // here goes attributes;
        this.name = name;
        this.color = {
            green: 'green',
            red: 'red',
            blue: 'blue',
        }
        this.msg = {
            hw: 'hello world',
        }

    }
    GlobalModel.prototype = Object.create(Observable.prototype);
    GlobalModel.prototype.constructor = GlobalModel;
    GlobalModel.prototype.completeInit = function () {
        this.notify({
            cmd: 'initCompleted'
        })
    }

    return GlobalModel;
}).call(this);

app.models.GlobalModel.prototype.setText = function(target) {
        this.notify({
            cmd: 'print',
            val: {
                text: this.msg.hw,
                target: target
            }
        });
    };
app.models.GlobalModel.prototype.setColor = function(target,color) {
    color = color || 'green';
        this.notify({
            cmd: 'color',
            val: {
                color: this.color[color],
                target: target
            }
        });
    };
app.models.GlobalModel.prototype.setBorderClick = function(target) {
        this.notify({
            cmd: 'border-click',
            val: target
        });
    };
app.models.GlobalModel.prototype.setBorderHover = function(target) {
        this.notify({
            cmd: 'border-hover',
            val: target
        });
    };