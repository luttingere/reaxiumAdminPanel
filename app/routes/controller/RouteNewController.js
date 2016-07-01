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
                                          GLOBAL_CONSTANT,
                                          GLOBAL_MESSAGE) {


        //Search on the menu
        $scope.menuOptions = {searchWord: ''};
        $scope.disabledFields = false;
        $scope.stopsFilter = [];
        $scope.listStops = [];
        $scope.selectTypeRoute = "";
        $scope.showTable = false;
        $scope.allListStopSelect = [];
        $scope.listMarker = [];
        $scope.nameRoute = "";
        $scope.numberRoute = "";

        var objSend = {
            ReaxiumParameters: {
                ReaxiumRoutes: {
                    stops: []
                }
            }
        };

        $scope.map = {
            center: {
                latitude:"",
                longitude:"",
            },
            zoom: 16,
            bounds: {},
            control:{},
            options: {}
        };


        var loadServices = true;
        var mapGogole = null;
        var directionsDisplay = null;
        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {

            var latitude =  RoutesServices.getAddressDefault().latitude;
            var longitude = RoutesServices.getAddressDefault().longitude;

            console.log("latitude: "+latitude);
            console.log("longitude: "+longitude);

            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");
                maps.visualRefresh = true;
                mapGogole = maps;
                directionsDisplay = new mapGogole.DirectionsRenderer();

                $scope.map.center.latitude = latitude;
                $scope.map.center.longitude = longitude;
                $scope.map.center.options = {"MapTypeId": mapGogole.MapTypeId.ROADMAP};

            }).catch(function (err) {
                console.error("Error Cargando map Google" + err);
            })
        };



        $scope.addTheMapEdit = function (arrayStopsOrder) {

            var latitude =  RoutesServices.getAddressDefault().latitude;
            var longitude = RoutesServices.getAddressDefault().longitude;

            console.log("latitude: "+latitude);
            console.log("longitude: "+longitude);

            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");
                maps.visualRefresh = true;
                mapGogole = maps;
                directionsDisplay = new mapGogole.DirectionsRenderer();

                $scope.map.center.latitude = latitude;
                $scope.map.center.longitude = longitude;
                $scope.map.center.options = {"MapTypeId": mapGogole.MapTypeId.ROADMAP};

                findPath(arrayStopsOrder);

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
                //menu sidebar
                $scope.menus =  addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_ROUTES_MENU);

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
                            $scope.selectTypeRoute = respService.route_type;

                            respService.stops.forEach(function(entry){

                                $scope.allListStopSelect.push({
                                    id_stop: entry.id_stop,
                                    stop_number: entry.stop_number,
                                    stop_name: entry.stop_name,
                                    stop_latitude: entry.stop_latitude,
                                    stop_longitude: entry.stop_longitude,
                                    stop_address: entry.stop_address,
                                    pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP,
                                    order_stop:entry._joinData.order_stop
                                });
                            });


                            //ordernar por lista de paradas en la tabla orden stop
                            $scope.allListStopSelect.sort(function(a,b){
                                return a.order_stop - b.order_stop;
                            });

                            var arrayStopsOrder= [];

                            $scope.allListStopSelect.forEach(function (entry) {
                                arrayStopsOrder.push({id_stop: entry.id_stop,order_stop:entry.order_stop,latitude:entry.stop_latitude,longitude:entry.stop_longitude});
                            });

                            //ordernar por orden stop
                            arrayStopsOrder.sort(function(a,b){
                               return a.order_stop - b.order_stop;
                            });

                            $scope.addTheMapEdit(arrayStopsOrder);

                            $scope.disabledFields = true;
                            $scope.showTable = true;

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
                                pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP,
                                order_stop:0
                            };

                            $scope.stopsFilter.push(aux);
                        });

                    }
                }).catch(function (err) {
                console.error("Error invocando service filter" + err);
            });
        };


        $scope.addStopsSelect = function (objStops) {

            if(!searchObjList(objStops.originalObject.id_stop)){
                $scope.showTable = true;
                $scope.allListStopSelect.push(objStops.originalObject);
            }else{
                console.log("Parada ya fue preseleccionado");
                growl.warning("Stop is already included in your shortlist");
            }

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


            if ($scope.allListStopSelect.length == 0) {
                $scope.showTable = false;
            }
        }


        /**
         * Process Stops
         */
        $scope.processStops = function () {

            if (isEmptyArray($scope.allListStopSelect)) {

                var arrayStopsOrder= [];

                var contOrder=1;
                $scope.allListStopSelect.forEach(function (entry) {

                    arrayStopsOrder.push({id_stop: entry.id_stop,order_stop:contOrder,latitude:entry.stop_latitude,longitude:entry.stop_longitude});
                    contOrder++
                });

                findPath(arrayStopsOrder);

            } else {
                growl.warning("You must add stops to continue the process");
            }

        }

        /**
         * Clean stops the table
         */
        $scope.cleanStops = function () {
            $scope.allListStopSelect = [];
            $scope.listMarker = [];
            directionsDisplay.setMap(null);
        };

        /**
         * Save Method
         */
        $scope.saveRoute = function () {

            if($scope.allListStopSelect.length > 0 && $scope.nameRoute != "" && $scope.numberRoute != "" && $scope.selectTypeRoute){

                spinnerService.show("spinnerNew");

                objSend.ReaxiumParameters.ReaxiumRoutes.route_name = $scope.nameRoute;
                objSend.ReaxiumParameters.ReaxiumRoutes.route_number = $scope.numberRoute;
                objSend.ReaxiumParameters.ReaxiumRoutes.route_address = "Miami, Florida, EE. UU.";
                objSend.ReaxiumParameters.ReaxiumRoutes.route_type_id = $scope.selectTypeRoute;

                if(RoutesServices.getModeEdit().isModeEdit){
                    objSend.ReaxiumParameters.ReaxiumRoutes.id_route = RoutesServices.getModeEdit().id_route;
                }

                var cont = 1;
                $scope.allListStopSelect.forEach(function (entry) {
                    objSend.ReaxiumParameters.ReaxiumRoutes.stops.push({id_stop: entry.id_stop,order_stop:cont});
                    cont++
                });

                $log.debug("Objeto para enviar", objSend);

                RoutesServices.newCreateRoute(objSend)
                    .then(function (res) {
                        spinnerService.hide("spinnerNew");
                        if (res.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            RoutesServices.setShowGrowlMessage({isShow:true,message: GLOBAL_MESSAGE.MESSAGE_ROUTE_CREATE_SUCCESS});
                            $state.go("routes");
                        }
                        else {
                            console.error("Error creado nueva ruta "+res.ReaxiumResponse.message);
                            growl.error("Error create new route");
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


        /**
         * Valida si el usuario ya esta en la lista
         * @param id_user
         * @returns {boolean}
         */
        function searchObjList(id_stop) {

            var validate = false;

            if ($scope.allListStopSelect.length > 0) {

                $scope.allListStopSelect.forEach(function (entry) {

                    if (entry.id_stop == id_stop) {
                        validate = true;
                    }
                });
            }

            return validate;
        }



          function findPath(listStops){

            //using the direction service of google map api
             // mapGogole
            var size  = listStops.length;

              console.log(listStops[0]);
              console.log(listStops[size-1]);

              var waypts = [];

              listStops.forEach(function(entry){
                  var local = entry.latitude+','+entry.longitude;
                  waypts.push({location:local,stopover: true})
              });

              $log.debug(waypts);

                   var directionsService = new mapGogole.DirectionsService();

                   directionsDisplay.setMap($scope.map.control.getGMap());

                  var request = {

                      origin: new mapGogole.LatLng(
                          listStops[0].latitude,
                          listStops[0].longitude
                      ),
                      destination: new mapGogole.LatLng(
                          listStops[size-1].latitude,
                          listStops[size-1].longitude
                      ),
                      travelMode: mapGogole.TravelMode['DRIVING'],
                      waypoints:waypts,
                      optimizeWaypoints: true

                  };

                  directionsService.route(request, function(response, status) {

                      if(status === 'OK'){
                          $log.debug(response);
                          objSend.ReaxiumParameters.ReaxiumRoutes.overview_polyline = response.routes[0].overview_polyline;
                          directionsDisplay.setDirections(response);
                      }else{
                          console.error("Error cargado ruta en el mapa: "+status);
                          objSend.ReaxiumParameters.ReaxiumRoutes.overview_polyline = null;
                      }

                  });


        }

    });

