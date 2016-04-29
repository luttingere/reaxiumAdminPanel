/**
 * Created by VladimirIlich on 28/4/2016.
 */

angular.module("App")
.controller("DeviceRelRouteCtrl",function($scope,
                                          $rootScope,
                                          $sessionStorage,
                                          GLOBAL_CONSTANT,
                                          FILE_SYSTEM_ROUTE,
                                          DeviceService,
                                          $log,
                                          $filter,
                                          growl,
                                          spinnerService,
                                            $state){


    //menu sidebar
    $scope.menus = $rootScope.appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;


    $scope.routesFilter = [];
    $scope.allUserSelcStakeHolder = [];
    $scope.showTable = false;
    $scope.mytime_start = new Date();
    $scope.mytime_end = new Date();;
    $scope.hstep = 1;
    $scope.mstep = 1;
    $scope.ismeridian = false;


    var init = function(){
        console.info("Iniciando controlador DeviceRelRouteCtrl");


    }


    /**
     * Method compare input with list server users filter
     * @param str
     * @returns {Array}
     */
    $scope.localSearch = function (str) {
        var matches = [];

        invokeServiceUserFilter(str);

        $scope.routesFilter.forEach(function (route) {
            matches.push(route);
            if ((route.route_number.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (route.route_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
            }
        });

        return matches;
    };


    /**
     * call services search user with filter
     * @param str
     */
    var invokeServiceUserFilter = function (str) {

       DeviceService.getRouteWithFilter(str)
           .then(function (result) {

            if (result.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                $scope.routesFilter = [];

                var array = result.ReaxiumResponse.object;

                array.forEach(function (entry) {
                    var aux = {
                        id_route: entry.id_route,
                        route_number: entry.route_number,
                        route_name: entry.route_name,
                        route_address: entry.route_address,
                        routes_stops_count: entry.routes_stops_count,
                        pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP
                    };

                    $scope.routesFilter.push(aux);
                });

            }else{
                console.error()
            }
        }).catch(function (err) {
            console.log("Error invocando service filter" + err);
        });
    };

    $scope.addRoute = function(str){

        $log.debug(str.originalObject);

        if($scope.allUserSelcStakeHolder.length == 0){
            $scope.allUserSelcStakeHolder.push(str.originalObject);
            //$scope.showTable = true;

        }

        clearInput('ex2');
    }


    $scope.deleteUserTable = function () {

        $scope.allUserSelcStakeHolder = [];
        //$scope.showTable = false;
    }

    var clearInput = function (id) {
        if (id) {
            $scope.$broadcast('angucomplete-alt:clearInput', id);
        }
        else {
            $scope.$broadcast('angucomplete-alt:clearInput');
        }
    };

    /*$scope.changed_start = function(){
        $log.debug($scope.mytime_start);

    }

    $scope.changed_end = function(){
        $log.debug($filter('date')($scope.mytime_end,'shortTime'));
    }*/


    $scope.saveDeviceRelRoute = function(){

        if($scope.allUserSelcStakeHolder.length > 0){

            spinnerService.show("spinnerNew");

            var start_date = $filter('date')($scope.mytime_start,'shortTime');
            var end_date = $filter('date')($scope.mytime_end,'shortTime');

            start_date = (start_date.indexOf('A')>0) ? start_date.replace('AM','') : start_date.replace('PM','');
            end_date = (end_date.indexOf('A')>0) ? end_date.replace('AM','') : end_date.replace('PM','');

            var objSend = {
                ReaxiumParameters:{
                    ReaxiumDevice:{
                        device_id: DeviceService.getRelRouteDevice().id_device,
                        id_route: $scope.allUserSelcStakeHolder[0].id_route,
                        start_date: start_date.trim()+':00',
                        end_date:end_date.trim()+':00'
                    }
                }
            }

            console.log(objSend);

            DeviceService.getAssociateADeviceWithRoute(objSend)
                .then(function(resp){
                    spinnerService.hide("spinnerNew");

                    if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                        DeviceService.setShowGrowlMessage({isShow:true,message:resp.ReaxiumResponse.message})
                        $state.go('device');
                    }else{
                        growl.error("Service not available Please try again later");
                    }

                }).catch(function(err){
                spinnerService.hide("spinnerNew");
            });

        }else{
            growl.info("Add a route to save");
        }

    }




})