/**
 * Created by VladimirIlich on 2/5/2016.
 */
angular.module("App")
    .controller('DeviceViewUsersCtrl', function ($scope,
                                                 $state,
                                                 $log,
                                                 $rootScope,
                                                 $sessionStorage,
                                                 spinnerService,
                                                 growl,
                                                 DeviceService,
                                                 GLOBAL_CONSTANT,
                                                 GLOBAL_MESSAGE) {

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.listUsersByDevice = [];
        $scope.showTableRoute = false;
        $scope.deviceId = "";


        $scope.searchDevice = function () {

            if ($scope.deviceId != "") {

                spinnerService.show("spinnerNew");

                DeviceService.getUsersRelationDevice($scope.deviceId)
                    .then(function (resp) {

                        if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            $log.debug(resp);
                            $scope.listUsersByDevice = resp.ReaxiumResponse.object;
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


        $scope.deleteUser = function(user_access_data_id){

            console.log("id: "+user_access_data_id);


        }


    })
