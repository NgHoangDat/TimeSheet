angular.module('timesheet').controller('userManageCtrl', function ($scope, $window, $http, $location) {
    var session = $window.localStorage.getItem('timesheet_user_session')
    $http({
        method : "GET",
        url : "/employees/get_all_employees",
        headers : {
            token : session.token
        }
    }).then( function successCallback (response) {
        // $scope.user
    }, function errorCallback (response) {

    })
})
