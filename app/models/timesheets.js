var db = require('orm').db;

var Timesheets = db.define('timesheets', {
    id: {type: 'serial', key: true},
    employee_id: {type: 'integer'},
    project_id: {type: 'integer'},
    description: {type: 'text'},
    working_date: {type: 'date', time: false},
    start_time: {type: 'date', time: true},
    end_time: {type: 'date', time: true},
    working_hours: {type: 'number'},
    efficiency: {type: 'integer'},
    notes: {type: 'text'}
}, {
    methods: {
        getName: function(vu) {
            return this.start_time + vu;
        }
    }
});
