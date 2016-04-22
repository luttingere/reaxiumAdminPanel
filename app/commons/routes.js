/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

    //Configurando enrutado de la aplicacion
    .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

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
            .state("userSecurity",{
                url: '/userSecurity',
                controller:'SecurityCrl',
                views: {
                    '': {templateUrl: 'app/users/views/UserSecurity.html'},
                    'header@userSecurity': {templateUrl: 'app/home/views/header.html'},
                    'menu@userSecurity': {templateUrl: 'app/home/views/menu.html'},
                    'footer@userSecurity':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("device",{
                url: '/device',
                controller:'DeviceCtrl',
                views: {
                    '': {templateUrl: 'app/devices/views/DeviceDashboard.html'},
                    'header@device': {templateUrl: 'app/home/views/header.html'},
                    'menu@device': {templateUrl: 'app/home/views/menu.html'},
                    'footer@device':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("routes",{
                url: '/routes',
                controller:'RouteCtrl',
                views: {
                    '': {templateUrl: 'app/routes/views/RouteDashboard.html'},
                    'header@routes': {templateUrl: 'app/home/views/header.html'},
                    'menu@routes': {templateUrl: 'app/home/views/menu.html'},
                    'footer@routes':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("deviceRelUser",{
                url: '/deviceRelUser',
                controller:'DeviceRelUserCtrl',
                views: {
                    '': {templateUrl: 'app/devices/views/RouteDashboard.html'},
                    'header@routes': {templateUrl: 'app/home/views/header.html'},
                    'menu@routes': {templateUrl: 'app/home/views/menu.html'},
                    'footer@routes':{templateUrl: 'app/home/views/footer.html'}
                }
            })


        $urlRouterProvider.otherwise("/login");

    }])
