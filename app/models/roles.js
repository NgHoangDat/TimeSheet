var db = require('orm').db;

var Roles = db.define('roles', {
    id: {type: 'serial', key: true},
    name: {type: 'text'},
    notes: {type: 'text'}
}, {
    methods: {
        getName: function() {
            return this.name;
        }
    }
});
