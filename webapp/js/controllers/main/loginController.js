angular.module('pistachochef')

.controller('LoginCtrl', ['$scope', 'Auth', function($scope, Auth){

        $scope.usermail = null;
        $scope.password = null;

        $scope.authenticate = function(){
            Auth.authenticate($scope.usermail,$scope.password);
        }

    }]);
