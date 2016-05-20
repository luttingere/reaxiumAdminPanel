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
                                                 GLOBAL_MESSAGE,
                                                 $confirm) {

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        $scope.listUsersByDevice = [];
        $scope.showTableRoute = false;
        $scope.deviceId = "";

        $scope.totalPages = 0;

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                ReaxiumDevice: {
                    device_id: "",
                    page: 1,
                    limit: 10,
                    sortDir: 'asc',
                    sortedBy: 'first_last_name',
                    filter: ''
                }
            }
        };


        /**
         * cabecera de la tabla de usuarios
         * @type {*[]}
         */
        $scope.userTableHeaders = [{
            title: 'Name',
            value: 'first_name'
        }, {
            title: 'Last Name',
            value: 'first_last_name'
        }, {
            title: 'DNI',
            value: 'document_id'
        }
        ];


        function init(){

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

                if ($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_SCHOOL) {
                    $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.business_id = $sessionStorage.id_business;
                }
            }
        }

        init();


        $scope.searchDevice = function () {

            if ($scope.deviceId != "") {

                spinnerService.show("spinnerNew");

                $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.device_id = $scope.deviceId;

                DeviceService.getUsersRelationDevice($scope.filterCriteria)
                    .then(function (resp) {

                        if (resp.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            //$log.debug(resp);
                            $scope.listUsersByDevice = resp.users;
                            $scope.totalPages = resp.totalPages;
                            $scope.totalRecords = resp.totalRecords;

                            $scope.showTableRoute = true;
                        }
                        else {
                            console.info("Error: " + resp.message);
                            growl.warning("The device has no associated users");
                        }
                        spinnerService.hide("spinnerNew");
                    })
                    .catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error("Error: " + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });

            } else {
                growl.warning("Please enter the device id to continue");
            }
        }


        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            $scope.searchDevice();
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.page = 1;
            $scope.searchDevice();

        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            console.log("OnSort");
            $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.page = 1;
            $scope.searchDevice();
        };


        $scope.deleteUser = function (user_access_data_id) {

            if (!isEmptyString(user_access_data_id) && !isEmptyString($scope.deviceId)) {

                $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
                    .then(function () {
                        spinnerService.show("spinnerNew");

                        var jsonSend = {
                            ReaxiumParameters: {
                                ReaxiumDevice: {
                                    device_id: $scope.deviceId,
                                    user_access_data_id: user_access_data_id
                                }
                            }
                        };

                        DeviceService.deleteUsersAccessDevice(jsonSend)
                            .then(function (resp) {
                                if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                                    $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.page = 1;
                                    $scope.searchDevice();
                                    growl.success(GLOBAL_MESSAGE.MESSAGE_DELETE_USERS_OF_DEVICE);
                                }else{
                                    console.error("Error: "+resp.ReaxiumResponse.message);
                                    growl.error(resp.ReaxiumResponse.message);
                                }

                                spinnerService.hide("spinnerNew");
                            })
                            .catch(function (err) {
                                spinnerService.hide("spinnerNew");
                                console.error("Error invocando servicio delete: "+err);
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        })

                    });
            } else {
                console.error("Datos incompletos para borrar registro");
            }

        }


    })
