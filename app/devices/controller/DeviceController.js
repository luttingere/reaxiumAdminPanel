/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

.controller("DeviceCtrl",function($scope,$state,$log,$rootScope,DeviceService,spinnerService){

    $scope.dataDevice={}

    //menu sidebar
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};


    var init = function(){

        console.log("Iniciando contolador DeviceCtrl");

        spinnerService.show("spinnerNew");

        var promiseAllDevice = DeviceService.allDeviceSystem();
        promiseAllDevice.then(function(response){
            $scope.devices = response;
            spinnerService.hide("spinnerNew");
        })
    }

    init();

})