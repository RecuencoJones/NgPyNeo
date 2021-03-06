angular.module('pistachochef')

.controller('RecipesCtrl', ['$scope', 'Recipes', function($scope, Recipes){
        $scope.recipes = [];

        Recipes.loadRecipes($scope);

        $scope.like = function(id){
            Recipes.like($scope,id);
        };

        $scope.dislike = function(id){
            Recipes.dislike($scope,id);
        };
    }]);
