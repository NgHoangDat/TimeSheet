angular.module('timesheet', []);

var host = "http://10.11.40.52:3000/";

angular.module('timesheet', ['ngRoute']).config(function ($routeProvider) {
    $routeProvider
        .when('/', {
            resolve: {
                "redirect": function ($window, $location) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    console.log(session)
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
                    var session = $window.localStorage.getItem('timesheet_user_session')
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
            controller: 'loginCtrl',
            templateUrl: 'views/login.html'
        })
        .when('/user', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');
                }
            },
            controller: 'userTimesheetCtrl',
            templateUrl: 'views/user-timesheet.html'
        })
        .when('/user/timesheet', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');
                }
            },
            controller: 'userTimesheetCtrl',
            templateUrl: 'views/user-timesheet.html'
        })
        .when('/user/info', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');
                }
            },
            controller: 'userInfoCtrl',
            templateUrl: 'views/user-info.html'
        })
        .when('/user/approve_request', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'userApproveRequestCtrl',
            templateUrl: 'views/user-approve-request.html'
        })
        .when('/user/change_password', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'userChangePasswordCtrl',
            templateUrl: 'views/user-password-change.html'
        })
        .when('/admin', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'userManageCtrl',
            templateUrl: 'views/admin-manage-user.html'
        })
        .when('/admin/manage_users', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'userManageCtrl',
            templateUrl: 'views/admin-manage-user.html'
        })
        .when('/admin/manage_projects', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'projectManageCtrl',
            templateUrl: 'views/admin-manage-project.html'
        })
        .when('/admin/manage_timesheets', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'timesheetManageCtrl',
            templateUrl: 'views/admin-manage-timesheet.html'
        })
        .when('/admin/manage_approvers', {
            resolve: {
                "check": function ($window, $location, $rootScope) {
                    var session = $window.localStorage.getItem('timesheet_user_session');
                    if (session == null) $location.path('/login');

                }
            },
            controller: 'approverManageCtrl',
            templateUrl: 'views/admin-manage-approver.html'
        })
        .otherwise({
            redirectTo: '/error'
        })
})

angular.module('timesheet').controller('loginCtrl', function ($scope, $http, $location, $window) {
    $scope.submit = () => {
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
                $window.localStorage.setItem('timesheet_user_session', JSON.stringify(session));
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
})

/*angular.module('timesheet').controller('sidebarCtrl', function ($scope, $http, $location, $window) {
    var session = $window.localStorage.getItem('timesheet_user_session');
    console.log(session);
    if (session != null) {
        console.log(session.type);
        switch (session.type) {
            case 'admin':
                $scope.funcs = [{
                    text: 'Timesheet',
                    href: '#!/user/timesheet'
                }, {
                    text: 'Thông tin tài khoản',
                    href: '#!/user/info'
                }, {
                    text: 'Yêu cầu xác nhận',
                    href: '#!/user/approve_request'
                }];
                break;
            case 'user':
                $scope.funcs = [{
                    text: 'Quản lý người dùng',
                    href: '#!/admin/manage_users'
                }, {
                    text: 'Quản lý dự án',
                    href: '#!/admin/manage_projects'
                }, {
                    text: 'Quản lý timesheet',
                    href: '#!/admin/manage_timesheets'
                }, {
                    text: 'Quản lý approver',
                    href: '#!/admin/manage_approvers'
                }];
                break;
            default:
                $scope.funcs = [];
                break;
        }
        $scope.showLogoutOption = true;
    } else {
        $scope.funcs = [];
        $scope.showLogoutOption = false;
    }
    $scope.logout = () => {
        $http({
            method: "DELETE",
            url: "/employees/sessions",
            headers: {
                token: session.token
            }
        }).then(function successCallback(response) {
            $window.localStorage.removeItem('timesheet_user_session')
            $location.path('/')
        }, function errorCallback(response) {

        })
    }
})*/

angular.module('timesheet').controller('mainCtrl', function ($scope, $http) {
    $scope.logout = () => {
        
    }
})
