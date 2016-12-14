var db = require('orm').db;
var Timesheets = db.models.timesheets;

var TimesheetController = {};

TimesheetController.create_timesheet = function(req, res) {
    
    var newTimesheet = {};
    newTimesheet.employee_id = req.body.employee_id;
    newTimesheet.project_id = req.body.project_id;
    newTimesheet.description = req.body.description;
    newTimesheet.working_date = req.body.working_date;
    newTimesheet.start_time = req.body.start_time;
    newTimesheet.end_time = req.body.end_time;
    newTimesheet.working_hours = req.body.working_hours;
    newTimesheet.efficiency = req.body.efficiency;
    newTimesheet.notes = req.body.notes;

    Timesheets.create(newTimesheet, function(err, timesheet) {
        
        if (err) {
            res.json({status: "error", message: err});
            return;
        }    

        res.json({status: "success", message: "create new timesheet success!"});
    });
}    

TimesheetController.update_timesheet = function(req, res) {
    
    Timesheets.one({id: req.body.id}, function(err, timesheet) { 

        if (err) {
            res.json({status: "error", message: err});
            return;
        }

        if (timesheet) {
            timesheet.employee_id = req.body.employee_id;
            timesheet.project_id = req.body.project_id;
            timesheet.description = req.body.description;
            timesheet.working_date = req.body.working_date;
            timesheet.start_time = req.body.start_time;
            timesheet.end_time = req.body.end_time;
            timesheet.working_hours = req.body.working_hours;
            timesheet.efficiency = req.body.efficiency;            
            timesheet.notes = req.body.notes;
            
            timesheet.save(function(err) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                } 
                res.json({status: "success", message: "Update timesheet success!"});
            });
            
        } else {
            res.json({ status: "success", message: "Not found any timesheet with id: " + req.body.id});
        }
        
    });
}

TimesheetController.get_timesheets_by_user_id = function(req, res) {

    var user_id = req.params.user_id;
    Timesheets.find({employee_id: user_id}, function(err, timesheets){
        if (err) {
            res.json({status: "error", message: err});
            return;
        }
        if (timesheets.length > 0) {
            res.json({
                status: "success",
                message: timesheets
            });
        } else {
            res.json({ status: "success", message: "Not found any timesheet of user_id: " + user_id});
        }
    });
}


module.exports = TimesheetController;
