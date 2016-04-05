/**
 * Created by VladimirIlich on 4/4/2016.
 */

angular.module('Login')
    .controller('loginController',['$scope','$state','$log','$timeout','loginServices','spinnerService',
        function($scope,$state,$log,$timeout,loginServices,spinnerService){

        console.log('Inicializando controlador Login...');

        $scope.goHome = function(){
            $state.go('home');
        }

        $scope.showMessage = false;
        $scope.authenticateUser = function(){
            spinnerService.show('html5spinner');

                loginServices.proxyLogin($scope.username,$scope.password)
                    .success(function(data){
                        console.log("Invocacion del servicio exitosa");
                        $log.debug(data);

                        if(data.ReaxiumResponse.code === 0){
                            $state.go('home');
                        }else{
                            $scope.showMessage = true;
                            $scope.message={
                                message:data.message
                            }
                        }

                    })
                    .catch(function(error){
                        console.log("Error invocacion del servicio" +error);

                    }).finally(function(){
                        cleanInput();
                        spinnerService.hide('html5spinner');
                })


        }

        //Limpiar el scope vinculados a los campos
        var cleanInput = function(){
            $scope.username="";
            $scope.password="";
        }

    }]);


