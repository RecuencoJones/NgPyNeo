angular.module('pistachochef', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        function checkAuthorized(auth,$state){
            if(auth.isLogged()){
                $state.go('recipes');
            }
        }

        function checkUnauthorized(auth,$state){
            if(!auth.isLogged()){
                $state.go('login');
            }
        }

        $stateProvider

            .state('register', {
                url: '/register',
                templateUrl: 'templates/main/register.html',
                controller: 'RegisterCtrl',
                onEnter: ['Auth','$state', checkAuthorized]
            })

            .state('login', {
                url: '/login',
                templateUrl: 'templates/main/login.html',
                controller: 'LoginCtrl',
                onEnter: ['Auth','$state', checkAuthorized]
            })

            .state('recipes', {
                url: '/recipes',
                templateUrl: 'templates/main/recipes.html',
                controller: 'RecipesCtrl',
                onEnter: ['Auth','$state', checkUnauthorized]
            })

            .state('recipe', {

            })

            .state('recipe_create', {
                url: '/recipe/create',
                templateUrl: 'templates/main/recipe_create.html',
                controller: 'RecipeCreateCtrl',
                onEnter: ['Auth', '$state', checkUnauthorized]
            })

            .state('recipe_edit', {
                //url: '/recipe/edit/{id}',
                //templateUrl: 'templates/main/recipe_edit.html',
                //controller: 'RecipeEditCtrl',
                //onEnter: ['Auth', '$state', checkUnauthorized]
            })

            .state('me', {
                url: '/me',
                templateUrl: 'templates/main/me.html',
                controller: 'MeCtrl',
                onEnter: ['Auth', '$state', checkUnauthorized]
            })

            .state('user_profile', {
                url: '/profile/{user}',
                templateUrl: 'templates/main/profile.html',
                controller: 'ProfileCtrl',
                onEnter: ['Auth', '$state', checkUnauthorized]
            })

            .state('browser', {

            });

        $urlRouterProvider.otherwise('recipes');

    }]);
