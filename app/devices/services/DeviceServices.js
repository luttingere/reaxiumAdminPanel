/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

.factory("DeviceLookup",function($http,$q,CONST_PROXY_URL){

    var lookup = {};

    var deviceJson = {
        devices: {},
        totalPages: 0,
        totalRecords: 0
    };

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
    };


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
    };


    lookup.getDeviceWithPagination = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_ALL_DEVICES_WITH_PAGINATE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){

            deviceJson.devices = response.ReaxiumResponse.object;
            deviceJson.totalPages = response.ReaxiumResponse.totalPages;
            deviceJson.totalRecords = response.ReaxiumResponse.totalRecords;

            defered.resolve(deviceJson);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    };

    lookup.newRegisterDevice = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_CREATE_DEVICES,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){

            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    };

    lookup.allRouteWithFilter = function(filters){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_ALL_ROUTE_WITH_FILTER,
            data: JSON.stringify({ReaxiumParameters:{ReaxiumRoutes:{filter:filters}}}),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise

    };


    lookup.associateADeviceWithRoute = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_ASSOCIATE_A_DEVICE_WITH_ROUTE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    }


    lookup.deleteDevice = function(id_device){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_DELETE_DEVICE,
            data: JSON.stringify({ReaxiumParameters:{ReaxiumDevice:{device_id:id_device}}}),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    }

    return lookup;
})

.service("DeviceService",function(DeviceLookup){

    var relUserDevice ={
        isModeRel:false,
        id_device:""
    }

    var relRouteDevice={
        isDeviceRelRoute:false,
        id_device:""
    }

    var showGrowl = {
        isShow: false,
        message: ""
    };


    this.cleanGrowlDevice = function(){
        this.setShowGrowlMessage({ isShow: false, message: ""});
    }

    this.cleanRelUserDevice = function(){
        this.setRelUserDevice({isModeRel:false,id_device:""});
    }

    this.cleanRelRouteDevice = function(){
        this.setRelRouteDevice({isDeviceRelRoute:false, id_device:""});
    }

    this.getRelRouteDevice = function(){
        return relRouteDevice;
    }

    this.setRelRouteDevice = function(obj){
        relRouteDevice=obj;
    }

    this.getShowGrowlMessage = function () {
        return showGrowl;
    }

    this.setShowGrowlMessage = function (obj) {
        showGrowl = obj;
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

    this.allDeviceWithPagination = function(obj){
        return DeviceLookup.getDeviceWithPagination(obj);
    }

    this.createDevice = function(obj){
        return DeviceLookup.newRegisterDevice(obj);
    }

    this.getRouteWithFilter = function(filter){
        return DeviceLookup.allRouteWithFilter(filter);
    }

    this.getAssociateADeviceWithRoute = function(obj){
        return DeviceLookup.associateADeviceWithRoute(obj);
    }

    this.deleteDevice = function(id_device){
        return DeviceLookup.deleteDevice(id_device);
    }
})