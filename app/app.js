/**
 * Created by VladimirIlich on 4/4/2016.
 */

angular.module('Login', [])
angular.module('Home', []);
angular.module('App', ['Login', 'Home', 'ui.router','angularSpinners','ngStorage'])

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {
        PROXY_URL_LOGIN: "http://54.200.133.84/reaxium/Access/checkUserAccessInformation",

    })
    //Configurando enrutado de la aplicacion
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state("login", {
                url: '/login',
                templateUrl: "app/login/views/login.html",
                controller: "loginController"
            })
            .state("home", {
                url: '/home',
                'controller': 'HomeController',
                views: {
                    '': {templateUrl: 'app/home/views/home.html'},
                    'header@home': {templateUrl: 'app/home/views/header.html'},
                    'menu@home': {templateUrl: 'app/home/views/menu.html'}
                }
            })

        $urlRouterProvider.otherwise("/login");
    }])
//Aqui lo primero que se ejecuta en angular como el document Ready en jquery
//.run(['rootScope'],function(){});