/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Users')

    .factory('UserLookup', function ($http) {
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
                url: 'http://54.200.133.84/reaxium/Users/allUsersInfo',
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
                    url: 'http://54.200.133.84/reaxium/Users/userInfo',
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
    });