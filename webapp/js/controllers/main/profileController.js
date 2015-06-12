angular.module('pistachochef')

.controller('ProfileCtrl', ['$scope', '$stateParams', 'Recipes', function($scope, $stateParams, Recipes){
        $scope.recipes = [];

        Recipes.loadUserRecipes($scope, $stateParams.user);

        $scope.like = function(id){
            Recipes.like($scope,id);
        };

        $scope.dislike = function(id){
            Recipes.dislike($scope,id);
        };
    }]);