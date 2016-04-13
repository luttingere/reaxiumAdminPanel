/**
 * Created by VladimirIlich G&G on 4/4/2016.
 */

angular.module('Login', ['ui.bootstrap',]);
angular.module('Home', []);
angular.module('App', ['Login',
        'Home',
        'ui.router',
        'angularSpinners',
        'ngStorage',
        'ngTouch',
        'ngAnimate',
        'angucomplete-alt',
        'uiGmapgoogle-maps',
        'ui.bootstrap',
        'growlNotifications'])

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        PROXY_URL_LOGIN: "http://54.200.133.84/reaxium/Access/checkUserAccessInformation",
        PROXY_URL_ALL_USER: "http://54.200.133.84/reaxium/Users/allUsersInfo",
        PROXY_URL_ALL_USER_WITH_FILTER: "http://54.200.133.84/reaxium/Users/allUsersWithFilter",
        PROXY_URL_ACCESS_TYPE_LIST: "http://54.200.133.84/reaxium/SystemList/accessTypeList",
        PROXY_URL_USER_BY_ID: "http://54.200.133.84/reaxium/Users/userInfo",
        PROXY_URL_ALL_USERS_TYPE: "http://54.200.133.84/reaxium/Users/usersTypeList",
        PROXY_URL_ALL_STATUS_USER: "http://54.200.133.84/reaxium/SystemList/statusList",
        PROXY_URL_CREATE_NEW_USER: "http://54.200.133.84/reaxium/Users/createUser",
        PROXY_URL_CREATE_USER_STAKEHOLDER: "http://54.200.133.84/reaxium/Users/createStakeholderUser",
        PROXY_URL_DELETE_USER: "http://54.200.133.84/reaxium/Users/deleteUser",



    })
    //Configurando enrutado de la aplicacion
    .config(['$stateProvider', '$urlRouterProvider', 'uiGmapGoogleMapApiProvider', function ($stateProvider, $urlRouterProvider, uiGmapGoogleMapApiProvider) {

        $stateProvider

            .state("login", {
                url: '/login',
                templateUrl: 'app/login/views/login.html',
                controller: 'loginController'
            })
            .state("forgetPass",{
                url: '/forgetPass',
                templateUrl:'app/login/views/forgetPassword.html',
                controller: 'forgetPassController'
            })
            .state("home", {
                url: '/home',
                controller: 'HomeController',
                views: {
                    '': {templateUrl: 'app/home/views/home.html'},
                    'header@home': {templateUrl: 'app/home/views/header.html'},
                    'menu@home': {templateUrl: 'app/home/views/menu.html'},
                    'footer@allUser':{templateUrl: 'app/home/views/footer.html'}
                }
            })
            .state("allUser",{
                url: '/allUser',
                controller:'UserController',
                views: {
                    '': {templateUrl: 'app/users/views/UserDashboard.html'},
                    'header@allUser': {templateUrl: 'app/home/views/header.html'},
                    'menu@allUser': {templateUrl: 'app/home/views/menu.html'},
                    'footer@allUser':{templateUrl: 'app/home/views/footer.html'}
                }
            })
            .state("newUser",{
                url: '/newUser',
                controller:'UserNewCtrl',
                views: {
                    '': {templateUrl: 'app/users/views/UserNewRegister.html'},
                    'header@newUser': {templateUrl: 'app/home/views/header.html'},
                    'menu@newUser': {templateUrl: 'app/home/views/menu.html'},
                    'footer@newUser':{templateUrl: 'app/home/views/footer.html'}
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
    .run(['$templateCache','$rootScope', function ($templateCache,$rootScope) {
        $templateCache.put('searchbox.tpl.html', '<input class="form-control" type="text" placeholder="Place an address...">');
        $templateCache.put('sort-by.html','<a ng-click="sort(sortvalue)"><span ng-transclude=""></span><span ng-show="sortedby == sortvalue">&nbsp;&nbsp;<i ng-class="{true: \'fa fa-sort-up\', false: \'fa fa-sort-desc\'}[sortdir == \'asc\']"></i></span></a>');

        //aqui se deberia invocar un servicio que me de el contenido del menu segun el rol del
        //usuario despues de iniciar session

        $rootScope.welcomePage = 'app/home/views/content.html';

        $rootScope.appMenus = [{
            'name': 'User Administration',
            'subMenus': [{
                'name': 'All Users',
                'url': "allUser"
            }]
        }, {
            'name': 'Bus Administration',
            'subMenus': [{
                'name': 'All Buses',
                'url': "home"
            }]
        },{
            'name':'Routes Administration',
            'subMenus': [{
                'name': 'All routes',
                'url': "home"
            }]
        }];

    }])
