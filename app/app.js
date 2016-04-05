/**
 * Created by VladimirIlich on 4/4/2016.
 */

var app = angular.module("app",['ngRoute']);

//Configurando enrutado de la aplicacion
 app.config(function($routeProvider){

     $routeProvider
         .when("/",{
         templateUrl :"app/login/views/login.html",
         controller : "loginController"
        })
         .when("/dashboard",{
             templateUrl : "app/dashboard/views/dashboard.html",
             controller : "dashController"
         })
         .otherwise({
             redirectTo : "/"
         });
 });