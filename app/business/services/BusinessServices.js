/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .factory('BusinessLookup', function ($http, $q, CONST_PROXY_URL) {

        var lookup = {};
        var businessIdFound = 0;
        var businessJson = {
            business: {},
            totalPages: 0,
            totalRecords: 0
        };


        /**
         *
         * @returns {IPromise<TResult>|*}
         */
        lookup.allBusiness = function (filterCriteria) {

            var defered = $q.defer();
            var promise = defered.promise;


            $http({
                method: 'POST',
                data: JSON.stringify(filterCriteria),
                url: CONST_PROXY_URL.PROXY_URL_ALL_BUSINESS_WITH_PAGINATE,
            }).success(function (response) {
                businessJson.business = response.ReaxiumResponse.object;
                businessJson.totalPages = response.ReaxiumResponse.totalPages;
                businessJson.totalRecords = response.ReaxiumResponse.totalRecords;
                defered.resolve(businessJson);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };
        /**
         * search a business by his ID
         */
        lookup.businessById = function (businessId) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                data: JSON.stringify({'ReaxiumParameters': {'Business': {'business_id': businessId}}}),
                url: CONST_PROXY_URL.PROXY_URL_BUSINESS_BY_ID,
            }).success(function (response) {
                var jsonObj = response.ReaxiumResponse.object;
                businessIdFound = jsonObj[0].business_id;
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            })

            return promise;
        };

        /**
         * Get Business with filter
         * @param filters
         * @returns {*}
         */
        lookup.allBusinessWithFilter = function (filters) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_ALL_BUSINESS_WITH_FILTER,
                data: JSON.stringify({ReaxiumParameters: {Business: {filter: filters}}}),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        };



        /**
         * get all status available in system
         * @returns {*}
         */
        lookup.allStatus = function () {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'GET',
                url: CONST_PROXY_URL.PROXY_URL_ALL_STATUS_USER
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse.object);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;

        }

        /**
         * create new business
         * @param obj
         * @returns {*}
         */
        lookup.newBusiness = function (obj) {

            var defered = $q.defer();
            var promise = defered.promise;

            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_CREATE_NEW_BUSINESS,
                data: JSON.stringify(obj),
                headers: {'Content-Type': 'application/json;charset=UTF-8'}
            }).success(function (response) {
                defered.resolve(response.ReaxiumResponse);
            }).error(function (err) {
                defered.reject(err);
            });

            return promise;
        }


        lookup.getBusinessIdFound = function () {
            return businessIdFound;
        }


        /**
         * Delete Business
         * @param businessId
         * @returns {d.promise|*|promise}
         */
        lookup.deleteABusiness = function(businessId){
            var defered = $q.defer();
            var promise = defered.promise;
            $http({
                method: 'POST',
                url: CONST_PROXY_URL.PROXY_URL_DELETE_BUSINESS_BY_ID,
                data: JSON.stringify({ReaxiumParameters:{Business:{business_id:businessId}}}),
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

    .service('BusinessService', function (BusinessLookup) {

        var objModeEdit = {
            isModeEdit: false,
            businessId: 0
        };

        var addressDefault = {
            latitude: 37.0902,
            longitude: -95.7129
        }

        var showGrowl = {
            isShow: false,
            message: ""
        };

        var objBusinessById = {};

        this.cleanGrowl = function(){
            this.setShowGrowlMessage({isShow:false,message:""});
        }

        this.cleanModeEdit = function(){
            this.setModeEdit({isModeEdit:false,businessId:0});
        }

        this.getObjBusinessById = function () {
            return objBusinessById;
        }

        this.setObjBusinessById = function (obj) {
            objBusinessById = obj;
        }

        this.getAddressDefault = function () {
            return addressDefault;
        }

        this.getModeEdit = function () {
            return objModeEdit;
        };
        this.setModeEdit = function (mode) {
            objModeEdit = mode;
        };

        this.getBusiness = function (filter) {
            return BusinessLookup.allBusiness(filter);
        };
        this.getBusinessById = function (businessId) {
            return BusinessLookup.businessById(businessId);
        };
        this.getBusinessIdFound = function () {
            return BusinessLookup.getBusinessIdFound();
        };


        this.getAllStatus = function () {
            return BusinessLookup.allStatus();
        };

        this.createNewBusiness = function (objNewBusiness) {
            return BusinessLookup.newBusiness(objNewBusiness)
        }

        this.getShowGrowlMessage = function () {
            return showGrowl;
        }

        this.setShowGrowlMessage = function (obj) {
            showGrowl = obj;
        }

        this.deleteBusiness = function(businessId){
            return BusinessLookup.deleteABusiness(businessId)
        }
    });