angular.module('pistachochef')

.service('Recipes', ['$http', 'API', 'Auth', function($http, API, Auth){

        return {
            loadRecipes: loadRecipes,
            like: like,
            dislike: dislike
        };

        function loadRecipes(scope){
            $http.get(API.URL + API.RECIPES).success(function(data){
                scope.recipes = data.recipes;

                for(var i = 0; i < scope.recipes.length; i++){
                    doesLike(scope.recipes[i])
                }
            });
        }

        function like(id){
            $http.post(
                API.URL + API.LIKE + id,
                'token='+Auth.getToken(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).success(function(data){

            });
        }

        function dislike(id){
            $http.post(
                API.URL + API.DISLIKE + id,
                'token='+Auth.getToken(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).success(function(data){

            });
        }

        function doesLike(recipe){
            $http.post(
                API.URL + API.DOES_LIKE + recipe.id,
                'token='+Auth.getToken(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).success(function(data){
                recipe.selected = data.response;
            });
        }

    }]);
