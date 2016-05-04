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
        $scope.menus = addActiveClassMenu($rootScope.appMenus,GLOBAL_CONSTANT.ID_DEVICE_MENU);
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        //$scope.listRoutesByDevice = [];
        $scope.showTableRoute = false;
        $scope.deviceId = "";

        $scope.totalPages = 0;

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                ReaxiumDevice:{
                    device_id: "",
                    page: 1,
                    limit:5,
                    sortDir: 'asc',
                    sortedBy: 'route_name',
                    filter: ''
                }
            }
        };


        /**
         * cabecera de la tabla de usuarios
         * @type {*[]}
         */
        $scope.deviceTableHeaders = [
            {
                title: 'Route Number',
                value: 'route_number'
            },
            {
                title: 'Route Name',
                value: 'route_name'
            }
        ];



        $scope.searchDevice = function () {

            if ($scope.deviceId != "") {

                console.log("Search Device....");

                spinnerService.show("spinnerNew");

                $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.device_id = $scope.deviceId;

                DeviceService.getRoutesByDeviceId($scope.filterCriteria)
                    .then(function (resp) {

                        if (resp.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            //$log.debug(resp);
                            $scope.listRoutesByDevice = resp.routes;
                            $scope.totalPages = resp.totalPages;
                            $scope.totalRecords = resp.totalRecords;
                            $scope.showTableRoute = true;
                        }
                        else {
                            console.info("Error: " + resp.message);
                            growl.error(resp.message);
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



        $scope.deleteRoute = function(id_device){

            $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
                .then(function() {

                    spinnerService.show("spinnerNew");

                    DeviceService.deleteRouteByDevice(id_device)
                        .then(function(resp){
                            if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                                $scope.filterCriteria.ReaxiumParameters.ReaxiumDevice.page = 1;
                                $scope.searchDevice();
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


       /* function deleteRouteListScope(id_device_routes){

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

        }*/


    })