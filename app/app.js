/**
 * Created by VladimirIlich G&G on 4/4/2016.
 */

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
    .run(['$templateCache', '$rootScope', function ($templateCache, $rootScope) {
        $templateCache.put('searchbox.tpl.html', '<input class="form-control" type="text" placeholder="Place an address...">');
        $templateCache.put('sort-by.html', '<a ng-click="sort(sortvalue)"><span ng-transclude=""></span><span ng-show="sortedby == sortvalue">&nbsp;&nbsp;<i ng-class="{true: \'fa fa-sort-up\', false: \'fa fa-sort-desc\'}[sortdir == \'asc\']"></i></span></a>');

        $rootScope.welcomePage = 'app/home/views/content.html';

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
                key: 'AIzaSyBzOVQq2CAsKnOTplH5Xfesys9_vnZg9Gs',
                v: '3.20', //defaults to latest 3.X anyhow
                libraries: 'weather,geometry,visualization,places',
                china: true
            });

            growlProvider.globalTimeToLive(5000);

        }])

