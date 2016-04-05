/**
 * Created by VladimirIlich on 4/4/2016.
 */
app.controller("loginController",function($scope,$location,$state,$stateParams){
    $scope.goHome = function(){
        $state.go('home');
    }

})