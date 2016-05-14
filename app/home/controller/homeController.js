
angular.module('App')

.controller('HomeController',function ($scope,
                                       $state,
                                       $rootScope,
                                       UserService,
                                       $sessionStorage,
                                       GLOBAL_CONSTANT) {

    $scope.panelTimeline = false;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};


    /**
     * Method init
     */
    function init(){

        console.info("Iniciando controlador HomeController");

        if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
            console.error("Usuario no a iniciado session");
            $state.go("login");
        }
        else{
            //data user by session
            $scope.photeUser = $sessionStorage.user_photo;
            $scope.nameUser = $sessionStorage.nameUser;
            //Menu
            $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_HOME_MENU);
        }
    }

    init();


});