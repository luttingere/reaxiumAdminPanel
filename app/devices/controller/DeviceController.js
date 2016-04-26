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
                                  $sessionStorage){

    $scope.dataDevice={}

    //menu sidebar
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;

    var init = function(){

        console.log("Iniciando contolador DeviceCtrl");

        spinnerService.show("spinnerNew");
        DeviceService.setRelUserDevice({isModeRel:false, id_device: ""});

        var promiseAllDevice = DeviceService.allDeviceSystem();
        promiseAllDevice.then(function(response){
            $scope.devices = response;
            spinnerService.hide("spinnerNew");
        }).catch(function (err){
            console.log("Error en invocacion del servicio..."+err);
        })
    }

    init();

    $scope.addUserDevice = function(id_device){

        DeviceService.setRelUserDevice({isModeRel:true, id_device: id_device});
        $state.go("deviceRelUser");
    }


})