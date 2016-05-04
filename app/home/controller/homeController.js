
angular.module('App')

.controller('HomeController',function ($scope,
                                       $state,
                                       $rootScope,
                                       UserService,
                                       $sessionStorage,
                                       GLOBAL_CONSTANT) {

    $scope.panelTimeline = false;
    //Menu
    $scope.menus = addActiveClassMenu($rootScope.appMenus,GLOBAL_CONSTANT.ID_HOME_MENU);
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;

});