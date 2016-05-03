/**
 * Created by VladimirIlich on 7/4/2016.
 */
angular.module('App')

    .directive('myAlert', function ($modal, $log) {

        return {
            restrict: 'E',
            scope: {
                mode: '@',
                boldTextTitle: '@',
                textAlert: '@'
            },
            link: function (scope, elm, attrs) {

                scope.data = {
                    mode: scope.mode || 'info',
                    boldTextTitle: scope.boldTextTitle || 'title',
                    textAlert: scope.textAlert || 'text'
                }

                var ModalInstanceCtrl = function ($scope, $modalInstance, data) {

                    console.log(data);

                    $scope.data = data;
                    $scope.close = function () {
                        $modalInstance.close($scope.data);
                    };
                };

                elm.parent().bind("click", function (e) {
                    scope.open();
                });


                scope.open = function () {
                    var modalInstance = $modal.open({
                        templateUrl: 'app/login/views/myModalContent.html',
                        controller: ModalInstanceCtrl,
                        backdrop: true,
                        keyboard: true,
                        backdropClick: true,
                        size: 'lg',
                        resolve: {
                            data: function () {
                                return scope.data;
                            }
                        }
                    });


                    modalInstance.result.then(function (selectedItem) {
                        scope.selected = selectedItem;
                    }, function () {
                        $log.info('Modal dismissed at: ' + new Date());
                    });

                }

            }
        }
    })
    .directive('sortBy', function () {
        return {
            templateUrl: 'sort-by.html',
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                sortdir: '=',
                sortedby: '=',
                sortvalue: '@',
                onsort: '='
            },
            link: function (scope, element, attrs) {
                scope.sort = function () {
                    if (scope.sortedby == scope.sortvalue) {
                        scope.sortdir = scope.sortdir == 'asc' ? 'desc' : 'asc';
                    }
                    else {
                        scope.sortedby = scope.sortvalue;
                        scope.sortdir = 'asc';
                    }
                    scope.onsort(scope.sortedby, scope.sortdir);
                }
            }
        };
    })

    .directive('onBlurChange', function ($parse) {
        return function (scope, element, attr) {
            var fn = $parse(attr['onBlurChange']);
            var hasChanged = false;
            element.on('change', function (event) {
                hasChanged = true;
            });

            element.on('blur', function (event) {
                if (hasChanged) {
                    scope.$apply(function () {
                        fn(scope, {$event: event});
                    });
                    hasChanged = false;
                }
            });
        };
    })
    .directive('onEnterBlur', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    element.blur();
                    event.preventDefault();
                }
            });
        };
    })
    .directive('inputMaskPhone',function(){
        return{
            restrict:'A',
            link:function(scope,elem,attrs){

                var modeMask = [{code:1,mode:"phone"},{code:2,mode:"date"}];
                var id='#'+attrs.id;
                var mode = attrs.mode;

                //Initialize Select2 Elements
                $(".select2").select2();

                modeMask.forEach(function(entry){
                    if(entry.mode === mode){
                        switch(entry.code){
                            case 1:
                                $(id).inputmask("(999)999-9999", {"placeholder": "(___)___-_____"});
                                break;
                            case 2:
                                $(id).inputmask("dd/mm/yyyy", {"placeholder": "dd/mm/yyyy"});
                                break;
                        }
                    }
                })


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
