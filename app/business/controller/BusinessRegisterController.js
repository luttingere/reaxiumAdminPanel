/**
 * Created by VladimirIlich G&G on 7/4/2016.
 */

angular.module('App')

    .controller('BusinessNewCtrl', function ($scope,
                                             uiGmapGoogleMapApi,
                                             BusinessService,
                                             $log,
                                             $timeout,
                                             $rootScope,
                                             spinnerService,
                                             FILE_SYSTEM_ROUTE,
                                             $state,
                                             $sessionStorage,
                                             growl) {



        $scope.modeEdit = false;
        $scope.showgrowlMessage = false;
        $scope.showMessage = "";
        $scope.headerName = "";

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.business = {
            business_id: null,
            business_name: "",
            business_id_number: "",
            address_id: "",
            phone_number_id: "",
            status_id: ""
        };

        $scope.phoneNumbers = {
            phone_number_id: null,
            phone_name: "Office",
            phone_number: ""
        }


        var addressObj = {
            address_id: null,
            address: "",
            latitude: "",
            longitude: ""
        }


        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {
            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");

                var latitude = (BusinessService.getModeEdit().isModeEdit) ? addressObj.latitude : BusinessService.getAddressDefault().latitude;
                var longitude = (BusinessService.getModeEdit().isModeEdit) ? addressObj.longitude : BusinessService.getAddressDefault().longitude;

                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    zoom: 16,
                    options: {"MapTypeId": maps.MapTypeId.HYBRID}
                };
                $scope.marker = {
                    coords: {
                        latitude: latitude,
                        longitude: longitude
                    }
                };
            })
        }

        /**
         * Event relationship google maps
         * @type {{places_changed: events.places_changed}}
         */
        var events = {
            places_changed: function (searchBox) {

                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }
                else {
                    addressObj.address = place[0].formatted_address;
                    addressObj.latitude = place[0].geometry.location.lat();
                    addressObj.longitude = place[0].geometry.location.lng();
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
        }


        /**
         * Method initial controller
         */
        $scope.init = function () {

            console.log("Iniciando controlador BusinessNewCtrl...");
            BusinessService.setShowGrowlMessage({isShow: false, message: ""});

            var myStatus = BusinessService.getAllStatus();
            myStatus.then(function (result) {
                $scope.allStatus = result;
            }).catch(function (err) {
                console.error("Error servicio allStatus: " + err);
            });

            //validate mode edit
            if (BusinessService.getModeEdit().isModeEdit) {

                console.log("Esta en modo editar...");

                var promiseBusinessById = BusinessService.getBusinessById(BusinessService.getModeEdit().businessId);
                promiseBusinessById.then(function (result) {

                    try {

                        $log.debug(result);
                        BusinessService.setObjBusinessById(result);
                        $scope.headerName = result[0].business_name;
                        $scope.business.business_id = result[0].business_id;
                        $scope.business.business_name = result[0].business_name;
                        $scope.business.business_id_number = result[0].business_id_number;
                        $scope.business.status_id = result[0].status_id;

                        //Address
                        addressObj.address_id = result[0].addres == null ? null : result[0].addres.address_id;
                        addressObj.latitude = result[0].addres == null ? BusinessService.getAddressDefault().latitude : result[0].addres.latitude;
                        addressObj.longitude = result[0].addres == null ? BusinessService.getAddressDefault().longitude : result[0].addres.longitude;
                        addressObj.address = result[0].addres == null ? "No disponible" : result[0].addres.address;
                        $scope.address = result[0].addres == null ? "No disponible" : result[0].addres.address;

                        //PhoneNumber
                        $scope.phoneNumbers.phone_number_id = result[0].phone_number == null ? null : result[0].phone_number.phone_number_id;
                        $scope.phoneNumbers.phone_name = result[0].phone_number == null ? null : result[0].phone_number.phone_name;
                        $scope.phoneNumbers.phone_number = result[0].phone_number == null ? null : result[0].phone_number.phone_number;





                        $scope.addTheMap();
                    }
                    catch (err) {
                        console.log("error cargando los datos para editar: " + err);
                    }
                    finally {
                        //spinnerService.hide("spinnerNew");
                    }
                }).catch(function (err) {
                    console.error("Error servicio getBusinessById " + err);
                });
            } else {
                $scope.addTheMap();
            }
        }

        /**
         * Method initial controller
         */
        $scope.init();

        $scope.searchbox = {
            'template': 'searchbox.tpl.html',
            'parentdiv': 'searchBoxParent',
            'options': {
                'autocomplete': true
            },
            'events': events
        }

        /**
         * Method save new business
         */
        $scope.saveNewBusiness = function () {

            $scope.showgrowlMessage = false;

            spinnerService.show("spinnerNew");

            var dataNewBusiness = {
                ReaxiumParameters: {
                    Business: {
                        business_id: $scope.business.business_id,
                        business_name: $scope.business.business_name,
                        business_id_number: $scope.business.business_id_number,
                        status_id:$scope.business.status_id
                    },
                    BusinessPhoneNumbers:
                        {
                            phone_number_id :$scope.phoneNumbers.phone_number_id,
                            phone_name: $scope.phoneNumbers.phone_name,
                            phone_number: cleanMaskPhone($scope.phoneNumbers.phone_number)
                        }
                    ,
                    BusinessAddress:
                        {
                            address_id:  addressObj.address_id,
                            address: addressObj.address,
                            latitude: addressObj.latitude,
                            longitude: addressObj.longitude
                        }

                }
            };

            $log.debug("Objeto para enviar", dataNewBusiness);

            var validObj = validateParamNewBusiness(dataNewBusiness);

            if (validObj.validate) {

                var promiseCreateBusiness = BusinessService.createNewBusiness(dataNewBusiness);
                promiseCreateBusiness.then(function (response) {
                    if (response.code == 0) {
                        BusinessService.setShowGrowlMessage({isShow: true, message: response.message});
                        spinnerService.hide("spinnerNew");
                        $state.go("AllBusiness");
                    } else {
                        spinnerService.hide("spinnerNew");
                        growl.error(response.message)
                    }
                });

            } else {
                spinnerService.hide("spinnerNew");
                growl.error(validObj.message);
            }
        }
    });
