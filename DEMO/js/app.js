var app = {
    models: {},
    views: {},
    controllers: {},
    libs: {},
    global: {
        models: {},
        views: {},
        controllers: {},
    },

    startGlobal: function() {
        var model = this.global.models.model = new app.models.GlobalModel('GlobalModel');
        var formModel = this.global.models.formModel = new app.models.FormModel('FormModel');
        var view = this.global.views.view = new app.views.GlobalView('GlobalView', model);
        var controller = this.global.controllers.controller = new app.controllers.GlobalController(model, view);
        controller.addModel(formModel);
        model.attach(view);
        formModel.attach(view);
        view.attach(controller);

        return this.global;
    }
};
