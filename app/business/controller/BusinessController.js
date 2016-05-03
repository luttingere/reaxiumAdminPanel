/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .controller("BusinessController", function ($scope,
                                                BusinessService,
                                                uiGmapGoogleMapApi,
                                                $state,
                                                $rootScope,
                                                spinnerService,
                                                $log,
                                                $sessionStorage,
                                                growl,
                                                $confirm,
                                                GLOBAL_MESSAGE,
                                                GLOBAL_CONSTANT) {

        console.log("Cargo el Controlador de Negocios");

        $scope.control = {}
        $scope.showPhoneModal = false;
        $scope.showAddressModal = false;
        $scope.showGeneralInfoModal = false;
        $scope.showNewUserModal = false;
        $scope.showMessage = "";

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        $scope.totalPages = 0;
        $scope.businessCount = 0;

        /**
         * cabecera de la tabla de negocios
         * @type {*[]}
         */
        $scope.businessTableHeaders = [{
            title: 'Business Name',
            value: 'business_name'
        }, {
            title: 'Business DNI',
            value: 'business_id_number'
        }
        ];

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                page: 1,
                limit: 10,
                sortDir: 'desc',
                sortedBy: 'business_name',
                filter: ''
            }
        };

        $scope.getAllBusiness = function () {

            spinnerService.show("spinnerBusinessList");
            BusinessService.cleanModeEdit();

            BusinessService.getBusiness($scope.filterCriteria).then(function (data) {
                $scope.business = data.business;
                $scope.totalPages = data.totalPages;
                console.log($scope.totalPages);
                $scope.totalRecords = data.totalRecords;
                spinnerService.hide("spinnerBusinessList");

                var messageGrowl = BusinessService.getShowGrowlMessage();

                if (messageGrowl.isShow) {
                    growl.info(messageGrowl.message);
                    BusinessService.cleanGrowl();
                }

            }).catch(function (err) {
                console.error("Error invocando servicio getAllBusiness " + err);
                $scope.business = [];
                $scope.totalPages = 0;
                $scope.totalRecords = 0;
                spinnerService.hide("spinnerBusinessList");
                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
            });
        }

        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            $scope.getAllBusiness();
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllBusiness();
        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllBusiness();
        };


        /**
         * Get a business of the system by his id
         * @param $scope
         * @param BusinessService
         * @private
         */
        $scope.findByBusinessId = function (businessId,$scope,loadMap) {
            if (BusinessService.getBusinessIdFound() != businessId) {
                var myPhonePromise = BusinessService.getBusinessById(businessId);
                myPhonePromise.then(function (result) {
                    $scope.businessFound = result[0];
                    if(loadMap){
                        $scope.addTheMap();
                    }
                });
            }
        }

        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {
            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado");
                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: $scope.businessFound.addres.latitude,
                        longitude: $scope.businessFound.addres.longitude
                    },
                    zoom: 16,
                    options: {"MapTypeId": maps.MapTypeId.HYBRID}
                };
                $scope.marker = {
                    coords: {
                        latitude: $scope.businessFound.addres.latitude,
                        longitude: $scope.businessFound.addres.longitude
                    }
                };

            });
        }

        var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }

                $scope.map = {
                    "center": {
                        "latitude": place[0].geometry.location.lat(),
                        "longitude": place[0].geometry.location.lng()
                    },
                    "zoom": 18
                };
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    }
                };
            }
        };

        $scope.searchbox = {
            'template': 'searchbox.tpl.html',
            'parentdiv': 'searchBoxParent',
            'options': {
                'autocomplete': true
            },
            'events': events
        };

        /**
         * get the user's phone information and show it in a modal and show it in a modal
         * @param userId
         */
        $scope.showPhoneInformation = function (businessId) {
            console.log("showPhoneInformation");
            $scope.findByBusinessId(businessId, $scope,false);
            $scope.showPhoneModal = !$scope.showPhoneModal;
        }

        /**
         * get the address information of a user and show it in a modal
         * @param userId
         */
        $scope.showAddressInformation = function (businessId) {
            console.log("showAddressInformation");
            $scope.findByBusinessId(businessId, $scope,true);
            $scope.showAddressModal = !$scope.showAddressModal;
        }


        /**
         * Edit Business Mode
         * @param id
         */
        $scope.editMode = function (id) {
            var obj = {isModeEdit: true, businessId: parseInt(id)};
            BusinessService.setModeEdit(obj);
            $state.go("newBusiness");
        }


        /**
         * Delete Business
         * @param businessId
         */
        $scope.deleteBusiness = function (businessId) {
            $confirm({text: 'Are you sure you want to delete?'})
                .then(function () {
                    BusinessService.deleteBusiness(businessId)
                        .then(function (resp) {
                            if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                                $scope.selectPage(1);
                                growl.success(resp.ReaxiumResponse.message);
                            } else {
                                growl.error(resp.ReaxiumResponse.message);
                            }
                        })
                        .catch(function (err) {
                            console.error("Error invocando servicio delete: " + err);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        });
                });
        }


        $scope.selectPage(1);
        return $scope;

    })

