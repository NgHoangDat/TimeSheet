angular.module('timesheet').controller('userManageCtrl', function ($scope, $window, $http, $location) {
    var session = $window.localStorage.getItem('timesheet_user_session')
    $http({
        method : "GET",
        url : "/employees/get_all_employees",
        headers : {
            token : session.token
        }
    }).then( function successCallback (response) {
        $scope.users = response.data.message;
    }, function errorCallback (response) {
        console.log(response);
    })
    $scope.addNewUser = () => {

    },
    $scope.restorePassword = (id) => {
        var tar = $scope.users.find((e) => {
            return e.id = id;
        })
        if (tar != undefined) {
            $http({
                method : ''
            })
        }
    }
})
