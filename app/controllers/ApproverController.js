var db = require('orm').db;
var ApproverController = {};

var Approves = db.models.approves;

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

module.exports = ApproverController;
