/**
 * Created by VladimirIlich on 5/4/2016.
 */

angular.module('Login')

.service('loginServices',function($http,$log,CONST_PROXY_URL){

    var config = {
        headers:{
            'Content-Type':'application/json;charset=UTF-8'
        }
    };


    this.proxyLogin = function(username,password){

        var data = {
            ReaxiumParameters:{
                UserAccessControl:{
                    device_id : "1",
                    access_type_id : "1",
                    user_login_name : username,
                    user_password : password
                }
            }
        };

        var jsonObj = JSON.stringify(data);

        console.log("Objetos json armados para consultar login: "+jsonObj);

        return $http.post(CONST_PROXY_URL.PROXY_URL_LOGIN,jsonObj,config);

    }

})