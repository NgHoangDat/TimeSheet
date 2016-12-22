var db = require('orm').db;
var ApproverController = {};
var async = require('async');
var Approves = db.models.approves;
var Approvers = db.models.approvers;
var Employees = db.models.employees;

ApproverController.approve = function(req, res) {

    var newApprove= {};
    newApprove.approver_id = req.body.approver_id;
    newApprove.timesheet_id = req.body.timesheet_id;
    newApprove.working_hours = req.body.working_hours;
    newApprove.efficiency = req.body.efficiency;
    newApprove.notes = req.body.efficiency;

    Approves.create(newApprove, function(err, approve) {
        if (err) {
            res.json({ status: "error", message: err });
            return;
        }

        res.json({ status: "success", message: "Approve success!"});
    });
}

ApproverController.get_all_approver = function(req, res) {

    Approvers.all(function(err, approvers) {
        if (err) {
            res.json({ status: "error", message: err });
            return;
        }

        var all_approvers = [];
        var approver_ids = [];
        async.forEach(approvers, function(approver, callback){

            var approver_id = approver.approver_id;
            Employees.one({id: approver_id}, function(err, employee) {
                if (err) {
                    res.json({ status: "error", message: err });
                    return;
                }

                employee.password = undefined;
                employee.token = undefined;
                employee = JSON.parse(JSON.stringify(employee));

                if (!(approver_id in approver_ids)) {
                    approver_ids.push(approver_id);
                    all_approvers.push(employee);
                }

                callback();
            });

        }, function(err) {
            if (err) {
                res.json({ status: "error", message: err });
                return;
            }
            res.json({
                status: "success",
                message: all_approvers
            });
        });

    });
}

ApproverController.get_approve_record_by_timesheet_id = function(req, res) {

    Approves.find({timesheet_id: req.params.timesheet_id}, function(err, approves){
        if (err) {
            res.json({ status: "error", message: err });
            return;
        }

        var records = [];

        async.forEach(approves, function(approve, callback) {

            var approver_id = approve.approver_id;
            approve.approver_id = undefined;

            Employees.one({id: approver_id}, function(err, approver) {
                if (err) {
                    res.json({ status: "error", message: err });
                    return;
                }

                approver.password = undefined;
                approver.token = undefined;
                approver = JSON.parse(JSON.stringify(approver));

                approve.approver = approver;
                approve = JSON.parse(JSON.stringify(approve));
                records.push(approve);
                callback();
            });

        }, function(err) {
            if (err) {
                res.json({ status: "error", message: err });
                return;
            }

            res.json({
                status: "success",
                message: records
            });

        });

    });

}

module.exports = ApproverController;
