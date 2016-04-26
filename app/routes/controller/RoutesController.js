/**
 * Created by VladimirIlich on 20/4/2016.
 */

angular.module("App")
.controller("RouteCtrl",function($scope,
                                 $log,
                                 $state,
                                 $rootScope,
                                 RoutesServices,
                                 spinnerService,
                                 $sessionStorage){

    //menu sidebar
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;

    var init = function(){
        console.log("Iniciando Controlador RouteCtrl");

        spinnerService.show("spinnerNew");

        var promiseAllRoutes = RoutesServices.allRoutesSystem();
        promiseAllRoutes.then(function(response){
            $scope.routes = response;
            spinnerService.hide("spinnerNew");
        }).catch(function(err){
            console.log("Error invocando servicio routes"+err);
        });
    }

    init();

});