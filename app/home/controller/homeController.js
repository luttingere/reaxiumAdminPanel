
angular.module('Home')

.controller('HomeController',function ($scope,$state,$rootScope) {

    $scope.panelTimeline = false;
    //Menu
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};


});