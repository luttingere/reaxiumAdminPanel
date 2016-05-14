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

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.deviceName = "";
        $scope.deviceDescription = "";

        var loadServices = true;

        var init = function () {
            console.info("Iniciando controlador DeviceNewCtrl");

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
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_DEVICE_MENU);
                DeviceService.setShowGrowlMessage({isShow:false,message:""});
            }

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