angular.module('timesheet').controller('userInfoCtrl', function ($scope, $http, $window, $location) {
    //Gui request de lay thong tin ng dung
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'));
    var ori_info = {}; //luu thong tin goc
    $scope.info = {};
    $http({
        method: 'GET',
        url: '/employees/info',
        headers: {
            "token": session.token
        }
    }).then(function successCallback(response) {
        //dua thong tin vao info roi $scope.info
        console.log(response)
        var data = response.data.message;
        ori_info = {
            name: data.name,
            sex: data.sex,
            email: data.email,
            phone: data.phone,
        }
        $scope.info = {
            name: data.name,
            sex: (data.sex == 1) ? "male" : "female",
            email: data.email,
            phone: data.phone,
        }
    }, function errorCallback(response) {
        //do something
    })
    $scope.cancel = () => {
        $scope.info = {
            name: ori_info.name,
            sex: ori_info.sex,
            email: ori_info.email,
            phone: ori_info.phone,
        }
    }
    $scope.saveChange = () => {
        $http({
            method: 'PATCH',
            url: '/employees/modify_account',
            headers: {
                "token": session.token
            },
            data: {
                "name": $scope.info.name,
                "sex": ($scope.info.sex == "male") ? 1 : 0,
                "email": $scope.info.email,
                "phone": $scope.info.phone,
            }
        }).then(function successCallback(response) {
            console.log(response)
        }, function errorCallback(response) {

        })
    }

    $scope.cancelPasswordChange = () => {
        $scope.old = '';
        $scope.new = '';
    }

    $scope.savePasswordChange = () => {
        $http({
            method: 'POST',
            url: '/employees/change_password',
            headers: {
                "token": session.token
            },
            data: {
                "old_password": $scope.old,
                "new_password": $scope.new
            }
        }).then(function successCallback(response) {

        }, function errorCallback(response) {

        })
    }
})

angular.module('timesheet').controller('userTimesheetCtrl', function ($scope, $http, $window, $location, ngDialog) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))

    //Lay danh sach cac du an
    $http({
        method: 'GET',
        url: '/employees/get_projects_by_user_id/' + session.id,
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        $scope.allProjects = response.data.message;
        console.log(response)
    }, function errorCallback(response) {

    })

    //Lay danh sach cac timesheet
    $http({
        method: 'GET',
        url: '/timesheets/get_timesheets_by_user_id/' + session.id,
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        console.log(response)
        $scope.timesheets = response.data.message;
        $scope.waiting_timesheets = new Array();
        $scope.approved_timesheets = new Array();
        for (var i in $scope.timesheets) {
            $scope.timesheets[i].project_name = $scope.allProjects.find((e) => {
                return e.id == $scope.timesheets[i].project_id;
            }).name;
            $scope.timesheets[i].working_date = new Date($scope.timesheets[i].working_date).toDateString()
            if ($scope.timesheets[i].is_approved) $scope.approved_timesheets.push($scope.timesheets[i]);
            else $scope.waiting_timesheets.push($scope.timesheets[i]);

        }
        $scope.waiting_timesheets.sort((a, b) => {
            var d_a = Date.parse(a.working_date);
            var d_b = Date.parse(b.working_date);
            return d_a - d_b;
        })
        $scope.approved_timesheets.sort((a, b) => {
            var d_a = Date.parse(a.working_date);
            var d_b = Date.parse(b.working_date);
            return d_b - d_a;
        })
    }, function errorCallback(response) {
        console.log(response)
    })

    //
    $scope.add = () => {
        ngDialog.open({
            template: 'views/user-timesheet-detail.html',
            className: 'ngdialog-theme-default',
            width: 460,
            height: 450,
            controller: 'userTimesheetAddCtrl',
            scope: $scope,
            data: {
                header: 'Thêm timesheet mới',
                scope: $scope,
                projects: $scope.allProjects,
                user_id: session.id,
                token: session.token,
                button: "Gửi timesheet",
                isDisable: false
            }
        })
    }

    $scope.edit = (timesheet) => {
        ngDialog.open({
            template: 'views/user-timesheet-detail.html',
            className: 'ngdialog-theme-default',
            width: 460,
            height: 450,
            controller: 'userTimesheetEditCtrl',
            scope: $scope,
            data: {
                header: 'Sửa timesheet',
                projects: $scope.allProjects,
                user_id: session.id,
                token: session.token,
                timesheet: timesheet,
                button: "Cập nhật timesheet",
                isDisable: false
            }
        })
    }

    $scope.view = (timesheet) => {
        ngDialog.open({
            template: 'views/user-timesheet-detail.html',
            className: 'ngdialog-theme-default',
            width: 460,
            height: 450,
            controller: 'userTimesheetViewCtrl',
            scope: $scope,
            data: {
                header: 'Chi tiết timesheet',
                projects: $scope.allProjects,
                timesheet: timesheet,
                isDisable: true
            }
        })
    }

})

angular.module('timesheet').controller('userTimesheetAddCtrl', function ($scope, $window, $http, $location) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    $scope.projects = $scope.ngDialogData.projects;
    $scope.header = $scope.ngDialogData.header;
    $scope.button = $scope.ngDialogData.button;
    $scope.isDisable = $scope.ngDialogData.isDisable;
    $scope.input = {
        working_date: new Date(),
        project_id: '',
        project_name: '',
        start_time: '',
        end_time: '',
        working_hours: '',
        efficiency: 0,
        description: ''
    }

    $scope.setMaxTime = () => {
        console.log($scope.input.end_time);
        var timeLength = Date.parse($scope.input.end_time) - Date.parse($scope.input.start_time);
        if (isNaN(timeLength)) $scope.maxTime = 0;
        else {
            var time = new Date(timeLength);
            var hour = time.getHours();
            var minute = time.getMinutes();
            $scope.maxTime = parseFloat((hour + minute / 60).toFixed(2)) - 7;
        }
        $scope.input.working_hours = $scope.maxTime;
    }

    $scope.submit = () => {
        var working_date = new Date($scope.input.working_date);
        working_date = working_date.getFullYear() + '-' + (working_date.getMonth() + 1) + '-' + working_date.getDate();
        var start_time = new Date($scope.input.start_time);
        start_time = start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
        var end_time = new Date($scope.input.end_time);
        end_time = end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
        $http({
            method: 'POST',
            url: '/timesheets',
            headers: {
                "token": session.token
            },
            data: {
                employee_id: session.id,
                project_id: $scope.input.project_id,
                description: $scope.input.description,
                working_date: working_date,
                start_time: start_time,
                end_time: end_time,
                working_hours: $scope.input.working_hours,
                efficiency: $scope.input.efficiency,
                notes: ''
            }
        }).then(function successCallback(response) {
            console.log(response)
            if (response.data.status == 'success') {
                $scope.closeThisDialog();
            }
        }, function errorCallback(response) {

        })


    }
})

angular.module('timesheet').controller('userTimesheetEditCtrl', function ($scope, $window, $http, $location) {

    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    $scope.projects = $scope.ngDialogData.projects;
    $scope.header = $scope.ngDialogData.header;
    $scope.button = $scope.ngDialogData.button;
    $scope.isDisable = $scope.ngDialogData.isDisable;
    $scope.timesheet = $scope.ngDialogData.timesheet;
    $scope.input = {
        working_date: new Date(),
        project_id: $scope.timesheet.project_id.toString(),
        project_name: $scope.timesheet.project_name,
        start_time: new Date(new Date(0).toString().replace('07:00:00', $scope.timesheet.start_time)),
        end_time: new Date(new Date(0).toString().replace('07:00:00', $scope.timesheet.end_time)),
        working_hours: $scope.timesheet.working_hours,
        efficiency: $scope.timesheet.efficiency,
        description: $scope.timesheet.description
    }

    $scope.setMaxTime = () => {
        console.log($scope.input.end_time);
        var timeLength = Date.parse($scope.input.end_time) - Date.parse($scope.input.start_time);
        if (isNaN(timeLength)) $scope.maxTime = 0;
        else {
            var time = new Date(timeLength);
            var hour = time.getHours();
            var minute = time.getMinutes();
            $scope.maxTime = parseFloat((hour + minute / 60).toFixed(2)) - 7;
        }
        $scope.input.working_hours = $scope.maxTime;
    }

    $scope.submit = () => {
        var working_date = new Date($scope.input.working_date);
        working_date = working_date.getFullYear() + '-' + (working_date.getMonth() + 1) + '-' + working_date.getDate();
        var start_time = new Date($scope.input.start_time);
        start_time = start_time.getHours() + ':' + start_time.getMinutes() + ':' + start_time.getSeconds();
        var end_time = new Date($scope.input.end_time);
        end_time = end_time.getHours() + ':' + end_time.getMinutes() + ':' + end_time.getSeconds();
        $http({
            method: 'PATCH',
            url: '/timesheets',
            headers: {
                "token": session.token
            },
            data: {
                id: $scope.timesheet.id,
                employee_id: session.id,
                project_id: $scope.input.project_id,
                description: $scope.input.description,
                working_date: working_date,
                start_time: start_time,
                end_time: end_time,
                working_hours: $scope.input.working_hours,
                efficiency: $scope.input.efficiency,
                notes: ''
            }
        }).then(function successCallback(response) {
            console.log(response)
        }, function errorCallback(response) {

        })


    }
})

angular.module('timesheet').controller('userTimesheetViewCtrl', function ($scope) {
    $scope.projects = $scope.ngDialogData.projects;
    $scope.header = $scope.ngDialogData.header;
    $scope.isDisable = $scope.ngDialogData.isDisable;
    $scope.timesheet = $scope.ngDialogData.timesheet;
    $scope.input = {
        working_date: new Date(),
        project_id: $scope.timesheet.project_id.toString(),
        project_name: $scope.timesheet.project_name,
        start_time: new Date(new Date(0).toString().replace('07:00:00', $scope.timesheet.start_time)),
        end_time: new Date(new Date(0).toString().replace('07:00:00', $scope.timesheet.end_time)),
        working_hours: $scope.timesheet.working_hours,
        efficiency: $scope.timesheet.efficiency,
        description: $scope.timesheet.description
    }

})

angular.module('timesheet').controller('userApproveRequestCtrl', function ($scope, $window, $http, $location) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'));

    var allProjects = new Array();
    $http({
        method: 'GET',
        url: '/employees/get_projects_by_user_id/' + session.id,
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        if (response.data.message.constructor != String) allProjects = response.data.message;
    }, function errorCallback(response) {

    })

    var allUsers = new Array();
    $http({
        method: "GET",
        url: "/employees/get_all_employees",
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        allUsers = response.data.message;
    }, function errorCallback(response) {

    })

    $http({
        method: 'GET',
        url: '/get_unapprove_timesheets_by_approver_id/' + session.id
    }).then(function successCallback(response) {
        if (response.data.message.constructor != String) {
            $scope.waiting_timesheets = response.data.message;
            $scope.waiting_timesheets.forEach((timesheet) => {
                timesheet.project_name = allProjects.find((e) => {
                    return e.id == timesheet.project_id
                }).name;
                timesheet.employee_name = allUsers.find((e) => {
                    return e.id == timesheet.employee_id
                }).name;
                timesheet.working_date = new Date(timesheet.working_date).toDateString()
            })
        }
    }, function errorCallback(response) {

    })
})