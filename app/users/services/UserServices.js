/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Home')

    .factory('UserLookup', function ($http,CONST_PROXY_URL) {
        var lookup = {};
        var userIdFound= 0;
        var userData = {};

        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allUsers = function () {
            return $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER,
            }).then(function (response) {
                var jsonObj = response.data;
                return jsonObj.ReaxiumResponse.object;
            });
        };
        /**
         * search a user by his ID
         */
        lookup.userById = function (userId) {
                return $http({
                    method: 'POST',
                    data: JSON.stringify({'ReaxiumParameters': {'Users': {'user_id': userId}}}),
                    url: CONST_PROXY_URL.PROXY_URL_USER_BY_ID,
                }).then(function (response) {
                    var jsonObj = response.data.ReaxiumResponse.object;
                    userIdFound = jsonObj[0].user_id;
                    userData = jsonObj;
                    console.log('Respondio el servicio')
                    return userData;
                });
        };

        lookup.getUserIdFound = function(){
            return userIdFound;
        }

        /**
         * Get User with filter
         * @param filters
         * @returns {*}
         */
        lookup.allUserWithFilter = function(filters){

            return $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_FILTER,
                data: JSON.stringify({ReaxiumParameters:{Users:{filter:filters}}}),
                headers: {'Content-Type':'application/json;charset=UTF-8'}
            }).then(function(response){
                return response.data ;

            },function(error){
                console.log("Error invocando servicio allUsersWithFilter: "+error);
            });
        };

        lookup.getAllAccessType = function(){
            return $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ACCESS_TYPE_LIST,
            }).then(function(response){
                return response.data.ReaxiumResponse.object;
            })
        }

        return lookup;
    })


    .service('UserService', function (UserLookup) {
        this.getUsers = function () {
            return UserLookup.allUsers();
        };
        this.getUsersById = function (userId) {
            return UserLookup.userById(userId);
        }
        this.getUserIdFound = function () {
            return UserLookup.getUserIdFound();
        }

        this.getUsersFilter = function(filters){
            return UserLookup.allUserWithFilter(filters);
        };

        this.getAccessType = function(){
            return UserLookup.getAllAccessType();
        }
    });