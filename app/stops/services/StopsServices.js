/**
 * Created by VladimirIlich on 8/5/2016.
 */

angular.module('App')

    .factory("StopsLookup", function ($http, $q, CONST_PROXY_URL) {

        var lookUpStops = {};

        var stopJson = {
            stops: {},
            totalPages: 0,
            totalRecords: 0
        };
        var stopUsersJson = {
            users: {},
            totalPages: 0,
            totalRecords: 0
        };


        lookUpStops.getAllStopsWithPaginate = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_ALL_STOPS
            }).success(function (response) {
                stopJson.stops = response.ReaxiumResponse.object;
                stopJson.totalPages = response.ReaxiumResponse.totalPages;
                stopJson.totalRecords = response.ReaxiumResponse.totalRecords;
                defered.resolve(stopJson);

            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        };

        lookUpStops.getStopsWithFilter = function(filterCriteria){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters:{Stops:{filter: filterCriteria}}}),
                url: CONST_PROXY_URL.PROXY_URL_STOPS_WITH_FILTER
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        };

        lookUpStops.createStops = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_CREATE_STOPS
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        };

        lookUpStops.associationStopAndUser = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_ASSOCIATION_STOP_AND_USER
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        };

        lookUpStops.deleteStop = function(id_stop){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters:{ReaxiumStops:{id_stop:id_stop}}}),
                url: CONST_PROXY_URL.PROXY_URL_DELETE_STOP
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        }


        lookUpStops.getStopById = function(id_stop){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters:{ReaxiumStops:{id_stop:id_stop}}}),
                url: CONST_PROXY_URL.PROXY_URL_GET_STOP_BY_ID
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookUpStops.getUserByStop = function(obj){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_GET_USERS_BY_STOP
            }).success(function (response) {
                stopUsersJson.code = response.ReaxiumResponse.code;
                stopUsersJson.message = response.ReaxiumResponse.message;
                stopUsersJson.users = response.ReaxiumResponse.object;
                stopUsersJson.totalPages = response.ReaxiumResponse.totalPages;
                stopUsersJson.totalRecords = response.ReaxiumResponse.totalRecords;
                defered.resolve(stopUsersJson);

            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        }


        lookUpStops.delUserByStop = function(id_stop_usr){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters:{ReaxiumStops:{id_stops_user:id_stop_usr}}}),
                url: CONST_PROXY_URL.PROXY_URL_DELETE_USERS_BY_STOP
            }).success(function (response) {
                defered.resolve(response);

            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookUpStops.getAddressApiGoogle = function(geo){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+geo+"&sensor=false"
            }).success(function (response) {
                defered.resolve(response);

            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookUpStops.getRouteAsociateStop = function(id_stop){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters:{ReaxiumStops:{stop_id:id_stop}}}),
                url: CONST_PROXY_URL.PROXY_URL_ROUTES_ASSOCIATE_STOP
            }).success(function (response) {
                defered.resolve(response);

            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        return lookUpStops;
    })
    .service("StopsService", function (StopsLookup) {

        var showGrowl = {
            isShow: false,
            message: ""
        };

        var modeAsociateUserStop = {
            modeAsociateUserStop:false,
            id_stop: "0"
        };

        var addressStopsDefault = {
            latitude: 25.7824618,
            longitude: -80.3011209
        };

        var markets=[];

        var id_market_stop = "";

        this.getIdMarket = function(){
            return id_market_stop;
        }

        this.setIdMarket = function(id){
            id_market_stop = id;
        }

        this.getListMarkets = function(){
            return markets;
        }


        this.setListMarkets = function(obj){
            markets = obj;
        }

        this.getModeAsociateUserStop = function(){
            return modeAsociateUserStop;
        }

        this.setModeAsociateUserStop = function(obj){
            modeAsociateUserStop = obj;
        }

        this.cleanGrowlRoute = function(){
            this.setShowGrowlMessage({isShow:false,message: ""});
        };

        this.getShowGrowlMessage = function () {
            return showGrowl;
        };

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        };


        this.getAdressStopDefault = function(){
            return addressStopsDefault;
        }

        this.allStopsWithPaginate = function(obj){
            return StopsLookup.getAllStopsWithPaginate(obj);
        };

        this.stopsWithFilter = function(filter){
            return StopsLookup.getStopsWithFilter(filter);
        };

        this.registerNewStops = function(obj){
            return StopsLookup.createStops(obj);
        };

        this.registerAssociationStopAndUser = function(obj){
            return StopsLookup.associationStopAndUser(obj);
        };

        this.deleteStops = function(id_stop){
            return StopsLookup.deleteStop(id_stop);
        }

        this.stopById = function(id_stop){
            return StopsLookup.getStopById(id_stop);
        }

        this.allUsersByStop = function(obj){
            return StopsLookup.getUserByStop(obj);
        }

        this.deleteUserByStop = function(id_stop_user){
            return StopsLookup.delUserByStop(id_stop_user);
        }

        this.getAddressGoogleApi = function(geo){
            return StopsLookup.getAddressApiGoogle(geo);
        }

        this.routeAsociateStop = function(id_stop){
            return StopsLookup.getRouteAsociateStop(id_stop);
        }
    })
