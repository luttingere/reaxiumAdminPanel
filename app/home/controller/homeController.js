
angular.module('App')

.controller('HomeController',function ($scope,
                                       $state,
                                       $rootScope,
                                       UserService,
                                       $sessionStorage) {

    $scope.panelTimeline = false;
    //Menu
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;

});