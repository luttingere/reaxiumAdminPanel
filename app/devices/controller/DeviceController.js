/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

.controller("DeviceCtrl",function($scope,
                                  $state,
                                  $log,
                                  $rootScope,
                                  DeviceService,
                                  spinnerService,
                                  $sessionStorage,
                                  growl,
                                  $confirm,
                                  GLOBAL_MESSAGE,
                                  GLOBAL_CONSTANT){

    $scope.dataDevice={}

    //menu sidebar
    $scope.menus = addActiveClassMenu($rootScope.appMenus,GLOBAL_CONSTANT.ID_DEVICE_MENU);

    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;

    $scope.totalPages = 0;

    /**
     * cabecera de la tabla de usuarios
     * @type {*[]}
     */
    $scope.deviceTableHeaders = [
        {
            title: 'Device Name',
            value: 'device_name'
        },
        {
            title: 'Device Description',
            value: 'device_description'
        },
        {
            title:'Configured',
            value:'configured'
        },
    ];

    //default criteria that will be sent to the server
    $scope.filterCriteria = {
        ReaxiumParameters: {
            page: 1,
            limit:5,
            sortDir: 'asc',
            sortedBy: 'device_name',
            filter: ''
        }
    };


    $scope.getDevices = function(){

        console.log("Iniciando contolador DeviceCtrl");

        spinnerService.show("spinnerNew");
        DeviceService.cleanRelUserDevice();
        DeviceService.cleanRelRouteDevice();

        DeviceService.allDeviceWithPagination($scope.filterCriteria)
            .then(function(data){
                $log.debug(data);

                if(data.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                    $scope.devices = data.devices;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;

                    var messageGrowl = DeviceService.getShowGrowlMessage();

                    if(messageGrowl.isShow){
                        growl.info(messageGrowl.message);
                        DeviceService.cleanGrowlDevice();
                    }
                }else{
                    console.info(data.message);
                    growl.error(data.message);
                }

                spinnerService.hide("spinnerNew");

            }).catch(function(err){
            console.error("Error en invocacion del servicio..."+err);
            spinnerService.hide("spinnerNew");
            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
        });

    }


    //called when navigate to another page in the pagination
    $scope.selectPage = function () {
        $scope.getDevices();
    };

    //Will be called when filtering the grid, will reset the page number to one
    $scope.filterResult = function () {
        $scope.filterCriteria.ReaxiumParameters.page = 1;
        $scope.getDevices();

    };

    //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
    $scope.onSort = function (sortedBy, sortDir) {
        console.log("OnSort");
        $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
        $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
        $scope.filterCriteria.ReaxiumParameters.page = 1;
        $scope.getDevices();
    };


    $scope.selectPage(1);

   /* $scope.accessUserDevice = function(id_device){
        DeviceService.setRelUserDevice({isModeRel:true, id_device: id_device});
        $state.go("deviceRelUser");
    }


    $scope.deviceRelRoute = function(id_device){
        DeviceService.setRelRouteDevice({isDeviceRelRoute:true,id_device:id_device});
        $state.go("deviceRelRoute");
    }*/

    $scope.deleteDevice = function(id_device){

        $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
            .then(function() {
                DeviceService.deleteDevice(id_device)
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
                });
            });
    }



})