angular.module('pistachochef')

.service('Recipes', ['$http', 'API', 'Auth', function($http, API, Auth){

        return {
            loadRecipes: loadRecipes,
            loadUserRecipes: loadUserRecipes,
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

        function loadUserRecipes(scope, user){
            if(user==null) user = Auth.getUser();

            $http.get(API.URL + API.USER_RECIPES + user).success(function(data){
                scope.recipes = data.recipes;

                for(var i = 0; i < scope.recipes.length; i++){
                    doesLike(scope.recipes[i])
                }
            });
        }

        function like(scope, id){
            var tmp = scope.recipes.filter(function(x) {return x.id == id }).shift();
            if (tmp.selected==false) {tmp.likes++; tmp.dislikes--;}
            else if(tmp.selected==true) { return; }
            tmp.selected = true;
            $http.post(
                API.URL + API.LIKE + id,
                'token='+Auth.getToken(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );
        }

        function dislike(scope, id){
            var tmp = scope.recipes.filter(function(x) {return x.id == id }).shift();
            if (tmp.selected==true) {tmp.dislikes++; tmp.likes--;}
            else if(tmp.selected==false) { return; }
            tmp.selected = false;
            $http.post(
                API.URL + API.DISLIKE + id,
                'token='+Auth.getToken(),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );
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
