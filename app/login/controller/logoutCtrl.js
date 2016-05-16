/**
 * Created by VladimirIlich on 12/5/2016.
 */
angular.module("App")
    .controller("logoutCtrl", function ($state,
                                        $scope,
                                        $sessionStorage,
                                        $confirm,
                                        GLOBAL_MESSAGE) {

        function init() {
            console.info("Limpiado datos de session");
            delete $sessionStorage.nameUser;
            delete $sessionStorage.rol_user;
            delete $sessionStorage.user_photo;
            delete $sessionStorage.appMenus;
            delete $sessionStorage.id_business;
            $state.go('login');
        }
        init();
    })
