angular.module('pistachochef')

.controller('MeCtrl', ['$scope', 'Recipes', function($scope, Recipes){
        $scope.recipes = [];

        Recipes.loadUserRecipes($scope, null);

        $scope.like = function(id){
            Recipes.like($scope, id);
        };

        $scope.dislike = function(id){
            Recipes.dislike($scope, id);
        };
    }]);