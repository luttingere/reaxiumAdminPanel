/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

.factory("DeviceLookup",function($http,$q,CONST_PROXY_URL){

    var lookup = {};

    lookup.getAllDevice = function(){

        var defered = $q.defer();
        var promise = defered.promise;

         $http.get(CONST_PROXY_URL.PROXY_URL_ALL_DEVICES)
            .success(function(response){
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function(err){
                defered.reject(err);
        });
            return promise;
    }


    /**
     * Get User with filter
     * @param filters
     * @returns {*}
     */
    lookup.allUserWithFilter = function(filters){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_ALL_USER_WITH_FILTER,
            data: JSON.stringify({ReaxiumParameters:{Users:{filter:filters}}}),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise;
    };

    lookup.getAccessTypeByUser = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_CHECK_ACCESS_BY_USER,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise;
    }


    lookup.createAccessUserDevice = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_CREATE_ACCESS_USER_BY_DEVICE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise;
    }

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

    this.getTypeAccessByUser = function(obj){
        return DeviceLookup.getAccessTypeByUser(obj);
    }

    this.newCreateAccessUserByDevice = function(obj){
        return DeviceLookup.createAccessUserDevice(obj);
    }
})