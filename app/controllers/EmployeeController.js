var db = require('orm').db;
var hat = require('hat');
var Employees = db.models.employees;
var Roles = db.models.roles;
var EmployeeController = {};
var async = require('async');

EmployeeController.login = function(req, res){

    var username = req.body.username;
    var password = req.body.password;

    // console.log(req);

    console.log(username);
    console.log(password);

    Employees.find({email: username}, function(err, employees){
        if(err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (employees[0] && employees[0].password == password) {
            var role_id = employees[0].role_id;
            Roles.one({id: role_id}, function(err, role) {
                if(err) {
                    res.json({ status: "error", message: err });
                    return;
                }

                if (role) {
                    var token = hat();
                    employees[0].token = token;
                    employees[0].save(function(err) {
                        if(err) {
                            res.json({ status: "error", message: err });
                            return;
                        }
                    })

                    res.json({
                        status: "success",
                        message: {
                            id: employees[0].id,
                            type: role.name,
                            token: token
                        }
                    });
                } else {
                    res.json({
                        status: "success",
                        message: "error when query table roles"
                    });
                }
            });
        } else {
            res.json({
                status: "success",
                message: "Wrong password or username"
            });
        }

    });
};

EmployeeController.logout = function(req, res) {
    Employees.one({token: req.headers.token}, function(err, employee) {
        if(err) {
            res.json({ status: "error", message: err });
            return;
        }

        if (employee) {
            employee.token = null;
            employee.save(function(err) {
                if(err) {
                    res.json({ status: "error", message: err });
                    return;
                }
                res.json({ status: "success", message: "Log out success!"});
            });
        } else {
            res.json({ status: "success", message: "Not found employee with token " + req.headers.token});
        }
    });
};

EmployeeController.modify_account = function(req, res) {
    Employees.one({token: req.headers.token}, function(err, employee) {
        if(err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (employee) {
            employee.name = req.body.name;
            employee.sex = req.body.sex;
            employee.email = req.body.email;
            employee.phone = req.body.phone;
            employee.notes = req.body.notes;
            employee.save(function(err) {
                if (err) {
                    res.json({ status: "error", message: err });
                    return;
                }
                res.json({ status: "success", message: "Modify account success!"});
            })
        } else {
            res.json({ status: "success", message: "Not found employee with token " + req.headers.token});
        }
    });
};

EmployeeController.info = function(req, res) {
    Employees.one({token: req.headers.token}, function(err, employee) {
        if(err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (employee) {
            res.json({
                status: "success",
                message: employee
            });
        } else {
            res.json({ status: "success", message: "Not found employee with token " + req.headers.token});
        }
    });
};

EmployeeController.change_password = function(req, res) {
    Employees.one({token: req.headers.token}, function(err, employee) {
        if(err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (employee && req.body.old_password == employee.password) {
            employee.password = req.body.new_password;
            employee.save(function(err) {
                if (err) {
                    res.json({ status: "error", message: err });
                    return;
                }

                res.json({
                    status: "success",
                    message: "Password has changed!"
                });
            });
        } else {
            res.json({ status: "success", message: "Wrong current password or token"});
        }
    });
};

EmployeeController.get_all_employees = function(req, res) {

    Employees.all(function(err, employees) {
        if (err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (employees.length > 0) {
            var emps = [];
            async.forEach(employees, function(employee, callback){
//                delete employee["password"];
                employee.password = undefined;
                employee = JSON.parse(JSON.stringify(employee));
                emps.push(employee);
                console.log(employee);
                callback();
            }, function(err){
                if (err) {
                    res.json({ status: "error", message: err });
                    return;
                }
                res.json({
                    status: "success",
                    message: emps
                });
            });

        } else {
            res.json({status: "success", message: "Not found any employee!"})
        }
    });

}

module.exports = EmployeeController;
