/**
 * Created by VladimirIlich on 20/4/2016.
 */
angular.module("App")
    .factory("RouteLookup",function($http,CONST_PROXY_URL){

        var lookupRoute={};

        lookupRoute.getAllRoutes = function(){
            return $http({
                method:'GET',
                url:CONST_PROXY_URL.PROXY_URL_ALL_ROUTES
            }).then(function(response){
                return response.data.ReaxiumResponse.object;
            })
        }

        return lookupRoute;
    })
    .service("RoutesServices",function(RouteLookup){

        this.allRoutesSystem = function(){
            return RouteLookup.getAllRoutes()
        }
    })
