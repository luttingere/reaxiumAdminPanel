/**
 * Created by VladimirIlich on 10/5/2016.
 */
angular.module("App")
    .controller("StopViewUsersCtrl", function ($scope,
                                               $state,
                                               $rootScope,
                                               $sessionStorage,
                                               StopsService,
                                               growl,
                                               spinnerService,
                                               $log,
                                               $confirm,
                                               GLOBAL_CONSTANT,
                                               GLOBAL_MESSAGE,
                                               FILE_SYSTEM_ROUTE) {


        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        $scope.showTableRoute = false;
        $scope.stopsFilter = [];
        $scope.id_stop="";

        $scope.totalPages = 0;

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                ReaxiumStops: {
                    id_stop: "",
                    page: 1,
                    limit: 5,
                    sortDir: 'asc',
                    sortedBy: 'first_name',
                    filter: ''
                }
            }
        };


        /**
         * cabecera de la tabla de usuarios
         * @type {*[]}
         */
        $scope.userTableHeaders = [{
            title: 'Name',
            value: 'first_name'
        }, {
            title: 'Last Name',
            value: 'first_last_name'
        }, {
            title: 'DNI',
            value: 'document_id'
        }
        ];


        function init(){

            if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
                console.error("Usuario no a iniciado session");
                $state.go("login");
            }
            else{
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus), GLOBAL_CONSTANT.ID_STOPS_MENU);
            }
        }

        init();

        function searchUserByStop() {

            if($scope.id_stop != ""){

                spinnerService.show("spinnerNew");
                $scope.filterCriteria.ReaxiumParameters.ReaxiumStops.id_stop = $scope.id_stop;
                StopsService.allUsersByStop($scope.filterCriteria)
                    .then(function (resp) {
                        if (resp.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                            $scope.listUsersByStop = resp.users;
                            $scope.totalPages = resp.totalPages;
                            $scope.totalRecords = resp.totalRecords;

                            $scope.showTableRoute = true;
                        }
                        else {
                            console.info("Error: " + resp.message);
                            growl.warning(resp.message);
                        }
                        spinnerService.hide("spinnerNew");
                    })
                    .catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error("Error: " + err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });
            }
            else{
                console.error("Error stop_id no disponible");
            }

        }


        /**
         * Method compare input with list server users filter
         * @param str
         * @returns {Array}
         */
        $scope.localSearch = function (str) {
            var matches = [];

            invokeServiceUserFilter(str);

            $scope.stopsFilter.forEach(function (stops) {

                if ((stops.stop_number.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                    (stops.stop_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {

                    matches.push(stops);
                }
            });

            return matches;
        };


        /**
         * call services search user with filter
         * @param str
         */
        var invokeServiceUserFilter = function (str) {

            StopsService.stopsWithFilter(str)
                .then(function (result) {

                    if (result.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                        $scope.stopsFilter = [];
                        var array = result.ReaxiumResponse.object;
                        array.forEach(function (entry) {
                            var aux = {
                                id_stop: entry.id_stop,
                                stop_number: entry.stop_number,
                                stop_name: entry.stop_name,
                                stop_latitude: entry.stop_latitude,
                                stop_longitude: entry.stop_longitude,
                                stop_address: entry.stop_address,
                                pic: FILE_SYSTEM_ROUTE.IMAGE_MARKER_MAP
                            };

                            $scope.stopsFilter.push(aux);
                        });

                    }
                }).catch(function (err) {
                console.error("Error invocando service filter" + err);
            });
        };


        $scope.addStopsSelect = function (objStops) {
            $log.debug(objStops);
            $scope.id_stop = objStops.originalObject.id_stop;
            $scope.name_stop = objStops.originalObject.stop_name;
            $scope.selectPage();
            clearInput('ex2');

        }


        var clearInput = function (id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            }
            else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };


        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            searchUserByStop();
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.ReaxiumStops.page = 1;
            searchUserByStop();

        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            console.log("OnSort");
            $scope.filterCriteria.ReaxiumParameters.ReaxiumStops.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.ReaxiumStops.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.ReaxiumStops.page = 1;
            searchUserByStop();
        };


        $scope.deleteUser = function (id_stops_user) {

            $confirm({text: GLOBAL_MESSAGE.MESSAGE_CONFIRM_ACTION})
                .then(function() {
                    spinnerService.show("spinnerNew");
                    StopsService.deleteUserByStop(id_stops_user)
                        .then(function(resp){
                            spinnerService.hide("spinnerNew");
                            if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                                $scope.selectPage(1);
                                growl.success(GLOBAL_MESSAGE.MESSAGE_DELETE_USER_OF_STOP);
                            }else{
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            }
                        })
                        .catch(function(err){
                            console.error("Error invocando servicio delete: "+err);
                            spinnerService.hide("spinnerNew");
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        });
                });

        }
    })
