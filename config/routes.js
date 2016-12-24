module.exports = function(app){

    //home route
    var home = require('../app/controllers/home');
    var EmployeeController = require('../app/controllers/EmployeeController');
    var AdminController = require('../app/controllers/AdminController.js');
    var ProjectController = require('../app/controllers/ProjectController.js');
    var TimesheetController = require('../app/controllers/TimeSheetController.js');
    var ApproverController = require('../app/controllers/ApproverController.js');

    app.get('/home', home.index);
    app.post('/employees/sessions', EmployeeController.login);
    app.delete('/employees/sessions', EmployeeController.logout);
    app.patch('/employees/modify_account', EmployeeController.modify_account);
    app.get('/employees/info', EmployeeController.info);
    app.get('/employees/get_info_by_user_id/:user_id', EmployeeController.get_info_by_user_id);
    app.post('/employees/change_password', EmployeeController.change_password);
    app.get('/employees/get_all_employees', EmployeeController.get_all_employees);
    app.get('/employees/get_projects_by_user_id/:user_id', EmployeeController.get_projects_by_user_id);

    app.post('/admins/create_account', AdminController.create_account);
    app.post('/admins/create_project', AdminController.create_project);
    app.post('/admins/restore_password', AdminController.restore_password);
    app.post('/admins/assign_approver', AdminController.assign_approver);
    app.post('/admins/assign_project', AdminController.assign_project);
    app.post('/admins/output', AdminController.output_between_two_date);
    app.get('/projects/get_all_projects', ProjectController.get_all_projects);
    app.post('/projects/get_employees', ProjectController.get_employees);

    app.post('/timesheets', TimesheetController.create_timesheet);
    app.patch('/timesheets', TimesheetController.update_timesheet);
    app.get('/timesheets/get_timesheets_by_user_id/:user_id', TimesheetController.get_timesheets_by_user_id);
    app.get('/get_unapprove_timesheets', TimesheetController.get_unapprove_timesheets);
    app.get('/get_unapprove_timesheets_by_approver_id/:approver_id', TimesheetController.get_unapprove_timesheets_by_approver_id);
    app.get('/timesheets/get_timesheets_havent_approved_by_admin', TimesheetController.get_timesheets_havent_approved_by_admin);

    app.post('/approvers/approve', ApproverController.approve);
    app.get('/approvers/get_all_approvers', ApproverController.get_all_approver);
    app.get('/approvers/get_approve_record/:timesheet_id', ApproverController.get_approve_record_by_timesheet_id);
    app.get('/approvers/get_all_records', ApproverController.get_all_records);


};
