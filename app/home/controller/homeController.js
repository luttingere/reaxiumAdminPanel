
angular.module('App')

.controller('HomeController',function ($scope,$state,$rootScope,UserService) {

    $scope.panelTimeline = false;
    //Menu
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};


   /* var init = function(){

    }

    init();*/
});