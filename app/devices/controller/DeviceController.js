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

    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    $scope.totalPages = 0;

    var loadServices = true;

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


    function init() {

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
        }

    }

    init();


    $scope.getDevices = function(){

        console.log("Iniciando controlador DeviceCtrl");

        spinnerService.show("spinnerNew");
        DeviceService.cleanRelUserDevice();
        DeviceService.cleanRelRouteDevice();

        DeviceService.allDeviceWithPagination($scope.filterCriteria)
            .then(function(data){

                $log.debug(data);
                    $scope.devices = data.devices;
                    $scope.totalPages = data.totalPages;
                    $scope.totalRecords = data.totalRecords;

                    var messageGrowl = DeviceService.getShowGrowlMessage();

                    if(messageGrowl.isShow){
                        growl.info(messageGrowl.message);
                        DeviceService.cleanGrowlDevice();
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
        if(loadServices){
            $scope.getDevices();
        }
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
                            growl.success(GLOBAL_MESSAGE.MESSAGE_DELETE_DEVICE  );
                        }else{
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }
                    }).catch(function(err){
                        console.error("Error invocando servicio delete: "+err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            });
    }



})