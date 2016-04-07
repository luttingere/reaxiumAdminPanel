/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Users')

    //TODO Fabrica para obtener todos los usuario disponibles
    .factory('UserLookup', function ($http,CONST_PROXY_URL) {
        var lookup = {};
        lookup.allUsers = function () {
            return $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER
            }).then(function (response) {
                var jsonObj = response.data;
                return jsonObj.ReaxiumResponse.object;
            });
        };
        return lookup;
    })
    //TODO Fabrica para obtener los usuarios por filtro
    .factory('UserSearch',function($http,CONST_PROXY_URL){

        var objUser = {};
        objUser.allUserWithFilter = function(filters){

            var dataSend = {
                ReaxiumParameters:{
                    Users:{
                        filter:filters
                    }
                }
            };

            var jsonObj = JSON.stringify(dataSend);
            console.log("Objeto armado consulta filtro:" +jsonObj);

            return $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_FILTER,
                data: jsonObj,
                headers: {'Content-Type':'application/json;charset=UTF-8'}
            }).then(function(response){
               return response.data ;

            },function(error){
               console.log("Error invocando servicio allUsersWithFilter: "+error);
            });
        };

        return objUser;

    })
    .service('UserService', function (UserLookup,UserSearch) {

        this.getUsers = function(){
            return UserLookup.allUsers();
        };

        this.getUsersFilter = function(filters){
            return UserSearch.allUserWithFilter(filters);
        };
    });