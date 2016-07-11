/**
 * Created by VladimirIlich on 28/4/2016.
 */

angular.module("App")
    .controller("DeviceRelRouteCtrl", function ($scope,
                                                $rootScope,
                                                $sessionStorage,
                                                GLOBAL_CONSTANT,
                                                FILE_SYSTEM_ROUTE,
                                                DeviceService,
                                                $log,
                                                $filter,
                                                growl,
                                                spinnerService,
                                                $state,
                                                $stateParams,
                                                GLOBAL_MESSAGE) {


        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        $scope.routesFilter = [];
        $scope.allUserSelcStakeHolder = [];
        $scope.showTable = false;
        $scope.mytime_start = new Date();
        $scope.mytime_end = new Date();
        $scope.hstep = 1;
        $scope.mstep = 1;
        //$scope.ismeridian = true;


        function init() {
            console.info("Iniciando controlador DeviceRelRouteCtrl");

            if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
                console.error("Usuario no a iniciado session");
                $state.go("login");
            }
            else{
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_DEVICE_MENU);

                console.info("Id device: " + $stateParams.id_device);
                console.info("Mode Device Relation Route: "+$stateParams.modeDeviceRelRoute);

                if(!isEmptyString($stateParams.id_device) && $stateParams.id_device != null){
                    DeviceService.setRelUserDevice({isModeRel:Boolean($stateParams.modeDeviceRelRoute),id_device: $stateParams.id_device});
                }else{
                    $state.go("device");
                }

            }

        }

        init();

        /**
         * Method compare input with list server users filter
         * @param str
         * @returns {Array}
         */
        $scope.localSearch = function (str) {
            var matches = [];

            invokeServiceUserFilter(str);

            $scope.routesFilter.forEach(function (route) {
                matches.push(route);
                if ((route.route_number.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                    (route.route_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
                }
            });

            return matches;
        };


        /**
         * call services search user with filter
         * @param str
         */
        var invokeServiceUserFilter = function (str) {

            DeviceService.getRouteWithFilter(str)
                .then(function (result) {

                    if (result.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                        $scope.routesFilter = [];

                        var array = result.ReaxiumResponse.object;

                        array.forEach(function (entry) {
                            var aux = {
                                id_route: entry.id_route,
                                route_number: entry.route_number,
                                route_name: entry.route_name,
                                route_address: entry.route_address,
                                routes_stops_count: entry.routes_stops_count,
                                pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP
                            };

                            $scope.routesFilter.push(aux);
                        });

                    } else {
                        console.info(result.ReaxiumResponse.message);
                    }
                }).catch(function (err) {
                console.error("Error invocando service filter" + err);
            });
        };

        $scope.addRoute = function (str) {

            $log.debug(str.originalObject);

            if ($scope.allUserSelcStakeHolder.length == 0) {
                $scope.allUserSelcStakeHolder.push(str.originalObject);
                $scope.showTable = true;
            }

            clearInput('ex2');
        }


        $scope.deleteUserTable = function () {
            $scope.allUserSelcStakeHolder = [];
            $scope.showTable = false;
        }

        var clearInput = function (id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            }
            else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };

        /*$scope.changed_start = function(){
         $log.debug($scope.mytime_start);

         }

         $scope.changed_end = function(){
         $log.debug($filter('date')($scope.mytime_end,'shortTime'));
         }*/


        $scope.saveDeviceRelRoute = function () {

            if ($scope.allUserSelcStakeHolder.length > 0) {

                console.log($scope.mytime_start);
                console.log($scope.mytime_end);

                var start_date = $filter('date')($scope.mytime_start, 'HH:mm:ss');
                var end_date = $filter('date')($scope.mytime_end, 'HH:mm:ss');

                console.log(start_date);
                console.log(end_date);

                if(compararDosHoras(start_date,end_date)){

                    spinnerService.show("spinnerNew");

                    var objSend = {
                        ReaxiumParameters: {
                            ReaxiumDevice: {
                                device_id: DeviceService.getRelUserDevice().id_device,
                                id_route: $scope.allUserSelcStakeHolder[0].id_route,
                                start_date: start_date.trim() + ':00',
                                end_date: end_date.trim() + ':00'
                            }
                        }
                    }

                    console.log(objSend);

                    DeviceService.getAssociateADeviceWithRoute(objSend)
                        .then(function (resp) {
                            spinnerService.hide("spinnerNew");

                            if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                                DeviceService.setShowGrowlMessage({isShow: true, message: GLOBAL_MESSAGE.MESSAGE_ASSOCIATE_DEVICE_WITH_ROUTES})
                                $state.go('device');
                            }
                            else if(resp.ReaxiumResponse.code === '1'){
                                console.error("Error servicio: "+resp.ReaxiumResponse.message);
                                growl.error("The route you have selected is already associated to this device, please try with a different one.");
                            }
                            else {
                                console.error("Error servicio: "+resp.ReaxiumResponse.message);
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            }

                        }).catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error("Error servicio: "+err);
                    });

                }else{
                    console.error("Hora invalida");
                    growl.error("The start time may not be greater than the initial.");
                }

            } else {
                growl.warning(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
            }
        }

    })