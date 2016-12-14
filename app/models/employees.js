var db = require('orm').db;

var Employees = db.define('employees', {
    id: {type: 'serial', key: true},
    name: {type: 'text'},
    sex: {type: 'integer'},
    email: {type: 'text'},
    password: {type: 'text'},
    phone: {type: 'text'},
    role_id: {type: 'integer'},
    notes: {type: 'text'},
    token: {type: 'text'}
}, {
    methods: {
        getName: function() {
            return this.name;
        }

    }
});
