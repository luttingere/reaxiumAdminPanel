/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Home')

    .controller("UserController", function ($scope, UserService, uiGmapGoogleMapApi,$state) {

        console.log("Cargo el Controlador de Usuarios");
        $scope.control = {}
        $scope.showPhoneModal = false;
        $scope.showAddressModal = false;
        $scope.showGeneralInfoModal = false;
        $scope.showNewUserModal = false;

        /**
         * Get all the user of the system
         * @param $scope
         * @param UserService
         * @private
         */
        $scope._init = function ($scope, UserService) {
            var myUserPromise = UserService.getUsers();
            myUserPromise.then(function (result) {
                $scope.users = result;
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
        $scope.newUser = function () {
            $scope.setView('app/users/views/UserNewRegister.html');
        }

        $scope._init($scope, UserService);
        return $scope;

    })
    .directive('myDataTable', function () {
        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                $(function () {
                    $('#userTable').DataTable({
                        "paging": true,
                        "lengthChange": true,
                        "searching": true,
                        "ordering": true,
                        "info": true,
                        "autoWidth": true
                    });
                });
            }
        }
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

