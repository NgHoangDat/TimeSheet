var app = angular.module('timesheet', ['ngRoute', 'ngDialog']);
const session_name = 'timesheet_user_session';

function checkType($window, $location, $rootScope, type) {
    var session = JSON.parse($window.localStorage.getItem(session_name));
    if (session == null) $location.path('/login');
    else if (session.type != type) $location.path('/error')
    else $rootScope.type = type;
}
app.config(["ngDialogProvider", function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: "ngdialog-theme-default",
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
            console.log("closing dialog");
        }
    });
}]);
app.config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            resolve: {
                "redirect": function ($window, $location) {
                    var session = JSON.parse($window.localStorage.getItem(session_name));
                    if (session == null) $location.path('/login');
                    switch (session.type) {
                        case 'admin':
                            $location.path('/admin')
                            break;
                        case 'user':
                            $location.path('/user')
                            break;
                        default:
                            $location.path('/error')
                            break;
                    }

                }
            },
            templateUrl: 'views/access-error.html'
        })
        .when('/error', {
            templateUrl: 'views/access-error.html'
        })
        .when('/login', {
            resolve: {
                "check": function ($window, $location) {
                    var session = JSON.parse($window.localStorage.getItem(session_name))
                    if (session != null) {
                        switch (session.type) {
                            case 'admin':
                                $location.path('/admin')
                                break;
                            case 'user':
                                $location.path('/user')
                                break;
                            default:
                                $location.path('/error')
                                break;
                        }
                    }
                }
            },
            controller : 'logCtrl',
            templateUrl: 'views/login.html'
        })
        .when('/user', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'user');
                }
            },
            controller: 'userTimesheetCtrl',
            templateUrl: 'views/user-timesheet.html'
        })
        .when('/user/timesheet', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'user');
                }
            },
            controller: 'userTimesheetCtrl',
            templateUrl: 'views/user-timesheet.html'
        })
        .when('/user/info', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'user');
                }
            },
            controller: 'userInfoCtrl',
            templateUrl: 'views/user-info.html'
        })
        .when('/user/approve_request', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'user');
                }
            },
            controller: 'userApproveRequestCtrl',
            templateUrl: 'views/user-approve-request.html'
        })
        .when('/admin', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'admin')
                }
            },
            controller: 'userManageCtrl',
            templateUrl: 'views/admin-manage-user.html'
        })
        .when('/admin/manage_users', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'admin')
                }
            },
            controller: 'userManageCtrl',
            templateUrl: 'views/admin-manage-user.html'
        })
        .when('/admin/manage_projects', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'admin')
                }
            },
            controller: 'projectManageCtrl',
            templateUrl: 'views/admin-manage-project.html'
        })
        .when('/admin/manage_timesheets', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'admin')
                }
            },
            controller: 'timesheetManageCtrl',
            templateUrl: 'views/admin-manage-timesheet.html'
        })
        .when('/admin/manage_approvers', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    checkType($window, $location, $rootScope, 'admin')
                }
            },
            controller: 'approverManageCtrl',
            templateUrl: 'views/admin-manage-approver.html'
        })
        .otherwise({
            redirectTo: '/error'
        })
})

angular.module('timesheet').controller('logCtrl', function ($scope, $http, $location, $window, $rootScope) {
    $scope.login = () => { 
        $http({
            method: 'POST',
            url: 'employees/sessions',
            data: {
                "username": $scope.email,
                "password": $scope.password
            }
        }).then(function successCallback(response) {
            console.log(response);
            if (response.data.message.constructor != Object) {
                alert(response.data.message);
                $scope.email = '';
                $scope.password = '';
            } else {
                var session = {
                    id: response.data.message.id,
                    type: response.data.message.type,
                    token: response.data.message.token
                }
                $window.localStorage.setItem(session_name, JSON.stringify(session));
                $rootScope.type = session.type;
                switch (session.type) {
                    case 'admin':
                        $location.path('/admin')
                        break;
                    case 'user':
                        $location.path('/user')
                        break;
                    default:
                        $location.path('/error')
                        break;
                }
            }
        }, function errorCallback(response) {

        });
    }
    $scope.logout = () => {
        var session = JSON.parse($window.localStorage.getItem(session_name));
        if(confirm('Bạn chắc chắn muốn đăng xuất ?')) {
            $http({
                method : 'DELETE',
                url : '/employees/sessions',
                headers : {
                    token : session.token
                } 
            }).then ( function successCallback (response) {
                console.log(response)
                $window.localStorage.removeItem(session_name)
                $rootScope.type = null
                $location.path('/login')
            }, function errorCallback (response) {
                console.log(response)
            })
        }
    }
})

angular.module('timesheet').controller('mainCtrl', function ($rootScope, $interval) {
    
})