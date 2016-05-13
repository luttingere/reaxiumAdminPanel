/**
 * Created by VladimirIlich on 26/4/2016.
 */

angular.module("App")
    .controller("RouteNewCtrl", function ($scope,
                                          $rootScope,
                                          $sessionStorage,
                                          $log,
                                          $state,
                                          RoutesServices,
                                          StopsService,
                                          UserService,
                                          spinnerService,
                                          uiGmapGoogleMapApi,
                                          $stateParams,
                                          growl,
                                          FILE_SYSTEM_ROUTE,
                                          GLOBAL_CONSTANT) {

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        $scope.stopsFilter = [];
        $scope.listStops = [];
        $scope.showTable = false;
        $scope.allListStopSelect = [];
        $scope.listMarker = [];
        $scope.nameRoute = "";
        $scope.numberRoute = "";
        $scope.polylines = [
            {
                id: 1,
                path: [],
                stroke: {
                    color: '#6060FB',
                    weight: 2
                },
                editable: false,
                draggable: false,
                geodesic: true,
                visible: true,
                icons: [{
                    icon: {},
                    offset: '25px',
                    repeat: '50px'
                }]
            }
        ];


        var loadServices = true;

        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {

            var latitude = RoutesServices.getModeEdit().isModeEdit ? $scope.polylines[0].path[0].latitude : RoutesServices.getAddressDefault().latitude;
            var longitude = RoutesServices.getModeEdit().isModeEdit ? $scope.polylines[0].path[0].longitude : RoutesServices.getAddressDefault().longitude;

            console.log("latitude: "+latitude);
            console.log("longitude: "+longitude);

            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");
                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    zoom: 14,
                    bounds: {},
                    options: {"MapTypeId": maps.MapTypeId.ROADMAP}
                };

                $scope.polylines[0].icons[0].icon.path = maps.SymbolPath.CIRCLE

            }).catch(function (err) {
                console.error("Error Cargando map Google" + err);
            })
        };


        function validateSession(){

            if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
                console.error("Usuario no a iniciado session");
                loadServices = false;
                $state.go("login");
            }
            else{
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
            }

        }

        validateSession();

        /**
         * Method Initial
         */
        function init() {
            console.info("Iniciando RouteNewCtrl...");
            console.info("Id Route: "+$stateParams.id_route);
            console.info("Mode edition: "+$stateParams.edit);

            RoutesServices.setShowGrowlMessage({isShow:false,message:""});
            RoutesServices.setModeEdit({isModeEdit:Boolean($stateParams.edit),id_route:$stateParams.id_route});

            if(RoutesServices.getModeEdit().isModeEdit){

                spinnerService.show("spinnerNew");

                var objSend = {
                    ReaxiumParameters:{
                        ReaxiumRoutes:{
                            id_route: RoutesServices.getModeEdit().id_route
                        }
                    }
                };


                RoutesServices.getRouteByIdWithStops(objSend)
                    .then(function(resp){

                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            spinnerService.hide("spinnerNew");

                           var respService = resp.ReaxiumResponse.object[0];

                            $scope.nameRoute = respService.route_name;
                            $scope.numberRoute = respService.route_number;

                            respService.stops.forEach(function(entry){

                                $scope.allListStopSelect.push({
                                    id_stop: entry.id_stop,
                                    stop_number: entry.stop_number,
                                    stop_name: entry.stop_name,
                                    stop_latitude: entry.stop_latitude,
                                    stop_longitude: entry.stop_longitude,
                                    stop_address: entry.stop_address,
                                    pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP
                                });
                            });

                            var cont = 0;
                            $scope.allListStopSelect.forEach(function (entry) {
                                cont++;
                                $scope.polylines[0].path.push({latitude: entry.stop_latitude, longitude: entry.stop_longitude});
                                $scope.listMarker.push({id: entry.id_stop, latitude: entry.stop_latitude, longitude: entry.stop_longitude})
                            });

                            $scope.showTable = true;
                            $scope.addTheMap();

                        }else{
                            console.info("Error respuesta del servicio getRouteByIdWithStops");
                            RoutesServices.setShowGrowlMessage({isShow:true,message:"Error Internal Plataform"});
                            $state.go('routes');
                        }

                    })
                    .catch(function(err){
                        console.info("Error respuesta del servicio getRouteByIdWithStops "+err);
                        RoutesServices.setShowGrowlMessage({isShow:true,message:"Error Internal Plataform "});
                        $state.go('routes');
                    });

            }else{
                //modo normal
                $scope.addTheMap();
            }

        }

        if(loadServices){
            init();
        }


        /**
         * Method compare input with list server users filter
         * @param str
         * @returns {Array}
         */
        $scope.localSearch = function (str) {
            var matches = [];

            invokeServiceUserFilter(str);

            $scope.stopsFilter.forEach(function (stops) {

                if ((stops.stop_number.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                    (stops.stop_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {

                    matches.push(stops);
                }
            });

            return matches;
        };


        /**
         * call services search user with filter
         * @param str
         */
        var invokeServiceUserFilter = function (str) {

            StopsService.stopsWithFilter(str)
                .then(function (result) {

                    if (result.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                        $scope.stopsFilter = [];
                        var array = result.ReaxiumResponse.object;
                        array.forEach(function (entry) {
                            var aux = {
                                id_stop: entry.id_stop,
                                stop_number: entry.stop_number,
                                stop_name: entry.stop_name,
                                stop_latitude: entry.stop_latitude,
                                stop_longitude: entry.stop_longitude,
                                stop_address: entry.stop_address,
                                pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP
                            };

                            $scope.stopsFilter.push(aux);
                        });

                    }
                }).catch(function (err) {
                console.error("Error invocando service filter" + err);
            });
        };


        $scope.addStopsSelect = function (objStops) {
            $log.debug(objStops);
            $scope.showTable = true;
            $scope.allListStopSelect.push(objStops.originalObject);
            clearInput('ex2');

        }


        var clearInput = function (id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            }
            else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };

        /**
         * Delete stops select
         * @param id_stop
         */
        $scope.deleteStopsSelect = function (id_stop) {

            console.log("Delete Element: " + id_stop);
            var index = -1;
            for (var i = 0, len = $scope.allListStopSelect.length; i < len; i++) {
                if ($scope.allListStopSelect[i].id_stop === id_stop) {
                    index = i;
                    break;
                }
            }

            console.log("Delete  Pos: " + index);
            $scope.allListStopSelect.splice(index, 1);

            $log.debug($scope.allListStopSelect);

            var indexMarket = -1;
            for (var i = 0, len = $scope.listMarker.length; i < len; i++) {
                if ($scope.listMarker[i].id === id_stop) {
                    indexMarket = i;
                    break;
                }
            }

            $scope.polylines[0].path.splice(indexMarket, 1);
            $scope.listMarker.splice(indexMarket, 1);
        }


        $scope.processStops = function () {

            if (isEmptyArray($scope.allListStopSelect)) {

                $scope.allListStopSelect.forEach(function (entry) {

                    if(searchObjGeo(entry.stop_latitude,entry.stop_longitude,$scope.polylines[0].path)){
                        $scope.polylines[0].path.push({latitude: entry.stop_latitude, longitude: entry.stop_longitude});
                    }

                    if(searchObjGeo(entry.stop_latitude,entry.stop_longitude,$scope.listMarker)){
                        $scope.listMarker.push({id: entry.id_stop, latitude: entry.stop_latitude, longitude: entry.stop_longitude});
                    }

                });

            } else {
                growl.error("You must enter stop");
            }

        }


        $scope.cleanStops = function () {
            $scope.allListStopSelect = [];
            $scope.polylines[0].path = [];
            $scope.listMarker = [];
        };

        $scope.saveRoute = function () {

            if($scope.allListStopSelect.length > 0 && $scope.nameRoute != "" && $scope.numberRoute != ""){

                spinnerService.show("spinnerNew");

                var objSend = {
                    ReaxiumParameters: {
                        ReaxiumRoutes: {
                            stops: []
                        }
                    }
                };

                objSend.ReaxiumParameters.ReaxiumRoutes.route_name = $scope.nameRoute;
                objSend.ReaxiumParameters.ReaxiumRoutes.route_number = $scope.numberRoute;
                objSend.ReaxiumParameters.ReaxiumRoutes.route_address = "Miami, Florida, EE. UU.";

                $scope.allListStopSelect.forEach(function (entry) {
                    objSend.ReaxiumParameters.ReaxiumRoutes.stops.push({id_stop: entry.id_stop});
                });

                $log.debug("Objeto para enviar", objSend);

                RoutesServices.newCreateRoute(objSend)
                    .then(function (res) {
                        spinnerService.hide("spinnerNew");
                        if (res.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            RoutesServices.setShowGrowlMessage({isShow:true,message:res.ReaxiumResponse.message});
                            $state.go("routes");
                        }
                        else {
                            console.error("Error creado nueva ruta "+res.ReaxiumResponse.message);
                            growl.error("Error create new route ");
                        }
                    }).catch(function (err) {
                    spinnerService.hide("spinnerNew");
                    console.error("Error creado nueva ruta " + err);
                    growl.error("Error create new route ");
                });
            }
            else{
                console.log("Add stops to save the new route");
                growl.warning("Add stops to save the new route");
            }

        }
    });

