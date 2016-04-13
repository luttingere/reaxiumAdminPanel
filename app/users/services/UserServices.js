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

        this.getUsers = function () {
            return UserLookup.allUsers();
        };
        this.getUsersById = function (userId) {
            return UserLookup.userById(userId);
        };
        this.getUserIdFound = function () {
            return UserLookup.getUserIdFound();
        };

        this.getUsersFilter = function(filters){
            return UserLookup.allUserWithFilter(filters);
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