/**
 * Created by VladimirIlich on 20/4/2016.
 */
angular.module("App")
    .factory("RouteLookup",function($http,$q,CONST_PROXY_URL,$log){

        var lookupRoute={};

        lookupRoute.getAllRoutes = function(){

            var defered = $q.defer();
            var promise = defered.promise;

             $http({
                method:'GET',
                url:CONST_PROXY_URL.PROXY_URL_ALL_ROUTES
            }).success(function(response){
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function(err){
                defered.reject(err);
            });

            return promise;
        }

        return lookupRoute;
    })
    .service("RoutesServices",function(RouteLookup){

        this.allRoutesSystem = function(){
            return RouteLookup.getAllRoutes()
        }
    })
