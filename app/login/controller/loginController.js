/**
 * Created by VladimirIlich on 4/4/2016.
 */
app.controller("loginController",function($scope,$location){

    $scope.viewDash = function(){
        $location.url("/dashboard");
    }
})