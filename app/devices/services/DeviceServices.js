/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

.factory("DeviceLookup",function($http,CONST_PROXY_URL){

    var lookup = {};

    lookup.getAllDevice = function(){

        return $http({
            method:'GET',
            url: CONST_PROXY_URL.PROXY_URL_ALL_DEVICES
        }).then(function(response){
            return response.data.ReaxiumResponse.object;
        })
    }

    return lookup;
})

.service("DeviceService",function(DeviceLookup){

    this.allDeviceSystem = function(){
        return DeviceLookup.getAllDevice();
    }
})