angular.module('timesheet').controller('userInfoCtrl', function ($scope, $http, $window, $location) {
    //Gui request de lay thong tin ng dung
    var session = $window.localStorage.getItem('timesheet_user_session');
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
        var data = response.data.message;
        ori_info = {
            name: data.name,
            sex: data.sex,
            email: data.email,
            phone: data.phone,
            role: data.role
        }
        $scope.info = {
            name: data.name,
            sex: data.sex,
            email: data.email,
            phone: data.phone,
            role: data.role
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
            role: ori_info.role
        }
    }
    $scope.saveChange = () => {
        $http({
            method: 'PATCH',
            url: '/employees/modify_account',
            headers: {
                "token": session.token
            },
            body: {
                "name": $scope.info.name,
                "sex": $scope.info.sex,
                "email": $scope.info.email,
                "phone": $scope.info.phone,
            }
        }).then(function successCallback(response) {

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
            body: {
                "old_password": $scope.old,
                "new_password": $scope.new
            }
        }).then(function successCallback(response) {

        }, function errorCallback(response) {

        })
    }
})

/*angular.module('timesheet').controller('userPasswordCtrl', function ($scope, $http, $window) {
    var session = $window.localStorage.getItem('timesheet_user_session');
    $http({
        method: 'POST',
        url: '/employees/change_password',
        headers: {
            "token": session.token
        },
        body: {
            "old_password": $scope.old,
            "new_password": $scope.new
        }
    }).then(function successCallback(response) {

    }, function errorCallback(response) {

    })
})*/

angular.module('timesheet').controller('userTimesheetCtrl', function ($scope, $http, $window, $location) {
    var session = $window.localStorage.getItem('timesheet_user_session')

    //Lay danh sach cac du an
    $http({
        method : 'GET',
        url : '/projects/get_all_projects'
    }).then( function successCallback (response) {
        $scope.allProjects = response.data.message;
    }, function errorCallback (response) {

    })

    //Lay danh sach cac timesheet
    $http({
        method: 'GET',
        url: '/timesheets',
        params: {
            user_id: session.id
        }
    }).then(function successCallback(response) {
        $scope.timesheets = response.data.message;
    }, function errorCallback(response) {

    })
    
    //
    for(var i in $scope.timesheets) {
        $scope.timesheets[i].project = $scope.allProjects.find((e) => {
            return e.id == $scope.timesheets[i].project_id;
        }).getName();
    }

})

angular.module('timesheet').controller('userTimesheetAddCtrl', function ($scope, $window, $http, $location) {

    var session = $window.localStorage.getItem('timesheet_user_session')
        //request danh sach cac du an tu database
    $http({
        method: 'GET',
        url: '/projects/get_all_projects',
        headers: {
            "token": session.token
        },
        body: {

        }
    }).then(function successCallback(response) {


    }, function errorCallback(response) {


    })

    $scope.input = {
        date: '',
        project: '',
        startTime: '',
        endTime: '',
        totalTime: '',
        performance: '',
        task: ''
    }

    $scope.input.date = '';
    $scope.input.startTime = '';
    $scope.input.endTime = '';
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

    $scope.submit = () => {
        $http({
            method: 'POST',
            url: '/timesheets',
            headers: {
                "token": session.token
            },
            body: {

            }
        }).then(function successCallback(response) {

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