angular.module('pistachochef')

.constant('API', {
        'URL': "http://" + "localhost:5000" + "/api",
        'REGISTER': "/register",
        'LOGIN': "/login",
        'LOGOUT': "/logout",
        'RECIPES': "/get_recipes",
        'LIKE': "/like_recipe/",
        'DISLIKE': "/dislike_recipe/",
        'DOES_LIKE': "/does_like/"
    });
