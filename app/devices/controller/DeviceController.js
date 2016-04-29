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
                                  $confirm){

    $scope.dataDevice={}

    //menu sidebar
    $scope.menus = $rootScope.appMenus;
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
    $scope.deviceTableHeaders = [{
        title: 'Device Name',
        value: 'device_name'
    }, {
        title: 'Device Description',
        value: 'device_description'
    }
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
        DeviceService.setRelUserDevice({isModeRel:false, id_device: ""});
        DeviceService.setRelRouteDevice({isDeviceRelRoute:false,id_device: ""});

        DeviceService.allDeviceWithPagination($scope.filterCriteria)
            .then(function(data){
                $log.debug(data);
                $scope.devices = data.devices;
                $scope.totalPages = data.totalPages;
                $scope.totalRecords = data.totalRecords;
                spinnerService.hide("spinnerNew");

                var messageGrowl = DeviceService.getShowGrowlMessage();

                if(messageGrowl.isShow){
                    growl.info(messageGrowl.message)
                }

            }).catch(function(err){
            console.error("Error en invocacion del servicio..."+err);
            spinnerService.hide("spinnerUserList");
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

    $scope.accessUserDevice = function(id_device){

        DeviceService.setRelUserDevice({isModeRel:true, id_device: id_device});
        $state.go("deviceRelUser");
    }


    $scope.deviceRelRoute = function(id_device){
        DeviceService.setRelRouteDevice({isDeviceRelRoute:true,id_device:id_device});
        $state.go("deviceRelRoute");
    }

    $scope.deleteDevice = function(id_device){

        $confirm({text: 'Are you sure you want to delete?'})
            .then(function() {

            });
    }

})