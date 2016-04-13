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

        /**
         * Get Access type for user
         * @returns {*}
         */
        lookup.getAllAccessType = function(){
            return $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ACCESS_TYPE_LIST
            }).then(function(response){
                return response.data.ReaxiumResponse.object;
            });
        }

        /**
         * get User Types
         * @returns {*}
         */
        lookup.allUsersType = function(){
            return $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USERS_TYPE
            }).then(function(response){
               return response.data.ReaxiumResponse.object;
            });
        }


        /**
         * get status users
         * @returns {*}
         */
        lookup.allStatusUser = function(){
            return $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_STATUS_USER
            }).then(function(response){
                return response.data.ReaxiumResponse.object;
            });
        }

        /**
         * create new user
         * @param obj
         * @returns {*}
         */
        lookup.newUser = function(obj){
            return $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_NEW_USER,
                data: JSON.stringify(obj),
                headers: {'Content-Type':'application/json;charset=UTF-8'}
            }).then(function(response){
                return response.data.ReaxiumResponse;
            })
        }

        /**
         * create new user stakeholder
         * @param obj
         * @returns {*}
         */
        lookup.newUserStakeHolder = function(obj){
            return $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_USER_STAKEHOLDER,
                data: JSON.stringify(obj),
                headers: {'Content-Type':'application/json;charset=UTF-8'}
            }).then(function(response){
                return response.data.ReaxiumResponse;
            })
        }

        lookup.getUserIdFound = function () {
            return userIdFound;
        }
        return lookup;

    })

    .service('UserService', function (UserLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idUser: 0
        };

        var addressDefault = {
            latitude: 37.0902,
            longitude: -95.7129
        }

        var objUserById = {};

        this.getObjUserById = function(){
            return objUserById;
        }

        this.setObjUserById = function(obj){
            objUserById = obj;
        }

        this.getAddressDefault = function(){
            return addressDefault;
        }

        this.getModeEdit = function() {
            return objModeEdit;
        };
        this.setModeEdit = function(mode) {
            objModeEdit = mode;
        };

        this.getUsers = function (filter) {
            return UserLookup.allUsers(filter);
        };
        this.getUsersById = function (userId) {
            return UserLookup.userById(userId);
        };
        this.getUserIdFound = function () {
            return UserLookup.getUserIdFound();
        };

        this.getUsersFilter = function (filters) {
            return UserSearch.allUserWithFilter(filters);
        };

        this.getAccessType = function(){
            return UserLookup.getAllAccessType();
        };

        this.getAllUsersType = function(){
            return UserLookup.allUsersType();
        };

        this.getAllStatusUser = function(){
            return UserLookup.allStatusUser();
        };

        this.createNewUser = function(objNewUser){
            return UserLookup.newUser(objNewUser);
        }

        this.createNewUserStakeHolder = function(objNewUser){
            return UserLookup.newUserStakeHolder(objNewUser);
        }
    });