angular.module('pistachochef', ['ui.router'])

    .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

        function checkAuthorized(auth,$state){
            if(auth.isLogged()){
                $state.go('home');
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

            .state('home', {
                url: '/home',
                templateUrl: 'templates/main/home.html',
                controller: 'HomeCtrl',
                onEnter: ['Auth','$state', checkUnauthorized]
            })

            .state('recipes', {

            })

            .state('recipe', {

            })

            .state('browser', {

            });

        $urlRouterProvider.otherwise('home');

    }]);
