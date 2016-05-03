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
                                            GLOBAL_MESSAGE,
                                            GLOBAL_CONSTANT) {

        console.log("Cargo el Controlador de Usuarios");
        $scope.control = {}
        $scope.showPhoneModal = false;
        $scope.showAddressModal = false;
        $scope.showGeneralInfoModal = false;
        $scope.showNewUserModal = false;
        $scope.showMessage = "";

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.totalPages = 0;
        $scope.usersCount = 0;

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

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                page: 1,
                limit:5,
                sortDir: 'asc',
                sortedBy: 'first_name',
                filter: ''
            }
        };

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
            $scope.getAllUsers();
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
        $scope.findByUserId = function (userId) {
            if (UserService.getUserIdFound() != userId) {
                var myPhonePromise = UserService.getUsersById(userId);
                myPhonePromise.then(function (result) {
                    $scope.userFound = result[0];
                    $scope.addTheMap();
                });
            }
        }

        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {
            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado");
                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: $scope.userFound.address[0].latitude,
                        longitude: $scope.userFound.address[0].longitude
                    },
                    zoom: 16,
                    options: {"MapTypeId": maps.MapTypeId.HYBRID}
                };
                $scope.marker = {
                    coords: {
                        latitude: $scope.userFound.address[0].latitude,
                        longitude: $scope.userFound.address[0].longitude
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
            $scope.findByUserId(userId, $scope);
            $scope.showPhoneModal = !$scope.showPhoneModal;
        }

        /**
         * get the address information of a user and show it in a modal
         * @param userId
         */
        $scope.showAddressInformation = function (userId) {
            console.log("showAddressInformation");
            $scope.findByUserId(userId, $scope);
            $scope.showAddressModal = !$scope.showAddressModal;
        }

        /**
         * get the general information of a user and show it in a modal
         * @param userId
         */
        $scope.showGeneralInformation = function (userId) {
            console.log("showGeneralInformation");
            $scope.findByUserId(userId, $scope);
            $scope.showGeneralInfoModal = !$scope.showGeneralInfoModal;
        }

        /**
         * Edit User Mode
         * @param id
         */
        $scope.editMode = function(id){

            var obj ={isModeEdit:true,idUser:parseInt(id)};
            UserService.setModeEdit(obj);
            $state.go("newUser");
        }


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

