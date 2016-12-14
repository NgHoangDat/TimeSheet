var db = require('orm').db;

var Approves = db.define('approves', {
    id: {type: 'serial', key: true},
    approver_id: {type: 'integer'},
    timesheet_id: {type: 'integer'},
    working_hours: {type: 'number'},
    efficiency: {type: 'integer'},
    notes: {type: 'text'}
}, {
    methods: {
        getName: function() {
            return this.name;
        }
    }
});
