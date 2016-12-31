angular.module('timesheet').controller('userManageCtrl', function ($scope, $window, $http) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'))
    var getUser = () => {
        $http({
            method: "GET",
            url: "/employees/get_all_employees",
            headers: {
                token: session.token
            }
        }).then(function successCallback(response) {
            if (response.data.message.constructor != String) $scope.users = response.data.message;
            else $scope.users = new Array();
        }, function errorCallback(response) {

        });
    };
    $scope.$evalAsync(() => getUser());
    $scope.addNewUser = () => {
        if ($scope.email == undefined || $scope.password == undefined) alert('Bạn phải nhập email và mật khẩu cho người dùng mới')
        else {
            $http({
                method: 'POST',
                url: '/admins/create_account',
                data: {
                    email: $scope.email,
                    password: $scope.password
                }
            }).then(function successCallback(response) {
                console.log(response.data.message);
                $scope.$evalAsync(() => {
                    getUser()
                    $scope.email = null;
                    $scope.password = null;
                })
            }, function errorCallback(response) {
                console.log(response.data.message);
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
                alert(response.data.message);
            }, function errorCallback(response) {
                console.log(response.data.message);
            })
        }
    }
});

angular.module('timesheet').controller('projectManageCtrl', function ($scope, $window, $http, ngDialog) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'));
    var getUser = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: '/employees/get_all_employees',
                headers: {
                    token: session.token
                }
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            });

        })
    }
    var getAllProject = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: '/projects/get_all_projects',
                headers: {
                    token: session.token
                }
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            });
        });
    };
    var updateProject = (value) => {
        var [users, projects] = value;
        projects.forEach((item) => {
            item.leader_name = users.find((e) => {
                return e.id == item.leader_id
            }).name;
            item.leader_email = users.find((e) => {
                return e.id == item.leader_id
            }).email;
        });
        $scope.$evalAsync(() => {
            $scope.users = users;
            $scope.projects = projects;
        })
    };
    Promise.all([getUser(), getAllProject()]).then(value => updateProject(value));
    $scope.project_description = '';
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
                    description: $scope.project_description,
                    leader_id: $scope.leader_id,
                    notes: ''
                }
            }).then(function successCallback(response) {
                console.log(response.data.message);
                getAllProject().then(projects => updateProject([$scope.users, projects]));
            }, function errorCallback(response) {
                console.log(response.data.message)
            })
        }
    };
    $scope.showDetail = (project) => {
        var dialog = ngDialog.open({
            template: 'views/admin-manage-project-show-detail.html',
            className: 'ngdialog-theme-default',
            width: 690,
            controller: 'showProjectDetailCtrl',
            data: {
                project: project,
                users: $scope.users
            }
        });
        dialog.closePromise.then(function () {
            getAllProject().then(projects => $scope.$evalAsync(updateProject([$scope.users, projects])));

        })
    };
});

angular.module('timesheet').controller('showProjectDetailCtrl', function ($scope, $window, $http) {
    var project = $scope.ngDialogData.project;
    $scope.project_name = project.name;
    $scope.project_description = project.description;
    $scope.project_leader = project.leader_name;
    $scope.project_leader_email = project.leader_email;
    $scope.users = $scope.ngDialogData.users;
    $scope.new_project_employees = [];
    $scope.$evalAsync(() => {
        $http({
            method: 'POST',
            url: '/projects/get_employees',
            data: {
                project_id: project.id
            }
        }).then(function successCallback(response) {
            if (response.data.message.constructor == String) $scope.project_employees = [];
            else $scope.project_employees = response.data.message;
            console.log(response.data.message)
        }, function errorCallback(response) {
            console.log(response.data.message)
        });
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
        var project_id = project.id;
        var leader_id = project.leader_id;
        $scope.new_project_employees.forEach((e) => {
            var employee_id = e.id
            $http({
                method: 'POST',
                url: '/admins/assign_project',
                data: {
                    employee_id: employee_id,
                    project_id: project_id,
                    notes: ''
                }
            }).then(function successCallback(response) {
                console.log(response.data.message)
                $http({
                    method: 'POST',
                    url: '/admins/assign_approver',
                    data: {
                        project_id: project_id,
                        approver_id: leader_id,
                        employee_id: employee_id
                    }
                }).then(function successCallback(response) {
                    console.log(response.data.message)
                }, function errorCallback(response) {
                    console.log(response.data.message)
                })
            }, function errorCallback(response) {
                console.log(response.data.message)
            })
        });
        $scope.closeThisDialog();
    }
});

angular.module('timesheet').controller('timesheetManageCtrl', function ($scope, $window, $http, $timeout, ngDialog) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'));
    var _allUsers = new Array();
    var _allProjects = new Array();
    var getAllUsers = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: "GET",
                url: "/employees/get_all_employees",
                headers: {
                    token: session.token
                }
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            })

        })
    };
    var getAllProjects = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: '/projects/get_all_projects',
                headers: {
                    token: session.token
                }
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            });
        });
    };
    var getAllTimesheets = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: '/timesheets/get_timesheets_havent_approved_by_admin'
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            });
        })
    };
    var updateData = (allUsers, allProjects, waiting_timesheets) => {
        _allUsers = allUsers;
        _allProjects = allProjects;
        waiting_timesheets.forEach((timesheet) => {
            timesheet.employee_name = allUsers.find((e) => {
                return e.id == timesheet.employee_id;
            }).name;
            timesheet.project_name = allProjects.find((e) => {
                return e.id == timesheet.project_id;
            }).name;
            timesheet.working_date = new Date(timesheet.working_date).toDateString()
        });
        $scope.$evalAsync(() => $scope.waiting_timesheets = waiting_timesheets);
    };
    Promise.all([getAllUsers(), getAllProjects(), getAllTimesheets()]).then(value => {
        var [allUsers, allProjects, waiting_timesheets] = value;
        updateData(allUsers, allProjects, waiting_timesheets);
    });
    $scope.approve = (timesheet) => {
        var dialog = ngDialog.open({
            template: 'views/admin-manage-timesheet-detail.html',
            className: 'ngdialog-theme-default',
            width: 690,
            height: 500,
            controller: 'timesheetDetailCtrl',
            scope: $scope,
            data: {
                token: session.token,
                timesheet: timesheet,
                users: _allUsers,
                admin_id: session.id
            }
        });
        dialog.closePromise.then(function (data) {
            getAllTimesheets().then(timesheets => updateData(_allUsers, _allProjects, timesheets));
        });
    }
    $scope.view = () => {

        if ($scope.start_date === '' || $scope.end_date === '') {
            alert('Bạn phải nhập ngày!!')
            return false;
        }
        var start_date = new Date($scope.start_date);
        start_date = start_date.getFullYear() + '-' + (start_date.getMonth() + 1) + '-' + start_date.getDate();
        $scope.start_date_str = start_date.split('-').reverse().join('-');

        var end_date = new Date($scope.end_date);
        end_date = end_date.getFullYear() + '-' + (end_date.getMonth() + 1) + '-' + end_date.getDate();
        $scope.end_date_str = end_date.split('-').reverse().join('-');

        $http({
            method: 'POST',
            url: '/admins/output',
            headers: {
                id: session.id
            },
            data: {
                start_date: start_date,
                end_date: end_date
            }
        }).then(function successCallback(response) {
            if (response.data.message.constructor != String) {
                $scope.$evalAsync(() => {
                    $scope.final_reports = response.data.message;
                    $scope.final_reports.forEach((report) => {
                        report.avg_efficiency = report.avg_efficiency.toFixed(2);
                        report.employee_email = _allUsers.find((e) => {
                            return e.id == report.employee_id
                        }).email;
                    });
                })
            }
            $timeout(function () {
                var printContent = document.getElementById('printContent').cloneNode(true);
                var newWindow = window.open('views/admin-output.html', '');
                newWindow.addEventListener('load', function () {
                    newWindow.document.body.appendChild(printContent);
                });
                $scope.final_reports = undefined;
            });
        }, function errorCallback(response) {
            console.log(response)
        })

    }

});

angular.module('timesheet').controller('timesheetDetailCtrl', function ($scope, $http) {
    $scope.timesheet = $scope.ngDialogData.timesheet;
    var allUsers = $scope.ngDialogData.allUsers;
    var admin_id = $scope.ngDialogData.admin_id;
    $scope.working_hours = $scope.timesheet.working_hours;
    $scope.efficiency = $scope.timesheet.efficiency;

    new Promise(function (resolve, reject) {
        $http({
            method: 'GET',
            url: '/approvers/get_approve_record/' + $scope.timesheet.id
        }).then(function successCallback(response) {
            $scope.$evalAsync(function () {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            });

        }, function errorCallback(response) {
            console.log(response.data.message);
        });
    }).then(value => $scope.$evalAsync(function () {
        $scope.reports = value;
    }));

    $scope.submit = () => {
        $http({
            method: 'POST',
            url: '/approvers/approve',
            data: {
                approver_id: admin_id,
                timesheet_id: $scope.timesheet.id,
                working_hours: $scope.working_hours,
                efficiency: $scope.efficiency,
                notes: ''
            }
        }).then(function successCallback(response) {
            $http({
                method: 'PATCH',
                url: '/timesheets',
                data: {
                    id: $scope.timesheet.id,
                    working_hours: $scope.working_hours,
                    efficiency: $scope.efficiency,
                    notes: 'Admin đã duyệt'
                }
            }).then(function successCallback(response) {
                console.log(response.data.message)
                if (response.data.status == 'success') {
                    $scope.closeThisDialog();
                }
            }, function errorCallback(response) {

            })
        }, function errorCallback(response) {

        })
    }
});

angular.module('timesheet').controller('approverManageCtrl', function ($scope, $window, $http) {
    var session = JSON.parse($window.localStorage.getItem('timesheet_user_session'));
    var getAllUsers = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: "GET",
                url: "/employees/get_all_employees",
                headers: {
                    token: session.token
                }
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            })

        })
    };
    var getAllProjects = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: '/projects/get_all_projects',
                headers: {
                    token: session.token
                }
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                reject(response.data.message);
            });
        });
    };
    var getAllApprovers = () => {
        return new Promise(function (resolve, reject) {
            $http({
                method: 'GET',
                url: '/approvers/get_all_records'
            }).then(function successCallback(response) {
                if (response.data.message.constructor != String) resolve(response.data.message);
                else resolve(new Array());
            }, function errorCallback(response) {
                console.log(response.data.message);
                reject(response.data.message);
            });

        })
    };
    var updateDatas = (users, projects, approvers) => {
        approvers.forEach((approver) => {
            var user = users.find((e) => {
                return e.id == approver.approver_id;
            })
            if (user != undefined) {
                approver.approver_name = user.name;
                approver.approver_email = user.email;
            }
            var user = users.find((e) => {
                return e.id == approver.employee_id;
            })
            if (user != undefined) {
                approver.employee_name = user.name;
                approver.employee_email = user.email;
            }
            approver.project_name = projects.find((e) => {
                return e.id == approver.project_id;
            }).name;
        });
        $scope.$evalAsync(() => {
            $scope.users = users;
            $scope.projects = projects;
            $scope.approvers = approvers;
        })
    };
    Promise.all([getAllUsers(), getAllProjects(), getAllApprovers()]).then(value => {
        var [allUsers, allProjects, allApprovers] = value;
        updateDatas(allUsers, allProjects, allApprovers);
    });
    $scope.$watch('project_id', () => {
        $http({
            method: 'POST',
            url: '/projects/get_employees',
            data: {
                project_id: $scope.project_id
            }
        }).then(function successCallback(response) {
            $scope.$evalAsync(() => {
                if (response.data.message.constructor != String) $scope.project_users = response.data.message;
                else $scope.project_users = new Array();
            })
        }, function errorCallback(response) {
            console.log(response.data.message)
        });
    });
    $scope.addNewApprover = () => {
        if ($scope.project_id == null || $scope.approver_id == null || $scope.employee_id == null)
            alert('Không được bỏ trống các lựa chọn')
        else if ($scope.approver_id == $scope.employee_id) alert('Approver và nhân viên không thể là cùng một người')
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
                console.log(response.data.message)
                getAllApprovers().then(approvers => updateDatas($scope.users, $scope.projects, approvers));
            }, function errorCallback(response) {
                console.log(response.data.message)
            })
        }
    }
});