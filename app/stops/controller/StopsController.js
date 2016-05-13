/**
 * Created by VladimirIlich on 8/5/2016.
 */

angular.module('App')
    .controller('StopsCtrl',function($state,
                                     $rootScope,
                                     $scope,
                                     $sessionStorage,
                                     spinnerService,
                                     StopsService,
                                     growl,
                                     $confirm,
                                     $log,
                                     uiGmapGoogleMapApi,
                                     GLOBAL_CONSTANT,
                                     GLOBAL_MESSAGE){

        //menu sidebar
        $scope.menus = addActiveClassMenu($rootScope.appMenus,GLOBAL_CONSTANT.ID_STOPS_MENU);
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        $scope.totalPages = 0;
        var loadServices = true;

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                ReaxiumStops:{
                    page: 1,
                    limit:10,
                    sortDir: 'asc',
                    sortedBy: 'stop_name',
                    filter: ''
                }
            }
        };

        $scope.stopsTableHeaders = [{
            title: 'Stop Number',
            value: 'stop_number'
        }, {
            title: 'Stop Name',
            value: 'stop_name'
        }, {
            title: 'Stop Address',
            value: 'stop_address'
        }];


        function init() {
            console.info("Inicio controlador StopsCtrl...");

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

        init();

        $scope.getAllStops = function(){
            console.info("Iniciando Controlador StopsCtrl");

            spinnerService.show("spinnerNew");

            StopsService.allStopsWithPaginate($scope.filterCriteria)
                .then(function(data){
                    spinnerService.hide("spinnerNew");
                    if(StopsService.getShowGrowlMessage().isShow){
                        growl.info(StopsService.getShowGrowlMessage().message);
                        StopsService.cleanGrowlRoute();
                    }
                    $log.debug(data);
                    $scope.stops = data.stops;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;
                })
                .catch(function(err){
                    console.error("Error invocando servicio stops"+err);
                    spinnerService.hide("spinnerNew");
                    $scope.stops = [];
                    $scope.totalPages = 0;
                    $scope.totalRecords = 0;
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
        }


        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            if(loadServices){
                $scope.getAllStops();
            }
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllStops();
        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            console.log("OnSort");
            $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllStops();
        };

        //init search page 1
        $scope.selectPage(1);

        /**
         * Delete Stop
         * @param id_stop
         */
        $scope.deleteStop = function(id_stop){

            $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
                .then(function() {
                    spinnerService.show("spinnerNew");
                    StopsService.deleteStops(id_stop)
                        .then(function(resp){
                            spinnerService.hide("spinnerNew");
                            if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                                $scope.selectPage(1);
                                growl.success(resp.ReaxiumResponse.message);
                            }else{
                                growl.error(resp.ReaxiumResponse.message);
                            }
                        })
                        .catch(function(err){
                            console.error("Error invocando servicio delete: "+err);
                            spinnerService.hide("spinnerNew");
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        });
                });
        };


        /**
         * Find Stop by iD
         * @param stop_id
         * @param loadMap
         */
        $scope.findByStopId = function(stop_id,loadMap){

            StopsService.stopById(stop_id)
                .then(function(resp){
                    if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                        $scope.stopData = resp.ReaxiumResponse.object[0];
                        if(loadMap){
                            $scope.addTheMap();
                        }
                    }else{
                        console.info(resp.ReaxiumResponse.message);
                    }
                })
                .catch(function(err){
                    console.error("Error: "+err);
                });

        };


        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {

            var latitude = isUndefined($scope.stopData.stop_latitude) ? StopsService.getAdressStopDefault.latitude : $scope.stopData.stop_latitude;
            var longitude = isUndefined($scope.stopData.stop_longitude) ? StopsService.getAdressStopDefault.longitude : $scope.stopData.stop_longitude;

            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");
                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: latitude,
                        longitude:longitude
                    },
                    zoom: 18,
                    options: {"MapTypeId": maps.MapTypeId.ROADMAP}
                };
                $scope.marker = {
                    coords: {
                        latitude: latitude,
                        longitude: longitude
                    }
                };

            });
        };


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
         * get the address information of a user and show it in a modal
         * @param stopId
         */
        $scope.showAddressInformation = function (stopId) {
            console.log("showAddressInformation");
            $scope.findByStopId(stopId,true);
            $scope.showAddressModal = !$scope.showAddressModal;
        };


    })
