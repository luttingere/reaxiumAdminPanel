/**
 * Created by VladimirIlich on 12/5/2016.
 */
angular.module("App")
    .controller("logoutCtrl", function ($state, $scope, $sessionStorage) {

        function init() {

            //borrando datos de session
            delete $sessionStorage.nameUser;
            delete $sessionStorage.rol_user;
            delete $sessionStorage.user_photo;
            $state.go('login');
        }
        init();
    })
