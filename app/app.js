/**
 * Created by VladimirIlich on 4/4/2016.
 */

angular.module('Login', ['ui.bootstrap']);
angular.module('Home', []);
angular.module('Users', []);
angular.module('App', ['Login','Home','Users','ui.router','angularSpinners','ngStorage','ngTouch','angucomplete-alt'])

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        PROXY_URL_LOGIN: "http://54.200.133.84/reaxium/Access/checkUserAccessInformation",
        PROXY_URL_ALL_USER:"http://54.200.133.84/reaxium/Users/allUsersInfo",
        PROXY_URL_ALL_USER_WITH_FILTER:"http://54.200.133.84/reaxium/Users/allUsersWithFilter"

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