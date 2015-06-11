angular.module('pistachochef')

.controller('RegisterCtrl', ['$scope', 'Auth', function($scope, Auth){

        $scope.username = null;
        $scope.usermail = null;
        $scope.password = null;

        $scope.register = function(){
            Auth.register($scope.username,$scope.usermail,$scope.password);
        }

    }]);