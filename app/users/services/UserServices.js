/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Users')

    .factory('UserLookup', function ($http) {
        var lookup = {};
        lookup.allUsers = function () {
            return $http({
                method: 'GET',
                url: 'http://54.200.133.84/reaxium/Users/allUsersInfo',
            }).then(function (response) {
                var jsonObj = response.data;
                return jsonObj.ReaxiumResponse.object;
            });
        };
        return lookup;
    })

    .service('UserService', function (UserLookup) {
        this.getUsers = function(){
            return UserLookup.allUsers();
        };
    });