/**
 * Created by VladimirIlich G&G on 4/4/2016.
 */
var interval = null;

angular.module('App', ['ui.router',
        'angularSpinners',
        'ngStorage',
        'ngTouch',
        'ngAnimate',
        'angucomplete-alt',
        'uiGmapgoogle-maps',
        'ui.bootstrap',
        'flow',
        'angular-growl',
        'angular-confirm'])



    //Aqui lo primero que se ejecuta en angular como el document Ready en jquery
    .run(['$templateCache', '$rootScope', '$interval', function ($templateCache, $rootScope, $interval) {

        //remover el cache de la aplicacion
        /* $rootScope.$on('$destroy', function() {
         $templateCache.removeAll();
         });*/

        /*$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            // If the state we are headed to has cached template views
            if (typeof (toState) !== 'undefined' && typeof (toState.views) !== 'undefined') {
                // Loop through each view in the cached state
                for (var key in toState.views) {
                    // Delete templeate from cache
                    console.log("Delete cached template: " + toState.views[key].templateUrl);
                    $templateCache.remove(toState.views[key].templateUrl);
                }
            }
        });*/


        $templateCache.put('sort-by.html', '<a ng-click="sort(sortvalue)"><span ng-transclude=""></span><span ng-show="sortedby == sortvalue">&nbsp;&nbsp;<i ng-class="{true: \'fa fa-sort-up\', false: \'fa fa-sort-desc\'}[sortdir == \'asc\']"></i></span></a>');
        $templateCache.put('searchbox.tpl.html', '<input class="form-control" type="text" placeholder="Place an address...">');

        $rootScope.welcomePage = 'app/home/views/content.html';

        //controllar el intervalo del proceso del tracking
        $rootScope.$on('$stateChangeStart', function () {
            $interval.cancel(interval);
        });

    }])


    //Configurando componentes
    .config(['uiGmapGoogleMapApiProvider', 'flowFactoryProvider', 'growlProvider',
        function (uiGmapGoogleMapApiProvider, flowFactoryProvider, growlProvider) {

            flowFactoryProvider.defaults = {
                target: 'upload.php',
                permanentErrors: [404, 500, 501],
                maxChunkRetries: 1,
                chunkRetryInterval: 5000,
                simultaneousUploads: 4,
                singleFile: true
            };
            flowFactoryProvider.on('catchAll', function (event) {
                //console.log('catchAll', arguments);
            });
            // Can be used with different implementations of Flow.js
            // flowFactoryProvider.factory = fustyFlowFactory;

            uiGmapGoogleMapApiProvider.configure({
                key: 'AIzaSyCCVxC265VN4yxzwfs0v_qREQN9lvDIqn4',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization,places',
                china: true
            });

            growlProvider.globalTimeToLive(5000);

        }])

