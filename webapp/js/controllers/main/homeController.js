angular.module('pistachochef')

.controller('HomeCtrl', ['$scope', 'Recipes', function($scope, Recipes){
        $scope.recipes = [];

        Recipes.loadRecipes($scope);

        $scope.like = function(id){
            Recipes.like(id);
            Recipes.loadRecipes($scope);
        };

        $scope.dislike = function(id){
            Recipes.dislike(id);
            Recipes.loadRecipes($scope);
        };
    }]);
