/**
 * Created by VladimirIlich on 7/4/2016.
 */

angular.module('Login')

.directive('myAlert',function($modal,$log){

    return {
        restrict:'E',
        scope:{
            mode: '@',
            boldTextTitle: '@',
            textAlert : '@'
        },
        link: function(scope,elm,attrs){

            scope.data={
                mode: scope.mode || 'info',
                boldTextTitle: scope.boldTextTitle || 'title',
                textAlert: scope.textAlert || 'text'
            }

            var ModalInstanceCtrl = function ($scope, $modalInstance, data) {

                console.log(data);

                $scope.data = data;
                $scope.close = function(){
                    $modalInstance.close($scope.data);
                };
            };

            elm.parent().bind("click", function(e){
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
