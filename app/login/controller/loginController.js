/**
 * Created by VladimirIlich on 4/4/2016.
 */

angular.module('Login')

    .controller('loginController',['$scope','$state',function($scope,$state){
        $scope.goHome = function(){
            $state.go('home');
        }

    }]);