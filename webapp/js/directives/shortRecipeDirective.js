angular.module('pistachochef')

.directive('shortrecipe', function(){
        return {
            restrict: 'E',
            templateUrl: 'templates/components/shortrecipe.html'
        }
    });
