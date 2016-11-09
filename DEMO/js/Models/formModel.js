app.models.FormModel = (function() {
    var Observable = app.libs.Observable;

    function FormModel(name) {
        Observable.call(this);
        // here goes attributes;
        this.name = name;
        this.data = {};
        this.templates = {};

    }
    FormModel.prototype = Object.create(Observable.prototype);
    FormModel.prototype.constructor = FormModel;

    FormModel.prototype.addTemplate = function(array) {
        console.log(array);
        array = array || [];
        arrayL = array.length;
        for (var i = 0; i < arrayL; i++) {
            this.templates[array[i].id] = array[i];
        }
        console.log(this.templates);
        return this;
    }

    FormModel.prototype.addData = function(data) {
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

    FormModel.prototype.createForm = function(formName,id) {
        console.log(this.templates, formName);
        var forms = this.templates[formName].body;
        var labels = this.templates[formName].labels;
        id = id || undefined;
        if (typeof(id) !== 'undefined') {
            this.removeElement('form_', id);
        }
        var length = forms.length;
        var form = document.createElement('form');
        var select;
        var id = '';
        var not = 0;
        for (var i = 0; i < length; i++) {
            if (typeof(forms[i]['appendTo']) === 'undefined') {
                if(forms[i]['type'] === 'select'/* || forms[i]['type'] === 'option' */){
                    var input = this.setSelect(forms[i]);
                }else{
                    var input = document.createElement('input');
                    for (attr in forms[i]) {
                        console.log(attr, forms[i][attr]);
                        input.setAttribute(attr, forms[i][attr]);
                    }
                }
                if (i < length && labels.length >= i) {
                    var lab = labels.length > 1 ? labels[i - not] : labels[0];
                    if (lab.br)  {
                        form.appendChild(document.createElement('br'));
                    }
                    if (lab.val) {
                        var label = document.createElement('label');
                        label.setAttribute('for', lab.for);
                        label.innerHTML = lab.val;
                        form.appendChild(label);
                    }
                }
                form.appendChild(input);
                
            } else {
                not++;
                id = forms[i].appendTo;
                form.setAttribute('id', forms[i].formId);
            }
        }
        console.log(form, id);
        document.getElementById(id).appendChild(form);
    };

    FormModel.prototype.setSelect = function(formObj){
        console.log(formObj)
        select = document.createElement('select');
        for (attr in formObj) {
           // console.log(attr, formObj[attr]);
            if (attr !== 'option') {
                select.setAttribute(attr, formObj[attr]);
            }
        }
        var opt = formObj.option;
        var optL = opt.length;
        for (var j = 0; j < optL; j++) {
            opt[j].val = opt[j].val ? opt[j].val : '';
            opt[j].inner = opt[j].inner ? opt[j].inner : opt[j].val;
            opt[j].attr = opt[j].attr ? ' ' + opt[j].attr : '';
            select.innerHTML += '<option value="' + opt[j].val + '"' + opt[j].attr +'>' + opt[j].inner + '</option>';
        }
        return select;
    };

    return FormModel;
}).call(this);

/*
app.models.FormModel.prototype.template = {
    'text-form': {
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
            appendTo: 'block-id',
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
            id: 'text-form_1',
            'data-target-type': 'id', 
            type: 'button'
            }
        ]
    },
    'check-form': {
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
            appendTo: 'block-id',
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
            id: 'text-form_2',
            'data-target-type': 'id',
            type: 'button'
            }
        ]
    },
    'radio-form': {
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
            appendTo: 'block-id',
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
            id: 'text-form_3',
            'data-target-type': 'id',
            type: 'button'
            }
        ]
    },
};*/

/*app.models.FormModel.prototype.setForm = function(formName,id) {
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
    if (key.indexOf('form') === -1){
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
};*/




var addUserTemplate = {
 id: 'create-user-form',
    labels: [
        {val: 'Nom : ', for: 'lastname'},
        {val: 'Téléphone 1 : ', for: 'phone1'},
        {val: 'Prénom : ', for: 'firstname', br: true},
        {val: 'Téléphone 2 : ', for: 'phone2'},
        {val: 'Identifiant : ', for: 'login', br: true},
        {val: 'Avatar : ', for: 'avatar'},
        {val: 'Email : ', for: 'email', br: true},
        {val: 'Langue : ', for: 'locale'},
        {val: 'Civilité : ', for: 'gender', br: true},
        {br: true}
    ],
    body: [{
         appendTo: 'form-test-block',
         formId: 'create-user-form'
        }, {
            name: 'lastname',
            placeholder: 'Pierre',
            required: 'true',
            'class': 'not-prevented',
            type: 'text'
        }, {
            name: 'phone1',
            placeholder: 'XX XX XX XX XX',
            type: 'tel'
        }, {
         name: 'firstname',
         placeholder: 'Dupont',
         required: 'true',
         type: 'text'
        }, {
            name: 'phone2',
            placeholder: 'XX XX XX XX XX',
            type: 'tel'
        }, {
            name: 'login',
            placeholder: 'Identifiant',
            required: 'true',
            type: 'date'
        }, {
            name: 'avatar',
            placeholder: 'url/img.png',
            type: 'file'
        }, {
            name: 'email',
            placeholder: 'email@domain.com',
            required: 'true',
            type: 'email'
        }, {
            name: 'locale',
            placeholder: 'none',
            required: 'true',
            type: 'select',
            option: [
                {val: 'fr-FR', inner: 'Français'},
                {val: 'en-EN', inner: 'English'}
            ]
        }, {
            name: 'gender',
            placeholder: 'none',
            required: 'true',
            type: 'select',
            option: [
                {val: '0', inner: 'N/A'},
                {val: '1', inner: 'Mr'},
                {val: '2', inner: 'Mme'},
                {val: '3', inner: 'Mlle'}
            ]
        }, {
         value: 'Ajouter',
         id: 'create-user-send',
         type: 'button'
        }
    ]
};




// usersForm.createForm('create-user')
