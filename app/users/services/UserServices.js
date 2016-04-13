/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Home')

    .factory('UserLookup', function ($http,CONST_PROXY_URL) {
        var lookup = {};
        var userIdFound = 0;
        var userData = {};
        var userJson = {
            users: {},
            totalPages: 0,
            totalRecords: 0
        }
        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allUsers = function (filterCriteria) {
            console.log(filterCriteria);
            return $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: 'http://54.200.133.84/reaxium/Users/allUsersInfoWithPagination',
            }).then(function (response) {
                userJson.users = response.data.ReaxiumResponse.object;
                userJson.totalPages = response.data.ReaxiumResponse.totalPages;
                userJson.totalRecords = response.data.ReaxiumResponse.totalRecords;
                console.log(userJson);
                return userJson;
            });
        };
        /**
         * search a user by his ID
         */
        lookup.userById = function (userId) {
            return $http({
                method: 'POST',
                data: JSON.stringify({'ReaxiumParameters': {'Users': {'user_id': userId}}}),
                url: 'http://54.200.133.84/reaxium/Users/userInfo',
            }).then(function (response) {
                var jsonObj = response.data.ReaxiumResponse.object;
                userIdFound = jsonObj[0].user_id;
                userData = jsonObj;
                console.log('Respondio el servicio')
                return userData;
            });
        };

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

        lookup.getUserIdFound = function () {
            return userIdFound;
        }
        return lookup;
    })

    //TODO Fabrica para obtener los usuarios por filtro
    .factory('UserSearch', function ($http, CONST_PROXY_URL) {

        var objUser = {};
        objUser.allUserWithFilter = function (filters) {

            var dataSend = {
                ReaxiumParameters: {
                    Users: {
                        filter: filters
                    }
                }
            };

            var jsonObj = JSON.stringify(dataSend);
            console.log("Objeto armado consulta filtro:" + jsonObj);

            return $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_FILTER,
                data: jsonObj,
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).then(function (response) {
                return response.data;

            }, function (error) {
                console.log("Error invocando servicio allUsersWithFilter: " + error);
            });
        };

        return objUser;

    })

    .service('UserService', function (UserLookup, UserSearch) {
        this.getUsers = function (filterCriteria) {
            return UserLookup.allUsers(filterCriteria);
        };
        this.getUsersById = function (userId) {
            return UserLookup.userById(userId);
        }
        this.getUserIdFound = function () {
            return UserLookup.getUserIdFound();
        }

        this.getUsersFilter = function (filters) {
            return UserSearch.allUserWithFilter(filters);
        };

        this.getAccessType = function(){
            return UserLookup.getAllAccessType();
        }
    });