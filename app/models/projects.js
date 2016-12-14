var db = require('orm').db;

var Projects = db.define('projects', {
    id: {type: 'serial', key: true},
    name: {type: 'text'},
    description: {type: 'text'},
    leader_id: {type: 'integer'},
    notes: {type: 'text'}
}, {
    methods: {
        getName: function() {
            return this.name;
        }
    }
});
