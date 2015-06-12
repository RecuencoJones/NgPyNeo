angular.module('pistachochef')

.service('Auth', ['$http', '$state', 'API', function($http,$state,API){

        var logged = false;
        var token = null;
        var user = null;

        return ({
            register: register,
            authenticate: authenticate,
            logout: logout,
            isLogged: isLogged,
            getToken: getToken,
            getUser: getUser
        });

        function register(username,usermail,password){
            $http.post(
                API.URL + API.REGISTER,
                "username="+username+"&usermail="+usermail+"&password="+password,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).success(function(data){
                if(data.response){
                    $state.go('login');
                }
            });
        }

        function authenticate(usermail,password){
            $http.post(
                API.URL + API.LOGIN,
                "usermail="+usermail+"&password="+password,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).success(function(data){
                if(data.response){
                    logged = true;
                    token = data.token;
                    user = usermail;
                    localStorage.token = angular.toJson(token);
                    localStorage.user = angular.toJson(user);
                    $state.go('recipes');
                }
            });
        }

        function isLogged(){
            //return logged;
            if(token !== null){
                return logged;
            }else{
                var str1 = angular.fromJson(localStorage.token);
                var str2 = angular.fromJson(localStorage.user);
                if (str1 !== null && str1 !== undefined && str2 !== null && str2 !== undefined) {
                    logged = true;
                    token = str1;
                    user = str2;
                    return logged;
                }else {
                    return false;
                }

            }
        }

        function logout(){
            $http.post(
                API.URL + API.LOGOUT,
                "token="+token,
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            ).success(function(data){
                logged = false;
                token = null;
                user = null;
                localStorage.user = angular.toJson(null);
                localStorage.token = angular.toJson(null);

                $state.go('login');
            }).error(function(data){
                logged = false;
                token = null;
                user = null;
                localStorage.user = angular.toJson(null);
                localStorage.token = angular.toJson(null);

                $state.go('login');
            });
        }

        function getToken(){
            return token;
        }

        function getUser(){
            return user;
        }

    }]);
