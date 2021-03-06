/**
 * Created by VladimirIlich on 20/4/2016.
 */

angular.module("App")
.controller("RouteCtrl",function($scope,
                                 $log,
                                 $state,
                                 $rootScope,
                                 RoutesServices,
                                 spinnerService,
                                 $sessionStorage,
                                 growl,
                                 $confirm,
                                 GLOBAL_MESSAGE,
                                 GLOBAL_CONSTANT){

    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    $scope.totalPages = 0;

    //default criteria that will be sent to the server
    $scope.filterCriteria = {
        ReaxiumParameters: {
            page: 1,
            limit:10,
            sortDir: 'asc',
            sortedBy: 'route_name',
            filter: ''
        }
    };


    $scope.routeTableHeaders = [
        {
            title: 'Route ID',
            value: 'id_route'
        },
        {
        title: 'Route Number',
        value: 'route_number'
    }, {
        title: 'Route Name',
        value: 'route_name'
    }, {
        title: 'Route Address',
        value: 'route_address'
    }
    ];

    var loadServices = true;

    function init(){

        if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
            console.error("Usuario no a iniciado session");
            loadServices = false;
            $state.go("login");
        }
        else{
            //data user by session
            $scope.photeUser = $sessionStorage.user_photo;
            $scope.nameUser = $sessionStorage.nameUser;
            //menu sidebar
            $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_ROUTES_MENU);
        }
    }

    init();

    $scope.getAllRoutes = function(){
        console.info("Iniciando Controlador RouteCtrl");

        spinnerService.show("spinnerNew");
        RoutesServices.cleanModeEditRoute();

        RoutesServices.allRoutesWithPagination($scope.filterCriteria)
            .then(function(data){
                spinnerService.hide("spinnerNew");
                if(RoutesServices.getShowGrowlMessage().isShow){
                    growl.info(RoutesServices.getShowGrowlMessage().message);
                    RoutesServices.cleanGrowlRoute();
                }
                $scope.routes = data.routes;
                $scope.totalPages = data.totalPages;
                $scope.totalRecords = data.totalRecords;

            }).catch(function(err){
            console.error("Error invocando servicio routes"+err);
            spinnerService.hide("spinnerNew");
            $scope.routes = [];
            $scope.totalPages = 0;
            $scope.totalRecords = 0;
            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
        });

    }


    //called when navigate to another page in the pagination
    $scope.selectPage = function () {
        if(loadServices){
            $scope.getAllRoutes();
        }
    };

    //Will be called when filtering the grid, will reset the page number to one
    $scope.filterResult = function () {
        $scope.filterCriteria.ReaxiumParameters.page = 1;
        $scope.getAllRoutes();
    };

    //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
    $scope.onSort = function (sortedBy, sortDir) {
        console.log("OnSort");
        $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
        $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
        $scope.filterCriteria.ReaxiumParameters.page = 1;
        $scope.getAllRoutes();
    };

    //init search page 1
    $scope.selectPage(1);

    /*$scope.editMode = function (id_route){
        console.info('ruta seleccionada: '+id_route);
        RoutesServices.setModeEdit({isModeEdit:true,id_route:id_route});
        $state.go('routesNewRegister');
    }*/

    $scope.deleteRoute = function(id_route){

        $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
            .then(function() {
                RoutesServices.deleteRoute(id_route)
                    .then(function(resp){
                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            $scope.selectPage(1);
                            growl.success(GLOBAL_MESSAGE.MESSAGE_DELETE_ROUTE);
                        }else{
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }
                    }).catch(function(err){
                        console.error("Error invocando servicio delete: "+err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            });
    }

});