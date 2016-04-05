/**
 * Created by VladimirIlich on 4/4/2016.
 */
var app = angular.module("app", ['ui.router']);

//Configurando enrutado de la aplicacion
app.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/login");

    $stateProvider
        .state("login", {
            url: '/login',
            templateUrl: "app/login/views/login.html",
            controller: "loginController"
        })
        .state("home", {
            url: '/home',
            'controller':'HomeController',
            views: {
                '': {templateUrl: 'app/home/views/home.html'},
                'header@home': {templateUrl: 'app/home/views/header.html'},
                'menu@home': {templateUrl: 'app/home/views/menu.html'}
            }
        })


});