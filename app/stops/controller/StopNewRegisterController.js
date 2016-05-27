/**
 * Created by VladimirIlich on 8/5/2016.
 */
var app = angular.module('App');
app.controller('StopNewCtrl', function ($scope,
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
    $scope.address=[];
    $scope.listProcessStops = [];


    var jsonAddressPlaces = {};
    var addressDefault = null;


    $scope.map = {
        center: {
            latitude: "",
            longitude: ""
        },
        zoom: 18,
        options: {"MapTypeId": ""},
        markers: [],
        events: {
            click: function (mapModel, eventName, originalEventArgs) {

                $scope.$apply(function () {
                    var e = originalEventArgs[0];
                    var marker = {};
                    marker.coords = {};
                    marker.windowOptions = {
                        visible: false,
                        id_stops: ''
                    };
                    marker.id = Date.now();
                    marker.coords.latitude = e.latLng.lat();
                    marker.coords.longitude = e.latLng.lng();
                    //buscar address con servicio de google map
                    getAddressGoogleApi(e.latLng.lat()+','+e.latLng.lng(),marker.id);
                    marker.title = "Lat: " + e.latLng.lat().toString().substring(0, 8) + " Lng:" + e.latLng.lng().toString().substring(0, 8);
                    $scope.map.markers.push(marker);
                    $log.debug($scope.map.markers);

                    StopsService.setListMarkets($scope.map.markers);
                });
            }
        }

    };


    /**
     * add a google map with the location of the user address
     */
    $scope.addTheMap = function () {
        uiGmapGoogleMapApi.then(function (maps) {
            console.log("Google map cargado...");

            maps.visualRefresh = true;

            $scope.map.center.latitude = StopsService.getAdressStopDefault().latitude;
            $scope.map.center.longitude = StopsService.getAdressStopDefault().longitude;
            $scope.map.options.MapTypeId = maps.MapTypeId.ROADMAP;
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

                addressDefault = place[0].formatted_address;
            }

            $scope.map.center.latitude = place[0].geometry.location.lat();
            $scope.map.center.longitude = place[0].geometry.location.lng();
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

        if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
            console.error("Usuario no a iniciado session");
            $state.go("login");
        }
        else {
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

            if (isEmptyArray($scope.map.markers)) {

                $scope.showTable = true;
                $scope.listProcessStops=[];
                $scope.map.markers.forEach(function (entry) {

                    jsonAddressPlaces = {};
                    jsonAddressPlaces.stop_latitude = entry.coords.latitude;
                    jsonAddressPlaces.stop_longitude = entry.coords.longitude;
                    jsonAddressPlaces.id_stop = entry.id;

                    $scope.address.forEach(function(address){
                        if(address.id == entry.id){
                            jsonAddressPlaces.stop_address = address.address;
                            var formatAddress = address.address.split(',');
                            var numberStop = formatAddress[0].split(' ');
                            jsonAddressPlaces.stop_number = numberStop[0];
                            jsonAddressPlaces.stop_name = formatAddress[0];
                            return;
                        }
                    });

                    $scope.listProcessStops.push(jsonAddressPlaces);
                });

                $log.debug($scope.listProcessStops);

            } else {
                $scope.showTable = false;
                growl.warning("Add stops to continue the process");
                console.log("No existe stops preseleccionados");
            }

    }


    $scope.$watchCollection('StopsService.getListMarkets', function (newCollection, oldCollection) {
        $scope.map.markets = newCollection;
    });

    $scope.onClick = function (market) {
        market.windowOptions.visible = !market.windowOptions.visible;
        StopsService.setIdMarket(market.id);

    }

    $scope.closeClick = function (market) {
        market.windowOptions.visible = false;
    };


    $scope.cleanAllStops = function () {
        $scope.map.markers = [];
        $scope.address=[];
        $scope.showTable = false;
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
                        StopsService.setShowGrowlMessage({
                            isShow: true,
                            message: GLOBAL_MESSAGE.MESSAGE_CREATE_NEW_STOPS
                        });
                        $state.go("stops");
                    }
                    else {
                        console.error("Error creado nueva ruta " + resp.ReaxiumResponse.message);
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


    function existStop(number_stop, name_stop) {

        var validate = false;
        $scope.listProcessStops.forEach(function (entry) {

            if (entry.stop_number.trim() === number_stop.trim() && entry.stop_name.trim() === name_stop.trim()) {
                validate = true;
            }
        });

        return validate;
    }


    function getAddressGoogleApi(geo,id) {

        StopsService.getAddressGoogleApi(geo)
            .then(function (resp) {
                if (resp.status === 'OK') {
                    $log.debug(resp);
                   $scope.address.push({id:id,address:resp.results[0].formatted_address});
                }
            })
            .catch(function (err) {
                console.error("Error invocando servicio google Api: " + err);
                $scope.address = addressDefault;
                $scope.address.push({id:id,address:addressDefault});
            });
    }
});

app.controller('infoWindowCtrl', function ($scope, $log, StopsService) {

    var arrayMarkets = [];
    var id = null;
    $scope.showInfo = function () {
        id = StopsService.getIdMarket();
        arrayMarkets = StopsService.getListMarkets();
        deleteStopMarket(id);
    }


    function deleteStopMarket(id) {

        var index = -1;
        for (var i = 0, len = arrayMarkets.length; i < len; i++) {
            if (arrayMarkets[i].id === id) {
                index = i;
                break;
            }
        }

        arrayMarkets.splice(index, 1);

        StopsService.setListMarkets(arrayMarkets);
    };
});