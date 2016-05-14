/**
 * Created by VladimirIlich on 5/4/2016.
 */

angular.module('App')

.factory('LoginLookup',function($http,$log,$q,CONST_PROXY_URL){

    var lookup = {};

    lookup.sendLogin = function(username,password){

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

        $http({
            method: 'POST',
            data: JSON.stringify(data),
            url: CONST_PROXY_URL.PROXY_URL_LOGIN,
        }).success(function (response) {
            defered.resolve(response);
        }).error(function (err) {
            defered.reject(err);
        });


        return promise;
    }


    lookup.getMenu = function(user_type_id){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            data: JSON.stringify({ReaxiumParameters:{ReaxiumSystem:{type_user_id:user_type_id}}}),
            url: CONST_PROXY_URL.PROXY_URL_MENU_SHOW,
        }).success(function (response) {
            defered.resolve(response);
        }).error(function (err) {
            defered.reject(err);
        });

        return promise;

    }

    return lookup;
})

.service('loginServices',function(LoginLookup){

  this.proxyLogin = function(username,password){
      return LoginLookup.sendLogin(username,password);
  }

  this.menuApplication = function(user_type_id){
      return LoginLookup.getMenu(user_type_id);
  }

})