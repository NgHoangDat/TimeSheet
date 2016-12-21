angular.module('timesheet').controller('userManageCtrl', function ($scope, $window, $http, $location) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    $http({
        method: "GET",
        url: "/employees/get_all_employees",
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        $scope.users = response.data.message;
    }, function errorCallback(response) {

    })
    $scope.addNewUser = () => {
        if ($scope.email == undefined || $scope.password == undefined) alert('Bạn phải nhập email và mật khẩu cho người dùng mới')
        else {
            console.log('Tao tai khoan moi')
            console.log($scope.email)
            console.log($scope.password)
            $http({
                method: 'POST',
                url: '/admins/create_account',
                headers: {
                    token: session.token
                },
                data: {
                    email: $scope.email,
                    password: $scope.password
                }
            }).then(function successCallback(response) {
                console.log('Gui yeu cau thanh cong')
                console.log(response);
            }, function errorCallback(response) {
                console.log('Gui yeu cau that bai')
                console.log(response);
            })
        }
    }
    $scope.resetPassword = (user_id, user_name, user_email) => {
        if (confirm('Bạn muốn reset mật khẩu người dùng ' + user_name + ' không?')) {
            $http({
                method: 'POST',
                url: '/admins/restore_password',
                data: {
                    email: user_email,
                    new_password: user_email
                }
            }).then(function successCallback(response) {
                console.log(response);
            }, function errorCallback(response) {
                console.log(response);
            })
        }
    }
})

angular.module('timesheet').controller('projectManageCtrl', function ($scope, $window, $http, $location, ngDialog) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    $http({
        method: 'GET',
        url: '/employees/get_all_employees',
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        $scope.users = response.data.message
    }, function errorCallback(response) {

    })
    $http({
        method: 'GET',
        url: '/projects/get_all_projects',
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        $scope.projects = response.data.message;
        $scope.projects.forEach((item) => {
            item.leader_name = $scope.users.find((e) => {
                return e.id == item.leader_id
            }).name;
        })
    }, function errorCallback(response) {

    })
    $scope.addDetail = () => {
        ngDialog.open({
            template: 'views/admin-manage-project-add-detail.html',
            className: 'ngdialog-theme-default',
            width : 500,
            controller : 'addProjectDetailCtrl',
            scope : $scope,
            data : {
                project_name : $scope.project_name,
                leader_id : $scope.leader_id,
                users : $scope.users,
                token : session.token
            }
        });
    }
    $scope.addNewProject = () => {
        if ($scope.project_name == undefined || $scope.leader_id == undefined || $scope.project_name == '') alert('Bạn phải nhập tên dự án và tên trưởng dự án')
        else {
            $http({
                method: 'POST',
                url: '/admins/create_project',
                headers: {
                    token: session.token
                },
                data: {
                    name: $scope.project_name,
                    description: '',
                    leader_id: $scope.leader_id,
                    notes: ''
                }
            }).then(function successCallback(response) {
                console.log(response)
                $http({
                    method: 'GET',
                    url: '/projects/get_all_projects',
                    headers: {
                        token: session.token
                    }
                }).then(function successCallback(response) {
                    $scope.projects = response.data.message;
                    $scope.projects.forEach((item) => {
                        item.leader_name = $scope.users.find((e) => {
                            return e.id == item.leader_id
                        }).name;
                    })
                }, function errorCallback(response) {

                })

            }, function errorCallback(response) {
                console.log(response)
            })
        }
    }
    $scope.showDetail = (id) => {
        ngDialog.open({
            template: 'views/admin-manage-project-show-detail.html',
            className: 'ngdialog-theme-default',
            width : 500
        });
    }
})

angular.module('timesheet').controller('addProjectDetailCtrl', function ($scope, $window, $http, $location) {
    $scope.project_name = $scope.ngDialogData.project_name;
    $scope.leader_id = $scope.ngDialogData.leader_id;
    $scope.users = $scope.ngDialogData.users;
    $scope.project_employees = [];
    $scope.project_description = ''
    $scope.addEmployee = () => {
        var next = $scope.users.find((e) => {
            return e.id == $scope.employee_id;
        })
        if (next != undefined) $scope.project_employees.push(next);
    }
    $scope.addProject = () => {
        if ($scope.project_name == undefined || $scope.leader_id == undefined || $scope.project_name == '') alert('Bạn phải nhập tên dự án và tên trưởng dự án')
        else {
            $http({
                method: 'POST',
                url: '/admins/create_project',
                headers: {
                    token: $scope.ngDialogData.token
                },
                data: {
                    name: $scope.project_name,
                    description: $scope.project_description,
                    leader_id: $scope.leader_id,
                    notes: ''
                }
            }).then(function successCallback(response) {
                console.log(response)
                $http({
                    method: 'GET',
                    url: '/projects/get_all_projects',
                    headers: {
                        token: $scope.ngDialogData.token
                    }
                }).then(function successCallback(response) {
                    $scope.$parent.projects = response.data.message;
                    $scope.$parent.projects.forEach((item) => {
                        item.leader_name = $scope.users.find((e) => {
                            return e.id == item.leader_id
                        }).name;
                    })
                }, function errorCallback(response) {

                })
                if(response.data.status == 'success') {
                    console.log($scope.project_employees)
                    $scope.project_employees.forEach((e) => {
                        $http({
                            method : 'POST',
                            url : '/admins/assign_project',
                            data : {
                                employee_id : e.id,
                                project_id : response.data.project.id,
                                notes : ''
                            }
                        }).then ( function successCallback (response) {
                            console.log(response)
                        }, function errorCallback (response) {
                            console.log(response)
                        })
                    })
                }
            }, function errorCallback(response) {
                console.log(response)
            })
        }
    }
})

angular.module('timesheet').controller('showProjectDetailCtrl', function ($scope, $window, $http, $location) {

})
