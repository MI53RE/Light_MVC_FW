app.models.FormModel = (function() {
    var Observable = app.libs.Observable;

    function FormModel(name) {
        Observable.call(this);
        // here goes attributes;
        this.name = name;
        this.data = {};

    }
    FormModel.prototype = Object.create(Observable.prototype);
    FormModel.prototype.constructor = FormModel;

    return FormModel;
}).call(this);

app.models.FormModel.prototype.template = {
    'textForm': {
        labels: [{
           val: 'Firsname : ',
           to: 'firstname',
           br: true
        },{
           val: 'Lastname : ',
           to: 'lastname',
           br: true
        },{
           val: 'Date of Birth : ',
           to: 'dob',
           br: true
        },{
           br: true
        }],
        body: [{
            appendTo: 'blockId',
            formId: 'form_1'
            }, {
            name: 'firstname',
            placeholder: 'none',
            required: 'true',
            type: 'text'
            }, {
            name: 'lastname',
            placeholder: 'none',
            required: 'true',
            'class': 'not-prevented',
            type: 'text'
            }, {
            name: 'dob',
            placeholder: 'dd/mm/yyyy',
            required: 'true',
            type: 'date'
            }, {
            value: 'send it!',
            id: 'textForm_1',
            type: 'button'
            }
        ]
    },
    'checkForm': {
        labels: [{
           val: 'play video-games : ',
           to: 'vgames',
           br: true
        },{
           val: 'read books : ',
           to: 'books',
           br: true
        },{
           val: 'do painting : ',
           to: 'paint',
           br: true
        },{
           val: 'do sport : ',
           to: 'sport',
           br: true
        },{
           val: 'nothing!! : ',
           to: 'none',
           br: true
        },{
           br: true
        }],
        body: [{
            appendTo: 'blockId',
            formId: 'form_2'
        }, {
            name: 'hobbies',
            value: 'vgames',
            required: 'true',
            'class': 'not-prevented',
            type: 'checkbox'
        }, {
            name: 'hobbies',
            value: 'books',
            'class': 'not-prevented',
            type: 'checkbox'
        }, {
            name: 'hobbies',
            value: 'paint',
            'class': 'not-prevented',
            type: 'checkbox'
        }, {
            name: 'hobbies',
            value: 'sport',
            'class': 'not-prevented',
            type: 'checkbox'
        }, {
            name: 'hobbies',
            value: 'none',
            'class': 'not-prevented',
            type: 'checkbox'
        }, {
            value: 'send it!',
            id: 'textForm_2',
            type: 'button'
            }
        ]
    },
    'radioForm': {
        labels: [{
           val: 'Mr. : ',
           to: 'vgames',
           br: true
        },{
           val: 'Mrs. : ',
           to: 'female',
           br: true
        },{
           val: 'Miss : ',
           to: 'paint',
           br: true
        },{
           val: '???',
           to: 'paint',
           br: true
        },{
           br: true
        }],
        body: [{
            appendTo: 'blockId',
            formId: 'form_3'
        }, {
            name: 'gender',
            value: 'male',
            'class': 'not-prevented',
            type: 'radio'
        }, {
            name: 'gender',
            value: 'female',
            'class': 'not-prevented',
            type: 'radio'
        }, {
            name: 'gender',
            value: 'female',
            'class': 'not-prevented',
            type: 'radio'
        }, {
            name: 'gender',
            value: 'undefined',
            'class': 'not-prevented',
            checked: 'true',
            type: 'radio'
        }, {
            value: 'send it!',
            id: 'textForm_3',
            type: 'button'
            }
        ]
    },
};

app.models.FormModel.prototype.setForm = function(formName,id) {
    id = id || undefined;
    this.notify({
        cmd: 'newForm',
        val: {
            form: this.template[formName],
            id: id
        }
    });
};
app.models.FormModel.prototype.addData = function(data) {
  for(key in data){
    console.log(typeof data[key]);
    if (key.indexOf('Form') === -1){
      this.data[key] = this.data[key] ? this.data[key] : [];
      if (typeof data[key] !== 'string'){
        var length = data[key].length;
        for (var i = 0; i < length; i++){
          this.data[key].push(data[key][i]);
        }   
      } else {
        this.data[key].push(data[key]);
      }
    }
  }
        console.log(this.data);
};