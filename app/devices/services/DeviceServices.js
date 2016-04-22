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

    return lookup;
})

.service("DeviceService",function(DeviceLookup){

    var relUserDevice ={
        isModeRel:false,
        id_device:""
    }

    this.getRelUserDevice = function(){
        return relUserDevice;
    }

    this.setRelUserDevice = function(obj){
        relUserDevice=obj;
    }

    this.allDeviceSystem = function(){
        return DeviceLookup.getAllDevice();
    }

    this.getAllUsersFilter = function(filterCriteria){
        return DeviceLookup.allUserWithFilter(filterCriteria);
    }
})