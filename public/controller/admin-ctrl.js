angular.module('timesheet').controller('userManageCtrl', function ($scope, $window, $http, $location) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    var getUser = () => {
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
    }
    getUser();
    $scope.addNewUser = () => {
        if ($scope.email == undefined || $scope.password == undefined) alert('Bạn phải nhập email và mật khẩu cho người dùng mới')
        else {
            console.log('Tao tai khoan moi')
            console.log($scope.email)
            console.log($scope.password)
            $http({
                method: 'POST',
                url: '/admins/create_account',
                data: {
                    email: $scope.email,
                    password: $scope.password
                }
            }).then(function successCallback(response) {
                console.log('Gui yeu cau thanh cong')
                console.log(response);
                getUser()
                $scope.email = null;
                $scope.password = null;
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
        if (response.data.message.constructor == String) $scope.projects = new Array();
        else $scope.projects = response.data.message;
        $scope.projects.forEach((item) => {
            item.leader_name = $scope.users.find((e) => {
                return e.id == item.leader_id
            }).name;
            item.leader_email = $scope.users.find((e) => {
                return e.id == item.leader_id
            }).email;
        })
    }, function errorCallback(response) {

    })
    $scope.addDetail = () => {
        ngDialog.open({
            template: 'views/admin-manage-project-add-detail.html',
            className: 'ngdialog-theme-default',
            width: 690,
            controller: 'addProjectDetailCtrl',
            scope: $scope,
            data: {
                project_name: $scope.project_name,
                leader_id: $scope.leader_id,
                users: $scope.users,
                token: session.token
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
    $scope.showDetail = (project) => {
        ngDialog.open({
            template: 'views/admin-manage-project-show-detail.html',
            className: 'ngdialog-theme-default',
            width: 690,
            controller: 'showProjectDetailCtrl',
            data: {
                project: project,
                users: $scope.users
            }
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
        },
        $scope.delete = (id) => {
            var tar = $scope.users.find((e) => {
                return e.id == id;
            })
            $scope.project_employees.splice($scope.project_employees.indexOf(tar), 1)
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
                if (response.data.status == 'success') {
                    console.log($scope.project_employees)
                    $scope.project_employees.forEach((e) => {
                        $http({
                            method: 'POST',
                            url: '/admins/assign_project',
                            data: {
                                employee_id: e.id,
                                project_id: response.data.project.id,
                                notes: ''
                            }
                        }).then(function successCallback(response) {
                            console.log(response)
                        }, function errorCallback(response) {
                            console.log(response)
                        })
                    })
                }
                $scope.closeThisDialog();
            }, function errorCallback(response) {
                console.log(response)
            })
        }
    }
})

angular.module('timesheet').controller('showProjectDetailCtrl', function ($scope, $window, $http, $location) {
    var project = $scope.ngDialogData.project;
    $scope.project_name = project.name;
    $scope.project_description = project.description;
    $scope.project_leader = project.leader_name;
    $scope.project_leader_email = project.leader_email;
    $scope.users = $scope.ngDialogData.users;
    $scope.new_project_employees = [];
    $http({
        method: 'POST',
        url: '/projects/get_employees',
        data: {
            project_id: project.id
        }
    }).then(function successCallback(response) {
        if (response.data.message == 'Not found any employees!') $scope.project_employees = []
        else $scope.project_employees = response.data.message;
        console.log(response.data.message)
    }, function errorCallback(response) {
        console.log(response)
    })
    $scope.addEmployee = () => {
        var next = $scope.users.find((e) => {
            return e.id == $scope.employee_id;
        })
        if (next != undefined && $scope.new_project_employees.indexOf(next) == -1 && $scope.project_employees.find((e) => {
                return e.id == $scope.employee_id;
            }) == undefined) $scope.new_project_employees.push(next);
    }
    $scope.delete = (id) => {
        var tar = $scope.users.find((e) => {
            return e.id == id;
        })
        $scope.new_project_employees.splice($scope.new_project_employees.indexOf(tar), 1)
    }
    $scope.saveChange = () => {
        $scope.new_project_employees.forEach((e) => {
            $http({
                method: 'POST',
                url: '/admins/assign_project',
                data: {
                    employee_id: e.id,
                    project_id: project.id,
                    notes: ''
                }
            }).then(function successCallback(response) {
                console.log(response)
                $scope.closeThisDialog('Them nhan vien');
            }, function errorCallback(response) {
                console.log(response)
            })
        })
    }
})

angular.module('timesheet').controller('timesheetManageCtrl', function ($scope, $window, $http, $location) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    $http({
        method : 'GET',
        url : '/timesheets/get_timesheets_havent_approved_by_admin'
    }).then ( function successCallback (response) {
        if (response.data.message.constructor == String) $scope.waiting_timesheets = new Array();
        else $scope.waiting_timesheets = response.data.message;
    }, function errorCallback (response) {

    })
    

})

angular.module('timesheet').controller('approverManageCtrl', function ($scope, $window, $http, $location) {
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
    $http({
        method: 'GET',
        url: '/approvers/get_all_approvers'
    }).then(function successCallback(response) {
        console.log(response)
        if (response.data.message.constructor == String) $scope.approvers = new Array();
        else $scope.approvers = response.data.message;
        $scope.approvers.forEach((approver) => {
            var user = $scope.users.find((e) => {
                return e.id == approver.approver_id;
            })
            if (user != undefined) {
                approver.approver_name = user.name;
                approver.approver_email = user.email;
            }
            var user = $scope.users.find((e) => {
                return e.id == approver.employee_id;
            })
            if (user != undefined) {
                approver.employee_name = user.name;
                approver.employee_email = user.email;
            }
             
        })
    }, function errorCallback(response) {
        console.log(response);
    })
    $http({
        method: 'GET',
        url: '/projects/get_all_projects',
        headers: {
            token: session.token
        }
    }).then(function successCallback(response) {
        if (response.data.message.constructor == String) $scope.project = new Array();
        else $scope.projects = response.data.message;
    }, function errorCallback(response) {

    })
    $scope.getUser = () => {
        $scope.users = []
        $http({
            method: 'POST',
            url: '/projects/get_employees',
            data: {
                project_id: $scope.project_id
            }
        }).then(function successCallback(response) {
            console.log(response)
            if (response.data.message.constructor == Array) {
                $scope.users = response.data.message
            }
        }, function errorCallback(response) {
            console.log(response)
        })
    }
    $scope.addNewApprover = () => {
        if ($scope.approver_id == $scope.employee_id) alert('Approver và nhân viên không thể là cùng một người')
        if ($scope.project_id == null || $scope.approver_id == null || $scope.employee_id == null)
            alert('Không được bỏ trống các lựa chọn')
        else {
            $http({
                method: 'POST',
                url: '/admins/assign_approver',
                data: {
                    project_id: $scope.project_id,
                    approver_id: $scope.approver_id,
                    employee_id: $scope.employee_id
                }
            }).then(function successCallback(response) {
                console.log(response)
            }, function errorCallback(response) {
                console.log(response)
            })
        }
    }
})