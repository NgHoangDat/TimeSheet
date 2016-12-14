var db = require('orm').db;

var employees_projects = db.define('employees_projects', {
    id: {type: 'serial', key: true},
    employee_id: {type: 'integer'},
    project_id: {type: 'integer'},
    notes: {type: 'text'}
}, {
    methods: {
        getName: function() {
            return this.name;
        }
    }
});
