/**
 * Created by VladimirIlich on 5/4/2016.
 */

angular.module('App')

.service('loginServices',function($http,$log,$q,CONST_PROXY_URL){

    var config = {
        headers:{
            'Content-Type':'application/json;charset=UTF-8'
        }
    };


    this.proxyLogin = function(username,password){

        var defered = $q.defer();
        var promise = defered.promise;

        var data = {
            ReaxiumParameters:{
                UserAccessData:{
                    device_id : "1",
                    access_type_id : "1",
                    user_login_name : username,
                    user_password : password
                }
            }
        };

        var jsonObj = JSON.stringify(data);

        $http.post(CONST_PROXY_URL.PROXY_URL_LOGIN,jsonObj,config)
            .success(function(response){
                defered.resolve(response);
            }).error(function (err){
                defered.reject(err);
        });

        return promise;
    }

})