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
                                             $uibModal,
                                             $sessionStorage) {

        $scope.showgrowlMessage = false;
        $scope.showMesaggeAuthenticate = "";
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
                .success(function (data) {
                    console.log("Invocacion del servicio exitosa");
                    $log.debug(data);

                    if (data.ReaxiumResponse.code === 0) {
                        $sessionStorage.user_photo = data.ReaxiumResponse.object[0].user.user_photo;
                        $sessionStorage.nameUser = data.ReaxiumResponse.object[0].user.first_name + ' ' +data.ReaxiumResponse.object[0].user.first_last_name;
                        $state.go('home');
                    } else {
                        $scope.showgrowlMessage = true;
                        $scope.showMesaggeAuthenticate = data.ReaxiumResponse.message;
                        console.log("Error a ingresar al aplicativo: " + data.ReaxiumResponse.message)
                    }

                })
                .catch(function (error) {
                    console.log("Error invocacion del servicio" + error);

                }).finally(function () {
                //cleanInput();
                spinnerService.hide('html5spinner');
                //usSpinnerService.stop('spinner-1');
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



//Alert
/*var open = function (mode) {

 $scope.data_alert.mode = mode;

 var modalInstance = $uibModal.open({
 templateUrl: 'app/login/views/myModalContent.html',
 controller: ModalInstanceCtrl,
 backdrop: true,
 keyboard: true,
 backdropClick: true,
 size: 'sm',
 resolve: {
 data: function () {
 return $scope.data_alert;
 }
 }
 });

 modalInstance.result.then(function (selectedItem) {
 $scope.selected = selectedItem;
 }, function () {
 $log.info('Modal dismissed at: ' + new Date());
 });

 }*/
/*var ModalInstanceCtrl = function ($scope, $uibModalInstance, data) {
 $scope.data_alert = data;
 $scope.close = function(result){
 $uibModalInstance.close($scope.data_alert);
 };
 };*/