/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('UserLookup', function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};
        var userIdFound = 0;
        var userData = {};
        var userJson = {
            users: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allUsers = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_PAGINATE,
            }).success(function (response) {
                userJson.users = response.ReaxiumResponse.object;
                userJson.totalPages = response.ReaxiumResponse.totalPages;
                userJson.totalRecords = response.ReaxiumResponse.totalRecords;
                defered.resolve(userJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.getHistoricalAccess = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_SHOW_ACCESS_HISTORY_BY_USER,
            }).success(function (response) {
                userJson.traffic = response.ReaxiumResponse.object;
                userJson.totalPages = response.ReaxiumResponse.totalPages;
                userJson.totalRecords = response.ReaxiumResponse.totalRecords;
                defered.resolve(userJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };



        /**
         * search a user by his ID
         */
        lookup.userById = function (userId) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({'ReaxiumParameters': {'Users': {'user_id': userId}}}),
                url: CONST_PROXY_URL.PROXY_URL_USER_BY_ID,
            }).success(function (response) {
                var jsonObj = response.ReaxiumResponse.object;
                userIdFound = jsonObj[0].user_id;
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        /**
         * Get User with filter
         * @param filters
         * @returns {*}
         */
        lookup.allUserWithFilter = function (filters) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_FILTER,
                data: JSON.stringify(filters),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        };

        /**
         * Get Access type for user
         * @returns {*}
         */
        lookup.getAllAccessType = function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ACCESS_TYPE_LIST
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        /**
         * get User Types
         * @returns {*}
         */
        lookup.allUsersType = function (userTypeId) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data:JSON.stringify({ReaxiumParameters:{Users:{user_type_id:userTypeId}}}),
                url: CONST_PROXY_URL.PROXY_URL_ALL_USERS_TYPE
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        /**
         * get status users
         * @returns {*}
         */
        lookup.allStatusUser = function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_STATUS_USER
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        }

        /**
         * create new user
         * @param obj
         * @returns {*}
         */
        lookup.newUser = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_NEW_USER,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        /**
         * create new user stakeholder
         * @param obj
         * @returns {*}
         */
        lookup.newUserStakeHolder = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_USER_STAKEHOLDER,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                //return response.data.ReaxiumResponse;
                defered.resolve(response.ReaxiumResponse);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        lookup.getUserIdFound = function () {
            return userIdFound;
        }

        /**
         * New Access User
         * @param user
         * @returns {d.promise|*|promise}
         */
        lookup.newAccessUser = function (user) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_ACCESS_USER,
                data: JSON.stringify(user),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                //return response.data.ReaxiumResponse;
                defered.resolve(response.ReaxiumResponse);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        /**
         * Delete User
         * @param id_user
         * @returns {d.promise|*|promise}
         */
        lookup.deleteUser = function(id_user){

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_DELETE_USER,
                data: JSON.stringify({ReaxiumParameters:{Users:{user_id:id_user}}}),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookup.getAccessMenu = function(){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
               method:'GET',
                url:CONST_PROXY_URL.PROXY_URL_GET_ACCESS_MENU,
                headers:{'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function(response){
                defered.resolve(response);
            }).error(function(err){
                defered.reject(err);
            });

            return promise;
        }

        lookup.updateRolAccessMenu = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_UPDATE_ACCESS_ROL_MENU,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        return lookup;

    })

    .service('UserService', function (UserLookup) {

        var objModeEdit = {
            isModeEdit: false,
            idUser: 0
        };

        var addressDefault = {
            latitude: 25.7742700,
            longitude: -80.1936600,
            address:"Miami, Florida, EE.UU"
        };

        var showGrowl = {
            isShow: false,
            message: ""
        };

        var objUserById = {};

        this.cleanGrowl = function(){
            this.setShowGrowlMessage({isShow:false,message:""});
        }

        this.cleanModeEdit = function(){
            this.setModeEdit({isModeEdit:false,idUser:0});
        }

        this.getObjUserById = function () {
            return objUserById;
        }

        this.setObjUserById = function (obj) {
            objUserById = obj;
        }

        this.getAddressDefault = function () {
            return addressDefault;
        }

        this.getModeEdit = function () {
            return objModeEdit;
        };
        this.setModeEdit = function (mode) {
            objModeEdit = mode;
        };

        this.getUsers = function (filter) {
            return UserLookup.allUsers(filter);
        };
        this.getHistoricalAccessOfAUser = function (filter) {
            return UserLookup.getHistoricalAccess(filter);
        };
        this.getUsersById = function (userId) {
            return UserLookup.userById(userId);
        };
        this.getUserIdFound = function () {
            return UserLookup.getUserIdFound();
        };

        this.getUsersFilter = function (filters) {
            return UserLookup.allUserWithFilter(filters);
        };

        this.getAccessType = function () {
            return UserLookup.getAllAccessType();
        };

        this.getAllUsersType = function (userAccessTypeId) {
            return UserLookup.allUsersType(userAccessTypeId);
        };

        this.getAllStatusUser = function () {
            return UserLookup.allStatusUser();
        };

        this.createNewUser = function (objNewUser) {
            return UserLookup.newUser(objNewUser);
        }

        this.createNewUserStakeHolder = function (objNewUser) {
            return UserLookup.newUserStakeHolder(objNewUser);
        }

        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }

        this.createAccessUser = function (obj) {
            return UserLookup.newAccessUser(obj);
        }

        this.deleteUser = function(id_user){
            return UserLookup.deleteUser(id_user);
        }

        this.getAccessMenuByRol = function(){
            return UserLookup.getAccessMenu();
        }

        this.updateAllAccessMenu = function(obj){
            return UserLookup.updateRolAccessMenu(obj);
        }

    });