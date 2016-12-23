var db = require('orm').db;
var Projects = db.models.projects;
var Employees_Projects = db.models.employees_projects;
var Employees = db.models.employees;
var async = require('async');

var ProjectController = {};

ProjectController.get_all_projects = function(req, res) {

    Projects.all(function(err, projects){
        if (err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (projects.length > 0) {
            res.json({
                status: "success",
                message: projects
            });
        } else {
            res.json({ status: "success", message: "Not found any project!" });
        }
    });

}

ProjectController.get_employees = function(req, res) {
    var project_id = req.body.project_id;

    Employees_Projects.find({project_id: project_id}, function(err, emp_prjs) {
        if (err) {
            res.json({ status: "error", message: err });
            return;
        }
        if (emp_prjs.length > 0) {
            var emps = [];
            async.forEach(emp_prjs, function(emp_prj, callback) {
                Employees.one({id: emp_prj.employee_id}, function(err, employee){
                    if (err) {
                        res.json({ status: "error", message: err });
                        return;
                    }
                    emps.push(employee);
                    callback();
                });
            }, function(err) {
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
            res.json({ status: "success", message: "Not found any employees!" });
        }
    });

}

module.exports = ProjectController;
