/**
 * Created by VladimirIlich on 5/4/2016.
 */
angular.module('App')

    .directive('myViewCheck', function () {

        return {
            restrict: "AE",
            template: '<div class="checkbox icheck"><label><input id="checkLogin" type="checkbox"> Remember Me</label></div>',

            link: function (scope, elem, attrs,ctrl) {

                $(function () {
                    $('#checkLogin').iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '20%'
                    });
                });

                if (scope.data.settings.checked) {
                    $('#checkLogin').iCheck('check');
                }

                $('#checkLogin').on('ifChecked', function(event){
                    scope.newDataUser();
                });

                $('#checkLogin').on('ifUnchecked', function(event){
                    scope.deleteDataUser();
                });
            }
        }
    })


