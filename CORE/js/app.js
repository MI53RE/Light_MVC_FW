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
        var view = this.global.views.view = new app.views.GlobalView('GlobalView', model);
        var controller = this.global.controllers.controller = new app.controllers.GlobalController(model, view);
        /*
         *
         * if you need to add extra model(s) and/or view(s), you will have to do it here using either the
         * aController.addModel(someModel);
         * aController.addView(someView);
         * aView.addModel(someModel);
         * or if you need to add several ones use the addModels and addViews methods instead
         * Depending of what you need else you can just use the following methods
         *
         */
        model.attach(view);
        view.attach(controller);

        return this.global;
    }
};
