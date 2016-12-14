var db = require('orm').db;
var AdminController = {};
var Employees = db.models.employees;
var Projects = db.models.projects;
var Approvers= db.models.approvers;
var Employees_Projects = db.models.employees_projects;

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
            res.json({ status: "error", message: err });
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

    Projects.create(newProject, function(err, project) {
        if (err) {
            res.json({status: "error", message: err});
            return;
        }
        
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
                    returna
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
