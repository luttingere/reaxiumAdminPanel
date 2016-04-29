/**
 * Created by VladimirIlich on 20/4/2016.
 */
angular.module("App")
    .factory("RouteLookup", function ($http, $q, CONST_PROXY_URL, $log) {

        var lookUpRoute = {};

        var routeJson = {
            routes: {},
            totalPages: 0,
            totalRecords: 0
        };

        lookUpRoute.getAllRoutesWithPaginate = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_ALL_ROUTES
            }).success(function (response) {

                routeJson.routes = response.ReaxiumResponse.object;
                routeJson.totalPages = response.ReaxiumResponse.totalPages;
                routeJson.totalRecords = response.ReaxiumResponse.totalRecords;
                defered.resolve(routeJson);

            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookUpRoute.getAllStops = function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_STOPS
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        }


        lookUpRoute.getStopsWithFilter = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters: {Stops: {filter: filterCriteria}}}),
                url: CONST_PROXY_URL.PROXY_URL_ALL_STOPS
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookUpRoute.createRouteWithStops = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_CREATE_ROUTE
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookUpRoute.getRouteById = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify(obj),
                url: CONST_PROXY_URL.PROXY_URL_GET_ROUTE_BY_ID_WITH_STOPS
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        }

        lookUpRoute.deleteRoute = function(id_route){

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({ReaxiumParameters:{ReaxiumRoutes:{id_route:id_route}}}),
                url: CONST_PROXY_URL.PROXY_URL_DELETE_ROUTE
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        }

        return lookUpRoute;
    })
    .service("RoutesServices", function (RouteLookup) {

        var showGrowl = {
            isShow: false,
            message: ""
        };

        var objModeEdit = {
            isModeEdit: false,
            id_route: "0"
        };


        this.cleanGrowlRoute = function(){
            this.setShowGrowlMessage({isShow:false,message: ""});
        }


        this.cleanModeEditRoute = function(){
            this.setModeEdit({isModeEdit: false, id_route: "0"});
        }

        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }

        this.getModeEdit = function () {
            return objModeEdit;
        };
        this.setModeEdit = function (mode) {
            objModeEdit = mode;
        };

        this.allRoutesWithPagination = function (obj) {
            return RouteLookup.getAllRoutesWithPaginate(obj);
        };

        this.allStops = function () {
            return RouteLookup.getAllStops();
        };

        this.allStopsWithFilter = function (filter) {
            return RouteLookup.getStopsWithFilter(filter);
        };

        this.newCreateRoute = function (obj) {
            return RouteLookup.createRouteWithStops(obj);
        };

        this.getRouteByIdWithStops = function (obj) {
            return RouteLookup.getRouteById(obj);
        }

        this.deleteRoute = function(id_route){
            return RouteLookup.deleteRoute(id_route);
        }

    })
