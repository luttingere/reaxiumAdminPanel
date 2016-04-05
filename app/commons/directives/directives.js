/**
 * Created by VladimirIlich on 5/4/2016.
 */
angular.module('App')

    .directive('myViewCheck', function () {

        return {
            restrict: "A",
            template: '<div class="checkbox icheck"><label><input type="checkbox"> Remember Me</label></div>'
        }
    })
    .directive('myClickCheck', function () {

        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                $(function () {
                    $('input').iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '20%' // optional
                    });
                });
            }

        }
    })

