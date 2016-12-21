var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
//    env = process.env.NODE_ENV ||
    env = 'development';
1234
var config = {
  development: {
    root: rootPath,
    app: {
      name: 'timesheet'
    },
    port: 3000,
    db: 'mysql://root:vubinhne@localhost:3306/timesheet'
  },

  test: {
    root: rootPath,
    app: {
      name: 'timesheet'
    },
    port: 3000,
    db: 'mysql://root@localhost/timesheet_test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'timesheet'
    },
    port: 3000,
    db: 'mysql://root@localhost/timesheet_production'
  }
};

module.exports = config[env];
