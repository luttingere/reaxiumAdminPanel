/**
 * Created by VladimirIlich on 21/5/2016.
 */
angular.module("App")
    .factory('BulkLookup', function ($http, $q, CONST_PROXY_URL){

        var lookup = {};

        lookup.bulkUsers = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_BULK_USERS_SYSTEM,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        lookup.bulkStops = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_BULK_STOPS_SYSTEM,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }

        lookup.bulkSchool = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_BULK_SCHOOL_SYSTEM,
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
    .service('BulkService',function(BulkLookup){

        var showGrowl = {
            isShow: false,
            message: ""
        };


        this.cleanGrowl = function(){
            this.setShowGrowlMessage({isShow:false,message:""});
        }

        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }

        this.sendBulkUsers = function(obj){
            return BulkLookup.bulkUsers(obj);
        }

        this.sendBulkStops = function(obj){
            return  BulkLookup.bulkStops(obj);
        }

        this.sendBulkSchool = function(obj){
            return BulkLookup.bulkSchool(obj);
        }


    })
