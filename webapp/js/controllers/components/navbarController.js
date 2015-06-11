angular.module('pistachochef')

.controller('NavbarCtrl', ['$scope', '$location', 'Auth', function($scope, $location, Auth){

        $scope.logged = Auth.isLogged();

        $scope.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };

        $scope.logout = function(){
            Auth.logout();
        };

    }]);
