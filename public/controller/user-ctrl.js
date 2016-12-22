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
        url: '/projects/get_all_projects'
    }).then(function successCallback(response) {
        $scope.allProjects = response.data.message;
        console.log(response)
    }, function errorCallback(response) {

    })

    //Lay danh sach cac timesheet
    $http({
        method: 'GET',
        url: '/timesheets/' + session.id,
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        console.log(response)
        $scope.timesheets = response.data.message;
        for (var i in $scope.timesheets) {
            $scope.timesheets[i].project_name = $scope.allProjects.find((e) => {
                return e.id == $scope.timesheets[i].project_id;
            }).name;
        }
    }, function errorCallback(response) {

    })

    //
    $scope.add = () => {
        ngDialog.open({
            template: 'views/user-timesheet-add.html',
            className: 'ngdialog-theme-default',
            width: 460,
            height: 450,
            controller: 'userTimesheetAddCtrl',
            scope: $scope,
            data: {
                projects: $scope.allProjects,
                user_id: session.id,
                token: session.token
            }
        })
    }

})


angular.module('timesheet').controller('userTimesheetAddCtrl', function ($scope, $window, $http, $location) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    $scope.projects = $scope.ngDialogData.projects;
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
        }, function errorCallback(response) {

        })


    }
})

angular.module('timesheet').controller('userTimesheetEditCtrl', function ($scope, $rootScope, $http, $location) {

    //Object luu lai du lieu goc
    var old = {};

    //request du lieu timesheet can chinh sua
    $http({
        method: 'POST',
        url: ''
    }).then(function successCallback(response) {

    }, function errorCallback(response) {

    })

    //request danh sach cac du an
    $http({
        method: 'POST',
        url: ''
    }), then(function successCallback(response) {

    }, function errorCallback(response) {

    })

    $scope.getMaxTotalTime = () => {
        var timeLength = Date.parse($scope.input.date + ', ' + $scope.input.endTime) - Date.parse($scope.input.date + ', ' + $scope.input.startTime);
        var time = new Date(timeLength);
        var hour = time.getHours();
        var minute = time.getMinutes();
        return parseFloat((hour + minute / 60).toFixed(2));
    }

    $scope.cancel = () => {
        window.history.back();
    }

    $scope.saveChange = () => {
        $http({
            method: 'POST',
            url: ''
        }).then(function successCallback(response) {

        }, function errorCallback(response) {

        })
    }

})

angular.module('timesheet').controller('userApproveRequestCtrl', function ($scope, $rootScope, $http, $location) {

})

angular.module('timesheet').controller('userApproveRequestEditCtrl', function ($scope, $rootScope, $http, $location) {

})