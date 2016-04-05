/**
 * Created by VladimirIlich on 5/4/2016.
 */
angular.module('App')

    .directive('myViewCheck', function () {

        return {
            restrict: "A",
            link: function (scope, elem, attrs) {
                $(function () {
                    $('#checkLogin').iCheck({
                        checkboxClass: 'icheckbox_square-blue',
                        radioClass: 'iradio_square-blue',
                        increaseArea: '20%' // optional
                    });
                });
            },
            template: '<div class="checkbox icheck"><label><input id="checkLogin" type="checkbox"> Remember Me</label></div>'
        }
    })


