/**
 * Created by VladimirIlich on 2/5/2016.
 */

angular.module("App")
    .controller('DeviceViewRouteCtrl', function ($scope,
                                                 $state,
                                                 $sessionStorage,
                                                 $rootScope,
                                                 DeviceService,
                                                 $log,
                                                 growl,
                                                 spinnerService,
                                                 GLOBAL_CONSTANT,
                                                 GLOBAL_MESSAGE,
                                                 $confirm) {


        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.listRoutesByDevice = [];
        $scope.showTableRoute = false;
        $scope.deviceId = "";

        $scope.searchDevice = function () {

            if ($scope.deviceId != "") {

                spinnerService.show("spinnerNew");

                DeviceService.getRoutesByDeviceId($scope.deviceId)
                    .then(function (resp) {

                        if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $log.debug(resp);
                            $scope.listRoutesByDevice = resp.ReaxiumResponse.object;
                            $scope.showTableRoute = true;
                        }
                        else {
                            console.info("Error: " + resp.ReaxiumResponse.message);
                            growl.error(resp.ReaxiumResponse.message);
                        }
                        spinnerService.hide("spinnerNew");
                    })
                    .catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error("Error: " + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });

            } else {
                growl.error("Plese enter the device Id");
            }
        }


        $scope.deleteRoute = function(id_device){

            $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
                .then(function() {

                    spinnerService.show("spinnerNew");

                    DeviceService.deleteRouteByDevice(id_device)
                        .then(function(resp){
                            if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                                deleteRouteListScope(id_device);
                                growl.success(resp.ReaxiumResponse.message);
                            }else{
                                console.error("Error: "+resp.ReaxiumResponse.message);
                                growl.error(resp.ReaxiumResponse.message);
                            }

                            spinnerService.hide("spinnerNew");

                        }).catch(function(err){
                        spinnerService.hide("spinnerNew");
                        console.error("Error invocando servicio delete: "+err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });
                });
        }


        function deleteRouteListScope(id_device_routes){

            if($scope.listRoutesByDevice.length > 0){

                var index = -1;
                for (var i = 0, len = $scope.listRoutesByDevice.length; i < len; i++) {
                    if ($scope.listRoutesByDevice[i].id_device_routes === id_device_routes) {
                        index = i;
                        break;
                    }
                }

                $scope.listRoutesByDevice.splice(index, 1);
            }

        }


    })