/**
 * Created by VladimirIlich on 4/4/2016.
 */

angular.module('App')
    .controller('loginController', function ($scope,
                                             $state,
                                             $log,
                                             $timeout,
                                             loginServices,
                                             spinnerService,
                                             $localStorage,
                                             $sessionStorage,
                                             growl,
                                             GLOBAL_CONSTANT) {

        $scope.showspinner = false;
        $scope.data = {
            settings: {
                username: '',
                password: '',
                checked: false
            }
        };

        var init = function () {
            console.log('Inicializando controlador Login...');

            if (angular.isDefined($localStorage.settings)) {
                console.log('Esta definido el localStored');
                $log.debug($localStorage.settings);
                $scope.data.settings = $localStorage.settings;
            }
            else {
                console.log('No Esta definido el localStored');
                $localStorage.settings = $scope.data.settings;
            }
        }

        init();

        $scope.authenticateUser = function () {

            spinnerService.show('html5spinner');

            loginServices.proxyLogin($scope.data.settings.username, $scope.data.settings.password)
                .then(function (data) {
                    console.log("Invocacion del servicio exitosa");
                    $log.debug(data);

                    if (data.ReaxiumResponse.code === 0) {

                        if(data.ReaxiumResponse.object[0].user.user_type.user_type_id == GLOBAL_CONSTANT.ROL_ACCESS_ADMIN){

                            $sessionStorage.user_photo = data.ReaxiumResponse.object[0].user.user_photo;
                            $sessionStorage.nameUser = data.ReaxiumResponse.object[0].user.first_name + ' ' +data.ReaxiumResponse.object[0].user.first_last_name;
                            $sessionStorage.rol_user = GLOBAL_CONSTANT.ROL_ACCESS_ADMIN;
                            $state.go('home');
                        }
                        else{
                            growl.error("User with restricted access");
                            console.info("EUser with restricted access: " + data.ReaxiumResponse.message);
                        }

                    } else {
                        growl.error(data.ReaxiumResponse.message);
                        console.error("Error a ingresar al aplicativo: " + data.ReaxiumResponse.message);
                    }

                })
                .catch(function (error) {
                    console.error("Error invocacion del servicio" + error);

                }).finally(function () {

                spinnerService.hide('html5spinner');

            })


        }

        /*Limpiar el scope vinculados a los campos*/

        $scope.newDataUser = function () {
            console.log("Cambio checkbox ifChecked");
            if ($scope.data.settings.username != null &&
                $scope.data.settings.username != undefined &&
                $scope.data.settings.password != null &&
                $scope.data.settings.password != undefined) {

                var obj = {
                    settings: {
                        username: $scope.data.settings.username,
                        password: $scope.data.settings.password,
                        checked: true
                    }
                };
                $log.debug("objeto paraguardar local:", obj);
                $localStorage.settings = obj.settings;

            }
        }

        $scope.deleteDataUser = function () {
            console.log("Cambio checkbox ifUnchecked");
            delete $localStorage.settings;
        }

        $scope.data_alert = {
            boldTextTitle: "Done",
            textAlert : "Invalid User",
            mode : "danger",
            color_border: "bg-red-active"
        }

    })

    .directive('myViewCheck', function () {

        return {
            restrict: "AE",
            template: '<div class="checkbox icheck"><label><input id="checkLogin" type="checkbox"> Remember Me</label></div>',

            link: function (scope, elem, attrs, ctrl) {

                $(function () {
                    $('#checkLogin').iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '20%'
                    });
                });

                if (scope.data.settings.checked) {
                    $('#checkLogin').iCheck('check');
                }
                $('#checkLogin').on('ifChecked', function (event) {
                    scope.newDataUser();
                });
                $('#checkLogin').on('ifUnchecked', function (event) {
                    scope.deleteDataUser();
                });
            }
        }
    });
