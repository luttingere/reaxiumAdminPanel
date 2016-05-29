/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

.factory("DeviceLookup",function($http,$q,CONST_PROXY_URL){

    var lookup = {};

    var deviceJson = {
        code:"",
        message:"",
        devices: {},
        totalPages: 0,
        totalRecords: 0
    };

    var routeDeviceJson = {
        code:"",
        message:"",
        routes:{},
        totalPages: 0,
        totalRecords: 0
    };

    var usersDeviceJson = {
        code:"",
        message:"",
        users:{},
        totalPages: 0,
        totalRecords: 0
    };

    var businessDeviceJson = {
        code:"",
        message:"",
        business:{},
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
            deviceJson.code = response.ReaxiumResponse.code;
            deviceJson.message = response.ReaxiumResponse.message;
            deviceJson.devices = response.ReaxiumResponse.object;
            deviceJson.totalPages = response.ReaxiumResponse.totalPages;
            deviceJson.totalRecords = response.ReaxiumResponse.totalRecords;

            defered.resolve(deviceJson);
        }).error(function(err){
            defered.reject(err);
        });

        return promise;
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

        return promise;
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

        return promise;

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

        return promise;
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

        return promise;
    }


    lookup.routeByDeviceId = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_GET_ROUTE_BY_DEVICE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            routeDeviceJson.code = response.ReaxiumResponse.code;
            routeDeviceJson.message = response.ReaxiumResponse.message;
            routeDeviceJson.routes = response.ReaxiumResponse.object;
            routeDeviceJson.totalPages = response.ReaxiumResponse.totalPages;
            routeDeviceJson.totalRecords = response.ReaxiumResponse.totalRecords;

            defered.resolve(routeDeviceJson);
        }).error(function(err){
            defered.reject(err);
        });

        return promise;

    }

    lookup.deleteRouteByDevice = function(id_device_route){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_DELETE_ROUTE_BY_DEVICE,
            data: JSON.stringify({ReaxiumParameters:{ReaxiumDevice:{id_device_routes:id_device_route}}}),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise;
    }


    lookup.getUsersByDevices = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_GET_USERS_ACCESS_BY_DEVICE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            usersDeviceJson.code = response.ReaxiumResponse.code;
            usersDeviceJson.message = response.ReaxiumResponse.message;
            usersDeviceJson.users = response.ReaxiumResponse.object;
            usersDeviceJson.totalPages = response.ReaxiumResponse.totalPages;
            usersDeviceJson.totalRecords = response.ReaxiumResponse.totalRecords;
            defered.resolve(usersDeviceJson);

        }).error(function(err){
            defered.reject(err);
        });

        return promise

    }


    lookup.deleteUserAccessDevice = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_DELETE_USERS_ACCESS_BY_DEVICE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    }

    lookup.getBusinessByDevice = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_GET_BUSINESS_BY_DEVICE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            businessDeviceJson.code = response.ReaxiumResponse.code;
            businessDeviceJson.message = response.ReaxiumResponse.message;
            businessDeviceJson.business = response.ReaxiumResponse.object;
            businessDeviceJson.totalPages = response.ReaxiumResponse.totalPages;
            businessDeviceJson.totalRecords = response.ReaxiumResponse.totalRecords;
            defered.resolve(businessDeviceJson);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    }

    lookup.deleteBusinessByDevice = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_DELETE_BUSINESS_BY_DEVICE,
            data: JSON.stringify(obj),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    }

    lookup.devideId = function(id_device){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_GET_DEVICE_ID,
            data: JSON.stringify({ReaxiumParameters:{ReaxiumDevice:{device_id:id_device}}}),
            headers: {'Content-Type':'application/json;charset=UTF-8'}
        }).success(function(response){
            defered.resolve(response);
        }).error(function(err){
            defered.reject(err);
        });

        return promise
    }


    lookup.allAccessUserRegister = function(obj){

        var defered = $q.defer();
        var promise = defered.promise;

        $http({
            method: 'POST',
            url: CONST_PROXY_URL.PROXY_URL_GET_ALL_ACCESS_USER,
            data: JSON.stringify(obj),
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

    var modeEdit={
        isModeEdit:false,
        id_device:""
    }


    var showGrowl = {
        isShow: false,
        message: ""
    };


    this.getModeEdit = function(){
        return modeEdit;
    }

    this.setModeEdit = function(obj){
        modeEdit = obj;
    }

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

    this.getRoutesByDeviceId = function(id_device){
        return DeviceLookup.routeByDeviceId(id_device);
    }

    this.deleteRouteByDevice = function(id_device){
        return DeviceLookup.deleteRouteByDevice(id_device);
    }


    this.getUsersRelationDevice = function(obj){
        return DeviceLookup.getUsersByDevices(obj);
    }

    this.deleteUsersAccessDevice = function(obj){
        return DeviceLookup.deleteUserAccessDevice(obj);
    }

    this.allBusinessByDeviceId = function(obj){
        return DeviceLookup.getBusinessByDevice(obj);
    }

    this.deleteBusinessByDevices = function(obj){
        return DeviceLookup.deleteBusinessByDevice(obj);
    }

    this.getDeviceById = function(device_id){
        return DeviceLookup.devideId(device_id);
    }

    this.getAllAccessUserDeviceConfig = function(obj){
        return DeviceLookup.allAccessUserRegister(obj);
    }
})