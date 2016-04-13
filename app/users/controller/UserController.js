/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Home')

    .controller("UserController", function ($scope, UserService, uiGmapGoogleMapApi,$state,$rootScope,spinnerService) {

        console.log("Cargo el Controlador de Usuarios");
        $scope.control = {}
        $scope.showPhoneModal = false;
        $scope.showAddressModal = false;
        $scope.showGeneralInfoModal = false;
        $scope.showNewUserModal = false;

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

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
            return UserService.getUsers($scope.filterCriteria).then(function (data) {
                $scope.users = data.users;
                $scope.totalPages = data.totalPages;
                console.log($scope.totalPages);
                $scope.totalRecords = data.totalRecords;
            }, function () {
                $scope.users = [];
                $scope.totalPages = 0;
                $scope.totalRecords = 0;
            });
        }

        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            $scope.getAllUsers();
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllUsers().then(function () {
                //The request fires correctly but sometimes the ui doesn't update, that's a fix
                $scope.filterCriteria.ReaxiumParameters.page = 1;
            });
        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            console.log("OnSort");
            $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllUsers().then(function () {
                //The request fires correctly but sometimes the ui doesn't update, that's a fix
                $scope.filterCriteria.ReaxiumParameters.page = 1;
            });
        };

        /**
         * Get all the user of the system
         * @param $scope
         * @param UserService
         * @private
         */
        $scope._init = function ($scope, UserService) {

            var obj ={
                isModeEdit:false,
                idUser:0
            }
            spinnerService.show("spinnerUserList");
            UserService.setModeEdit(obj);
            var myUserPromise = UserService.getUsers();
            myUserPromise.then(function (result) {
                $scope.users = result;
                spinnerService.hide("spinnerUserList");
            });
        }

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
         * get the user's phone information and show it in a modal
         * @param userId
         */

        $scope._init($scope, UserService);

        $scope.editMode = function(id){

            var obj ={
                isModeEdit:true,
                idUser:parseInt(id)
            }
            UserService.setModeEdit(obj);

            $state.go("newUser");
        }
        $scope.selectPage(1);
        return $scope;

    })
    .directive('modal', function () {
        return {
            template: '<div class="modal fade" role="dialog" data-backdrop="false">' +
            '<div class="vertical-alignment-helper">' +
            '<div class="modal-dialog vertical-align-center">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>',
            restrict: "E",
            transclude: true,
            replace: true,
            scope: true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;
                scope.$watch(attrs.visible, function (value) {
                    if (value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function () {
                    scope.$apply(function () {
                        scope.$parent[attrs.visible] = false;
                        scope.$parent.showPhoneModal = false;
                        scope.$parent.showNewUserModal = false;
                        scope.$parent.showAddressModal = false;
                        scope.$parent.showGeneralInfoModal = false;
                    });
                });
            }
        }
    })

