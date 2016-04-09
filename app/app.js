/**
 * Created by VladimirIlich on 4/4/2016.
 */

angular.module('Login', ['ui.bootstrap']);
angular.module('Home', []);
angular.module('App', ['Login',
        'Home',
        'ui.router',
        'angularSpinners',
        'ngStorage',
        'ngTouch',
        'angucomplete-alt',
        'uiGmapgoogle-maps'])

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        PROXY_URL_LOGIN: "http://54.200.133.84/reaxium/Access/checkUserAccessInformation",
        PROXY_URL_ALL_USER: "http://54.200.133.84/reaxium/Users/allUsersInfo",
        PROXY_URL_ALL_USER_WITH_FILTER: "http://54.200.133.84/reaxium/Users/allUsersWithFilter",
        PROXY_URL_ACCESS_TYPE_LIST: "http://54.200.133.84/reaxium/SystemList/accessTypeList",
        PROXY_URL_USER_BY_ID: "http://54.200.133.84/reaxium/Users/userInfo"

    })
    //Configurando enrutado de la aplicacion
    .config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

        $stateProvider
            .state("login", {
                url: '/login',
                templateUrl: "app/login/views/login.html",
                controller: "loginController"
            })
            .state("home", {
                url: '/home',
                controller: 'HomeController',
                views: {
                    '': {templateUrl: 'app/home/views/home.html'},
                    'header@home': {templateUrl: 'app/home/views/header.html'},
                    'menu@home': {templateUrl: 'app/home/views/menu.html'}
                }
            })

        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyBzOVQq2CAsKnOTplH5Xfesys9_vnZg9Gs',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization,places',
            china: true
        });

        $urlRouterProvider.otherwise("/login");
    }])
    //Aqui lo primero que se ejecuta en angular como el document Ready en jquery
    //.run(['rootScope'],function(){});
    .run(['$templateCache', function ($templateCache) {
        $templateCache.put('searchbox.tpl.html', '<input class="form-control" type="text" placeholder="Place an address...">');
    }])
