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
        // those are just shortcut references
        var gm = this.global.models;
        var gv = this.global.views;
        var gc = this.global.controllers;

        // models, views and controllers declaration must be done here!
        var model = gm.model = new app.models.GlobalModel('GlobalModel');
        var formModel = gm.formModel = new app.models.FormModel('FormModel');
        var syntaxHighlighterModel = gm.syntaxHighlighterModel = new app.models.SyntaxHighlighterModel('SyntaxHighlighterModel');
        var view = gv.view = new app.views.GlobalView('GlobalView', model);
        var controller = gc.controller = new app.controllers.GlobalController(model, view);
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
        controller.addModels(formModel, syntaxHighlighterModel);
        view.attachTo(model, formModel, syntaxHighlighterModel);
        /*
         * view.atachTo(...) is actually the same as the following:
         * model.attach(view);
         * formModel.attach(view);
         * syntaxHighlighterModel.attach(view);
         */
        view.attach(controller);

        return this.global;
    }
};
