/**
 * Created by VladimirIlich on 28/4/2016.
 */
angular.module("App")

    .controller("DeviceNewCtrl", function ($scope,
                                           $state,
                                           $log,
                                           $rootScope,
                                           $sessionStorage,
                                           DeviceService,
                                           growl,
                                           spinnerService,
                                           GLOBAL_CONSTANT ) {

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.deviceName = "";
        $scope.deviceDescription = "";


        var init = function () {
            console.info("Iniciando controlador DeviceNewCtrl");
            DeviceService.setShowGrowlMessage({isShow:false,message:""});
        }

        init();

        $scope.saveDevice = function () {

            console.info("Entro aqui");
            spinnerService.show("spinnerNew");

            var validObj = validateFieldNewDevice($scope.deviceName, $scope.deviceDescription);

            if (validObj.validate) {

                var objSend={
                    ReaxiumParameters:{
                        ReaxiumDevice:{
                            device_name: $scope.deviceName,
                            device_description: $scope.deviceDescription
                        }
                    }
                };

                DeviceService.createDevice(objSend)
                    .then(function (resp) {
                        spinnerService.hide("spinnerNew");
                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            DeviceService.setShowGrowlMessage({isShow: true,message:resp.ReaxiumResponse.message})
                            $state.go('device');
                        }
                        else{
                            growl.error(resp.ReaxiumResponse.message);
                        }
                    })
                    .catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error(err);
                        growl.error("Service not available");
                });

            }
            else {
                spinnerService.hide("spinnerNew");
                growl.error(validObj.message);
            }


        }


    })