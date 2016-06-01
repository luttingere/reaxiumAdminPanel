/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('App')

    .controller("UserController", function ($scope,
                                            UserService,
                                            uiGmapGoogleMapApi,
                                            $state,
                                            $rootScope,
                                            spinnerService,
                                            $log,
                                            $sessionStorage,
                                            growl,
                                            $confirm,
                                            $timeout,
                                            GLOBAL_MESSAGE,
                                            GLOBAL_CONSTANT,
                                            TYPES_USERS) {

        console.log("Cargo el Controlador de Usuarios");
        $scope.control = {}
        $scope.showPhoneModal = false;
        $scope.showAddressModal = false;
        $scope.showGeneralInfoModal = false;
        $scope.showNewUserModal = false;
        $scope.showMessage = "";

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        $scope.totalPages = 0;
        $scope.usersCount = 0;

        var loadServices = true;
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
            title: 'ID',
            value: 'document_id'
        }
        ];

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                page: 1,
                limit:10,
                sortDir: 'asc',
                sortedBy: 'first_name',
                filter: ''
            }
        };

        /**
         * Method Init
         */
        function init(){
            console.info("Iniciando controlador UserController");

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
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_USER_MENU);
                // filter user by business

                if($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_CALL_CENTER){
                    $scope.filterCriteria.ReaxiumParameters.user_type_id = $sessionStorage.rol_user;
                }
                else if($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_SCHOOL){
                    $scope.filterCriteria.ReaxiumParameters.user_type_id = $sessionStorage.rol_user;
                    $scope.filterCriteria.ReaxiumParameters.business_id = $sessionStorage.id_business;
                }

            }
        }

        init();

        /**
         * Call service all user
         */
        $scope.getAllUsers = function () {

            spinnerService.show("spinnerUserList");
            UserService.cleanModeEdit();

             UserService.getUsers($scope.filterCriteria).then(function (data) {
                $scope.users = data.users;
                $scope.totalPages = data.totalPages;
                console.log($scope.totalPages);
                $scope.totalRecords = data.totalRecords;
                 spinnerService.hide("spinnerUserList");

                 var messageGrowl = UserService.getShowGrowlMessage();

                 if(messageGrowl.isShow){
                     growl.info(messageGrowl.message);
                     UserService.cleanGrowl();
                 }

            }).catch(function(err){
                 console.error("Error invocando servicio getAllUsers "+err);
                 $scope.users = [];
                 $scope.totalPages = 0;
                 $scope.totalRecords = 0;
                 spinnerService.hide("spinnerUserList");
                 growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
             });
        }

        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            if(loadServices){
                $scope.getAllUsers();
            }
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllUsers();
            /*$scope.getAllUsers().then(function () {
                //The request fires correctly but sometimes the ui doesn't update, that's a fix
                $scope.filterCriteria.ReaxiumParameters.page = 1;
            });*/
        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            console.log("OnSort");
            $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllUsers();
           /* $scope.getAllUsers().then(function () {
                //The request fires correctly but sometimes the ui doesn't update, that's a fix
                $scope.filterCriteria.ReaxiumParameters.page = 1;
            });*/
        };


        /**
         * Get a  user of the system by his id
         * @param $scope
         * @param UserService
         * @private
         */
        $scope.findByUserId = function (userId,loadMap) {

                UserService.getUsersById(userId)
                .then(function (result) {
                    $log.debug("Llamando servicio:",result);
                    $scope.userFound = result[0];
                    if(loadMap){
                        $scope.addTheMap();
                    }

                }).catch(function(err){
                    console.error("No se completo la llamada al servicio: "+err);
                });
        }


        $scope.findByUserIdInfo = function(userId){

            /**
             * Invocando servicio que me de informacion del usuario
             */
            UserService.getUsersById(userId)
                .then(function (result) {
                    $log.debug("Llamando servicio:",result);

                    $scope.userFound = result[0];
                    $scope.userFound.stopsUserRelationship = [];

                    var request = {
                        ReaxiumParameters:{
                            ReaxiumStops:{
                                object:[]
                            }
                        }
                    };

                   console.log("User type del usuario: "+result[0].user_type_id);

                    // user stakeholder
                    if($scope.userFound.user_type_id == TYPES_USERS.TYPE_USER_STAKEHOLDER){

                        if(isEmptyArray($scope.userFound.UserRelationship)){

                            var listUserRelationShip = $scope.userFound.UserRelationship;

                            listUserRelationShip.forEach(function(entry){
                                request.ReaxiumParameters.ReaxiumStops.object.push({user_id:entry.user_id});
                            });

                            /**
                             * Invocando servicio qpara obtener todas las paradas asociados de los estudiantes
                             */
                            UserService.getStopsAndRoutesByUser(request)
                                .then(function(resp){

                                    if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                                        resp.ReaxiumResponse.object.forEach(function(entry){
                                            $scope.userFound.stopsUserRelationship.push({stops:entry});
                                        });

                                    }else{
                                        console.error(resp.ReaxiumResponse.message);
                                    }
                                })
                                .catch(function(err){
                                    console.error("Servico para obtener stops :" +err);
                                    $scope.userFound={UserRelationship:[],Stakeholders:[]};
                                });
                        }

                    }else if($scope.userFound.user_type_id == TYPES_USERS.TYPE_USER_STUDENT){

                        request.ReaxiumParameters.ReaxiumStops.object.push({user_id:userId});

                        /**
                         * Invocando servicio qpara obtener todas las paradas asociados de los estudiantes
                         */
                        UserService.getStopsAndRoutesByUser(request)
                            .then(function(resp){

                                if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                                    resp.ReaxiumResponse.object.forEach(function(entry){
                                        $scope.userFound.stopsUserRelationship.push({stops:entry});
                                    });

                                }else{
                                    console.info(resp.ReaxiumResponse.message);
                                }
                            })
                            .catch(function(err){
                                console.error("Servico para obtener stops :" +err);
                                $scope.userFound={UserRelationship:[],Stakeholders:[]};
                            });
                    }

                }).catch(function(err){
                console.error("No se completo la llamada al servicio: "+err);
                $scope.userFound={UserRelationship:[],Stakeholders:[]};
            });

        }

        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {

            var latitude = isUndefined($scope.userFound.address[0]) ? UserService.getAddressDefault().latitude : $scope.userFound.address[0].latitude;
            var longitude = isUndefined($scope.userFound.address[0]) ? UserService.getAddressDefault().longitude : $scope.userFound.address[0].longitude;

            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado");
                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: latitude,
                        longitude:longitude
                    },
                    zoom: 16,
                    options: {"MapTypeId": maps.MapTypeId.ROADMAP}
                };
                $scope.marker = {
                    coords: {
                        latitude: latitude,
                        longitude: longitude
                    }
                };

            });
        }

        var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }

                $scope.map = {
                    "center": {
                        "latitude": place[0].geometry.location.lat(),
                        "longitude": place[0].geometry.location.lng()
                    },
                    "zoom": 18
                };
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    }
                };
            }
        };

        $scope.searchbox = {
            'template': 'searchbox.tpl.html',
            'parentdiv': 'searchBoxParent',
            'options': {
                'autocomplete': true
            },
            'events': events
        };

        /**
         * get the user's phone information and show it in a modal and show it in a modal
         * @param userId
         */
        $scope.showPhoneInformation = function (userId) {
            console.log("showPhoneInformation");
            $scope.findByUserId(userId,false);
            $scope.showPhoneModal = !$scope.showPhoneModal;
        }


        /**
         * get the address information of a user and show it in a modal
         * @param userId
         */
        $scope.showAddressInformation = function (userId) {
            console.log("showAddressInformation");
            $scope.findByUserId(userId,true);
            $scope.showAddressModal = !$scope.showAddressModal;
        }

        /**
         * get the general information of a user and show it in a modal
         * @param userId
         */
        $scope.showGeneralInformation = function (userId) {
            console.log("showGeneralInformation");
            $scope.findByUserIdInfo(userId);
            $scope.showGeneralInfoModal = !$scope.showGeneralInfoModal;
        }


        $scope.sendNewUser = function(userId){
            spinnerService.show("spinnerUserList");
            $scope.showGeneralInfoModal = false;

            //espero que cierre el modal y despues envio a la pantalla editar

            $timeout(function(){
                spinnerService.hide("spinnerUserList");
                $state.go('newUser',{id_user:userId,edit:true});
            },1500);
        }


        $scope.sendRouteId = function(routeId){

            spinnerService.show("spinnerUserList");
            $scope.showGeneralInfoModal = false;

            //espero que cierre el modal y despues envio a la pantalla editar

            $timeout(function(){
                spinnerService.hide("spinnerUserList");
                $state.go('routesNewRegister',{id_route:routeId,edit:true});
            },1500);
        }

        $scope.sendBusinessId = function(businessId){

            spinnerService.show("spinnerUserList");
            $scope.showGeneralInfoModal = false;

            //espero que cierre el modal y despues envio a la pantalla editar

            $timeout(function(){
                spinnerService.hide("spinnerUserList");
                $state.go('newBusiness',{id_business:businessId,edit:true});
            },1500);

        }
        /**
         * Edit User Mode
         * @param id
         */


        /**
         * Delete User
         * @param id_user
         */
        $scope.deleteUser = function(id_user){

            $confirm({text: 'Are you sure you want to delete?'})
                .then(function() {
                    UserService.deleteUser(id_user)
                        .then(function(resp){
                           if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                               $scope.selectPage(1);
                               growl.success(resp.ReaxiumResponse.message);
                           }else{
                             growl.error(resp.ReaxiumResponse.message);
                           }
                        })
                        .catch(function(err){
                            console.error("Error invocando servicio delete: "+err);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        });
                });
        }


        $scope.selectPage(1);
        return $scope;

    })

