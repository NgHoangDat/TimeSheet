var db = require('orm').db;
var orm = require('orm');
var AdminController = {};
var Employees = db.models.employees;
var Projects = db.models.projects;
var Approvers= db.models.approvers;
var Employees_Projects = db.models.employees_projects;
var Timesheets = db.models.timesheets;
var Approves = db.models.approves;

var async = require('async');

var DEFAULT_ACCOUNT_SEX = 1;
var DEFAULT_ACCOUnT_NAME = "NAME";
var DEFAULT_ACCOUNT_PHONE = "0000000000";
var DEFAULT_ACCOUNT_ROLE_ID = 2; // nhan vien binh thuong, khong phai admins
var DEFAULT_ACCOUNT_NOTES = "NOTE: ~:>"


AdminController.create_account = function(req, res) {

    var newAccount = {};
    newAccount.email = req.body.email;
    newAccount.password = req.body.password;
    // Default params;
    newAccount.sex = DEFAULT_ACCOUNT_SEX;
    newAccount.name = DEFAULT_ACCOUnT_NAME;
    newAccount.phone = DEFAULT_ACCOUNT_PHONE;
    newAccount.role_id = DEFAULT_ACCOUNT_ROLE_ID;
    newAccount.notes = DEFAULT_ACCOUNT_NOTES;

    Employees.create(newAccount, function(err, employee){
        if(err) {
            res.json({ status: "error", message: err});
            return;
        }
        res.json({ status: "success", message: "Create new account success!"});
    });
}

AdminController.create_project = function(req, res) {

    var newProject = {};
    newProject.name = req.body.name;
    newProject.description = req.body.description;
    newProject.leader_id = req.body.leader_id;
    newProject.notes = req.body.notes;

    console.log(newProject);

    async.waterfall([
        function(callback) {
            Projects.create(newProject, function(err, project) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }
                callback(null, project);
            });
        },
        function(project, callback) {
            emp_prj = {};
            emp_prj.employee_id = project.leader_id;
            emp_prj.project_id = project.id;
            Employees_Projects.create(emp_prj, function(err, employee_project) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }
                callback(null);
            });
        }
    ], function(err) {
        res.json({ status: "success", message: "Create new project success!"});
    });

}

AdminController.restore_password = function(req, res) {

    var email = req.body.email;
    var new_password = req.body.new_password;

    Employees.one({email: email}, function(err, employee) {
        if (err) {
            res.json({status: "error", message: err});
            return;
        }
        if (employee) {
            employee.password = new_password;
            employee.save(function(err) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }
                res.json({status: "success", message: "Restore password success!"});
            });
        } else {
            res.json({ status: "success", message: "Not found employee with email: " + email});
        }
    });
}

AdminController.assign_approver = function(req, res) {

    var newApprover = {};
    newApprover.approver_id = req.body.approver_id;
    newApprover.employee_id = req.body.employee_id;
    newApprover.project_id = req.body.project_id;
    newApprover.notes = req.body.notes;

    Approvers.create(newApprover, function(err, approver) {
        if (err) {
            res.json({status: "error", message: err});
            return;
        }
        res.json({ status: "success", message: "Assign approver success!"});

    });
}

AdminController.assign_project = function(req, res) {

    var newEmployeesProjects = {};
    newEmployeesProjects.employee_id = req.body.employee_id;
    newEmployeesProjects.project_id = req.body.project_id;
    newEmployeesProjects.notes = req.body.notes;

    Employees_Projects.create(newEmployeesProjects, function(err, employee_project){
        if (err) {
            res.json({status: "error", message: err});
            return;
        }
        res.json({ status: "success", message: "Assign project success!"});

    });
}

AdminController.output_between_two_date = function(req, res) {

    var start_date = req.body.start_date;
    var end_date = req.body.end_date;
    var admin_id = req.headers.id;

    console.log(start_date);
    console.log(end_date);

    st_date = new Date(Date.parse(start_date));
    en_date = new Date(Date.parse(end_date));

    Timesheets.find({working_date: orm.between(st_date, en_date)}, function(err, timesheets) {
        if (err) {
            res.json({status: "error", message: err});
            return;
        }

        var res_timesheets = [];
        var employee_ids = [];
        console.log(JSON.parse(JSON.stringify(timesheets)));

        async.forEach(timesheets, function(timesheet, callback) {
            var timesheet_id = timesheet.id;
            Approves.count({timesheet_id: timesheet_id, approver_id: admin_id}, function(err, admin_approve_count) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }

                if (admin_approve_count > 0) {
                    var employee_id = timesheet.employee_id;
                    console.log("employee_id " + employee_id);
                    console.log(employee_ids);
                    if (employee_ids.indexOf(employee_id) != -1) {
                        var index = employee_ids.indexOf(employee_id);
                        var ts = res_timesheets[index];
                        res_timesheets[index].time_sum = ts.time_sum + timesheet.working_hours;
                        res_timesheets[index].sum_efficiency = ts.sum_efficiency + timesheet.efficiency*timesheet.working_hours;
                        res_timesheets[index].avg_efficiency = res_timesheets[index].sum_efficiency/res_timesheets[index].time_sum;
                        res_timesheets[index].num_timesheets = res_timesheets[index].num_timesheets + 1;
                        //res_timesheets.push(ts);
                        console.log('a');
                        console.log(res_timesheets[index]);
                    } else {
                        employee_ids.push(employee_id);
                        var index = employee_ids.indexOf(employee_id);
                        var ts = {};
                        ts.time_sum = timesheet.working_hours;
                        ts.sum_efficiency = timesheet.efficiency * timesheet.working_hours;
                        ts.avg_efficiency = ts.sum_efficiency /timesheet.working_hours;
                        ts.employee_id = timesheet.employee_id;
                        ts.project_id = timesheet.project_id;
                        ts.num_timesheets = 1;
                        res_timesheets[index] = ts;
                        console.log('b');
                    }
                    callback();
                } else {
                    callback();
                }
            });
        }, function(err) {
            if (err) {
                res.json({status: "error", message: err});
                return;
            }

            res_outputs = [];
            async.forEach(res_timesheets, function(res_timesheet, callback) {
                async.waterfall([
                    function(callback) {
                        var employee_id = res_timesheet.employee_id;
                        Employees.one({id: employee_id}, function(err, employee) {
                            if (err) {
                                res.json({status: "error", message: err});
                                return;
                            }

                            res_timesheet.employee_name = employee.name;
                            callback(null);
                        });
                    },
                    function(callback) {
                        var project_id = res_timesheet.project_id;
                        Projects.one({id: project_id}, function(err, project) {
                            if (err) {
                                res.json({status: "error", message: err});
                                return;
                            }
                            res_timesheet.project_name = project.name;
                            callback(null, res_timesheet);
                        });
                    }
                ], function(err, res_timesheet) {
                    if (err) {
                        res.json({status: "error", message: err});
                        return;
                    }

                    res_outputs.push(res_timesheet);
                    callback();
                });
            }, function(err) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }

                res.json({
                    status: "success",
                    message: res_outputs
                });
            });


        });

    });



}

/*
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
*/

module.exports = AdminController;
