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
                                                 GLOBAL_MESSAGE) {


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


        $scope.deleteDevice = function(id_device){

            $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
                .then(function() {
                   /* DeviceService.deleteDevice(id_device)
                        .then(function(resp){
                            if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                                $scope.selectPage(1);
                                growl.success(resp.ReaxiumResponse.message);
                            }else{
                                growl.error(resp.ReaxiumResponse.message);
                            }
                        }).catch(function(err){
                        console.error("Error invocando servicio delete: "+err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });*/
                });
        }


    })