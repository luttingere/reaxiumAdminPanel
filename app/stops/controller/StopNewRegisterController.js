/**
 * Created by VladimirIlich on 8/5/2016.
 */
angular.module('App')
    .controller('StopNewCtrl', function ($scope,
                                         $rootScope,
                                         $state,
                                         $sessionStorage,
                                         uiGmapGoogleMapApi,
                                         $log,
                                         StopsService,
                                         growl,
                                         spinnerService,
                                         GLOBAL_CONSTANT,
                                        GLOBAL_MESSAGE) {

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};
        $scope.showTable = false;

        $scope.addressStop = {
            number_stops: "",
            name_stop: ""
        };

        var jsonAddress = {};
        var cont_stops = 0;
        $scope.listProcessStops = [];

        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {
            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");

                var latitude = StopsService.getAdressStopDefault().latitude;
                var longitude = StopsService.getAdressStopDefault().longitude;

                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    zoom: 18,
                    options: {"MapTypeId": maps.MapTypeId.ROADMAP}
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
                $log.debug("lugar: ", place);
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }
                else {

                    jsonAddress.stop_address = place[0].formatted_address;
                    jsonAddress.stop_latitude = place[0].geometry.location.lat();
                    jsonAddress.stop_longitude = place[0].geometry.location.lng();
                    //$log.debug("json_event:", jsonAddress);
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


        $scope.searchbox = {
            'template': 'searchbox.tpl.html',
            'parentdiv': 'searchBoxParent',
            'options': {
                'autocomplete': true
            },
            'events': events
        }


        function init() {
            console.info("Inicio controlador StopNewCtrl...");

            if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
                console.error("Usuario no a iniciado session");
                $state.go("login");
            }
            else{
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus), GLOBAL_CONSTANT.ID_STOPS_MENU);
                $scope.addTheMap();
            }

        }


        /**
         * Init Ctrl
         */
        init();

        /**
         * add stops select in table
         */
        $scope.addTableStops = function () {

            if ($scope.addressStop.name_stop != "" &&
                $scope.addressStop.number_stops != "" &&
                jsonAddress.latitude != "" &&
                jsonAddress.longitude != "") {

                if (!existStop($scope.addressStop.number_stops, $scope.addressStop.name_stop)) {

                    $scope.showTable = true;
                    cont_stops++;
                    var addressFormat = $scope.addressStop.number_stops+"-"+$scope.addressStop.name_stop+" "+jsonAddress.stop_address;
                    jsonAddress.id_stop = cont_stops;
                    jsonAddress.stop_name = $scope.addressStop.name_stop;
                    jsonAddress.stop_number = $scope.addressStop.number_stops;
                    jsonAddress.stop_address = addressFormat;
                    $log.debug(jsonAddress);
                    $scope.listProcessStops.push(jsonAddress);
                    clearFields();
                }
                else {
                    growl.warning("Stop already added");
                }

            } else {
                console.log("Ingresar otra paradas..");
            }


        }


        /**
         * Delete stops
         * @param id_stop
         */
        $scope.deleteStopsSelect = function (id_stop) {

            var index = -1;
            for (var i = 0, len = $scope.listProcessStops.length; i < len; i++) {
                if ($scope.listProcessStops[i].id_stop === id_stop) {
                    index = i;
                    break;
                }
            }

            $scope.listProcessStops.splice(index, 1);

            clearFields();
        }

        /**
         * Save stops method
         */
        $scope.saveStops = function () {

            if ($scope.listProcessStops.length > 0) {
                spinnerService.show("spinnerNew");

                var jsonSend = {
                    ReaxiumParameters: {
                        ReaxiumStops: {
                            object: []
                        }
                    }
                };

                $scope.listProcessStops.forEach(function (entry) {
                    jsonSend.ReaxiumParameters.ReaxiumStops.object.push(entry);
                });

                $log.debug("Arreglo_final: ", jsonSend);

                StopsService.registerNewStops(jsonSend)
                    .then(function (resp) {
                        spinnerService.hide("spinnerNew");
                        if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            StopsService.setShowGrowlMessage({isShow:true,message:GLOBAL_MESSAGE.MESSAGE_CREATE_NEW_STOPS});
                            $state.go("stops");
                        }
                        else {
                            console.error("Error creado nueva ruta "+resp.ReaxiumResponse.message);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }
                    })
                    .catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error("Error creado nueva ruta " + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    })

            } else {
                console.log("Arreglo vacio no se puede guardar las paradas");
            }
        }

        /**
         * clean varables
         */
        function clearFields() {

            $scope.addressStop.number_stops = "";
            $scope.addressStop.name_stop = "";
            jsonAddress = {};

            if ($scope.listProcessStops.length == 0) {
                cont_stops = 0;
                $scope.showTable = false;
            }
        }

        function existStop(number_stop, name_stop) {

            var validate = false;
            $scope.listProcessStops.forEach(function (entry) {

                if (entry.stop_number.trim() === number_stop.trim() && entry.stop_name.trim() === name_stop.trim()) {
                    validate = true;
                }
            });

            return validate;
        }

    })