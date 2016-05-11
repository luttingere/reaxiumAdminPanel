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
                    'footer@home':{templateUrl: 'app/home/views/footer.html'}
                }
            })
            .state("allUser",{
                url: '/allUser',
                controller:'UserController',
                params:{
                    edit:false,
                    id_user: null,
                },
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
                params:{
                    edit:true,
                    id_user: null,
                },
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
            .state("userHistoryAccess",{
                url: '/userHistoryAccess',
                controller:'UserHistoryAccessController',
                views: {
                    '': {templateUrl: 'app/users/views/UserHistoryAccess.html'},
                    'header@userHistoryAccess': {templateUrl: 'app/home/views/header.html'},
                    'menu@userHistoryAccess': {templateUrl: 'app/home/views/menu.html'},
                    'footer@userHistoryAccess':{templateUrl: 'app/home/views/footer.html'}
                }
            })
            .state("AllBusiness",{
                url: '/AllBusiness',
                controller:'BusinessController',
                params:{
                    edit:false,
                    id_business: null,
                },
                views: {
                    '': {templateUrl: 'app/business/views/BusinessDashboard.html'},
                    'header@AllBusiness': {templateUrl: 'app/home/views/header.html'},
                    'menu@AllBusiness': {templateUrl: 'app/home/views/menu.html'},
                    'footer@AllBusiness':{templateUrl: 'app/home/views/footer.html'}
                }
            })
            .state("newBusiness",{
                url: '/newBusiness',
                controller:'BusinessNewCtrl',
                params:{
                    edit:true,
                    id_business: null,
                },
                views: {
                    '': {templateUrl: 'app/business/views/BusinessNewRegister.html'},
                    'header@newBusiness': {templateUrl: 'app/home/views/header.html'},
                    'menu@newBusiness': {templateUrl: 'app/home/views/menu.html'},
                    'footer@newBusiness':{templateUrl: 'app/home/views/footer.html'}
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

            .state("deviceRelUser",{
                url: '/deviceRelUser',
                controller:'DeviceAccessUserCtrl',
                params:{
                    id_device: null,
                    modeDeviceRelUser:true,
                },
                views: {
                    '': {templateUrl: 'app/devices/views/DeviceRelationUser.html'},
                    'header@deviceRelUser': {templateUrl: 'app/home/views/header.html'},
                    'menu@deviceRelUser': {templateUrl: 'app/home/views/menu.html'},
                    'footer@deviceRelUser':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("deviceRelRoute",{
                url: '/deviceRelRoute',
                controller:'DeviceRelRouteCtrl',
                params:{
                    id_device: null,
                    modeDeviceRelRoute:true,
                },
                views: {
                    '': {templateUrl: 'app/devices/views/DeviceRelationRoute.html'},
                    'header@deviceRelRoute': {templateUrl: 'app/home/views/header.html'},
                    'menu@deviceRelRoute': {templateUrl: 'app/home/views/menu.html'},
                    'footer@deviceRelRoute':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("deviceNew",{
                url:"/deviceNew",
                controller:'DeviceNewCtrl',
                views: {
                    '': {templateUrl: 'app/devices/views/DeviceNewRegister.html'},
                    'header@deviceNew': {templateUrl: 'app/home/views/header.html'},
                    'menu@deviceNew': {templateUrl: 'app/home/views/menu.html'},
                    'footer@deviceNew':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("deviceViewRoute",{
                url:"/deviceViewRoute",
                controller:'DeviceViewRouteCtrl',
                views: {
                    '': {templateUrl: 'app/devices/views/DeviceViewRoute.html'},
                    'header@deviceViewRoute': {templateUrl: 'app/home/views/header.html'},
                    'menu@deviceViewRoute': {templateUrl: 'app/home/views/menu.html'},
                    'footer@deviceViewRoute':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("deviceViewUsers",{
                url:"/deviceViewUsers",
                controller:'DeviceViewUsersCtrl',
                views: {
                    '': {templateUrl: 'app/devices/views/DeviceViewUsers.html'},
                    'header@deviceViewUsers': {templateUrl: 'app/home/views/header.html'},
                    'menu@deviceViewUsers': {templateUrl: 'app/home/views/menu.html'},
                    'footer@deviceViewUsers':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("routes",{
                url: '/routes',
                controller:'RouteCtrl',
                params:{
                    edit:false,
                    id_route: null,
                },
                views: {
                    '': {templateUrl: 'app/routes/views/RouteDashboard.html'},
                    'header@routes': {templateUrl: 'app/home/views/header.html'},
                    'menu@routes': {templateUrl: 'app/home/views/menu.html'},
                    'footer@routes':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("routesNewRegister",{
                url:'/routesNewRegister',
                controller:'RouteNewCtrl',
                params:{
                    edit:true,
                    id_route: null,
                },
                views:{
                    '': {templateUrl: 'app/routes/views/RouteNewRegister.html'},
                    'header@routesNewRegister': {templateUrl: 'app/home/views/header.html'},
                    'menu@routesNewRegister': {templateUrl: 'app/home/views/menu.html'},
                    'footer@routesNewRegister':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("stops",{
                url:"/stops",
                controller:'StopsCtrl',
                views:{
                    '': {templateUrl: 'app/stops/views/StopsDashboard.html'},
                    'header@stops': {templateUrl: 'app/home/views/header.html'},
                    'menu@stops': {templateUrl: 'app/home/views/menu.html'},
                    'footer@stops':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("stopNew",{
                url:"/stopNew",
                controller:'StopNewCtrl',
                views:{
                    '': {templateUrl: 'app/stops/views/StopNewRegister.html'},
                    'header@stopNew': {templateUrl: 'app/home/views/header.html'},
                    'menu@stopNew': {templateUrl: 'app/home/views/menu.html'},
                    'footer@stopNew':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("stopAsoUser",{
                url:"/stopAsoUser",
                controller:'',
                params:{
                    modeAsocStopUser:true,
                    id_stop: null,
                },
                views:{
                    '': {templateUrl: 'app/stops/views/StopAssociateUser.html'},
                    'header@stopAsoUser': {templateUrl: 'app/home/views/header.html'},
                    'menu@stopAsoUser': {templateUrl: 'app/home/views/menu.html'},
                    'footer@stopAsoUser':{templateUrl: 'app/home/views/footer.html'}
                }
            })

            .state("stopViewUser",{
                url:"/stopViewUser",
                controller:'',
                views:{
                    '': {templateUrl: 'app/stops/views/StopViewUsers.html'},
                    'header@stopViewUser': {templateUrl: 'app/home/views/header.html'},
                    'menu@stopViewUser': {templateUrl: 'app/home/views/menu.html'},
                    'footer@stopViewUser':{templateUrl: 'app/home/views/footer.html'}
                }
            })



        $urlRouterProvider.otherwise("/login");

    }])
