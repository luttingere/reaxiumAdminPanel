/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
angular.module('Users')

    .controller("UserController", function ($scope, UserService) {

        console.log("Cargo el Controlador de Usuarios");

        $scope.showPhoneModal = false;
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
         * get the user's phone information and show it in a modal
         * @param userId
         */
        $scope.showPhoneInformation = function (userId) {
            console.log("Intyeractuando con el modal " + userId);
            $scope.showPhoneModal = !$scope.showPhoneModal;
        }

        /**
         * get the user's phone information and show it in a modal
         * @param userId
         */
        $scope.newUser = function () {
            $scope.showNewUserModal = !$scope.showNewUserModal;
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
            '<div class="vertical-alignment-helper">'+
            '<div class="modal-dialog vertical-align-center">'+
            '<div class="modal-content">' +
            '<div class="modal-body" ng-transclude></div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' ,
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
                    });
                });
            }
        }
    })

