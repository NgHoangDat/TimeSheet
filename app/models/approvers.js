var db = require('orm').db;

var Approvers = db.define('approvers', {
    id: {type: 'serial', key: true},
    approver_id: {type: 'integer'},
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
