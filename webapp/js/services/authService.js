angular.module('pistachochef')

.service('Auth', ['$http', '$state', 'API', function($http,$state,API){

        var logged = false;
        var token = null;

        return ({
            register: register,
            authenticate: authenticate,
            logout: logout,
            isLogged: isLogged,
            getToken: getToken
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
                    localStorage.token = angular.toJson(token);
                    $state.go('recipes');
                }
            });
        }

        function isLogged(){
            //return logged;
            if(token !== null){
                return logged;
            }else{
                var tmp = angular.fromJson(localStorage.token);
                if (tmp !== undefined) {
                    logged = true;
                    token = tmp;
                    return tmp;
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
                localStorage.token = angular.toJson(null);

                $state.go('login');
            });
        }

        function getToken(){
            return token;
        }

    }]);
