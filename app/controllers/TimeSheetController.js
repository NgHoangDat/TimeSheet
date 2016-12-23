var db = require('orm').db;
var Timesheets = db.models.timesheets;
var Approves = db.models.approves;
var Approvers = db.models.approvers;
var Employees = db.models.employees;

var TimesheetController = {};
var async = require('async');


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
            res_timesheets = [];
            async.forEach(timesheets, function(timesheet, callback) {
                var timesheet_id = timesheet.id;
                Approves.find({timesheet_id: timesheet_id}, function(err, approves){
                    if (err) {
                        res.json({status: "error", message: err});
                        return;
                    }
                    if (approves.length == 0) {
                        timesheet.is_approved = false;
                    } else {
                        timesheet.id_approved = true;
                    }

                    timesheet = JSON.parse(JSON.stringify(timesheet));
                    res_timesheets.push(timesheet);
                    callback();
                });

            }, function(err) {
                res.json({
                    status: "success",
                    message: res_timesheets
                });
            });


        } else {
            res.json({ status: "success", message: "Not found any timesheet of user_id: " + user_id});
        }
    });
}


TimesheetController.get_unapprove_timesheets = function(req, res) {
    Timesheets.all(function(err, timesheets) {
        if (err) {
            res.json({status: "error", message: err});
            return;
        }
        if (timesheets.length > 0) {

            var unapprove_timesheets = [];

            async.forEach(timesheets, function(timesheet, callback) {
                var timesheet_id = timesheet.id;

                Approves.find({timesheet_id: timesheet_id}, function(err, approves){
                    if (err) {
                        res.json({status: "error", message: err});
                        return;
                    }

                    if (approves.length == 0) {
                        unapprove_timesheets.push(timesheet);
                    }
                    callback();
                });
            }, function(err) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }
                res.json({
                    status: "success",
                    message: unapprove_timesheets
                });

            });

        } else {
            res.json({ status: "success", message: "Not found any timesheet"});
        }

    })
}

TimesheetController.get_unapprove_timesheets_by_approver_id = function(req, res) {
    var approver_id = req.params.approver_id;

    async.waterfall([
        function(callback) {
            Approvers.find({approver_id: approver_id}, function(err, approvers) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }

                callback(null, approvers);
            });
        }
    ], function(err, approvers) {
        if (approvers.length > 0) {
            res_timesheets = [];
            async.forEach(approvers, function(approver, callback) {
                var employee_id = approver.employee_id;

                async.waterfall([
                    function(callback) {
                        Timesheets.find({employee_id: employee_id}, function(err, timesheets) {
                            if (err) {
                                res.json({status: "error", message: err});
                                return;
                            }
                            callback(null, timesheets);
                        });
                    }
                ], function(err, timesheets) {
                    async.forEach(timesheets, function(timesheet, callback) {
                        var timesheet_id = timesheet.id;

                        Approves.find({timesheet_id: timesheet_id}, function(err, approves){
                            if (err) {
                                res.json({status: "error", message: err});
                                return;
                            }
                            if (approves.length == 0) {
                                Employees.one({id: employee_id}, function(err, employee) {
                                    if (err) {
                                        res.json({status: "error", message: err});
                                        return;
                                    }
                                    if (employee) {
                                        timesheet.employee_name = employee.name;
                                        timesheet.employee_email = employee.email;

                                        timesheet = JSON.parse(JSON.stringify(timesheet));
                                        res_timesheets.push(timesheet);
                                    } else {
                                        res.json({status: "error", message: "Not found employee"});
                                        return;
                                    }
                                    callback();
                                });
                            } else {
                                callback();
                            }
                        });
                    }, function(err){
                        if (err) {
                            res.json({status: "error", message: err});
                            return;
                        }
                        callback();
                    });
                });

            }, function(err) {
                if (err) {
                    res.json({status: "error", message: err});
                    return;
                }

                res.json({
                    status: "success",
                    message: res_timesheets
                });
            });

        } else {
            console.log("Not found any approver!");
            res.json({ status: "success", message: []});
        }
    });

}


module.exports = TimesheetController;
