/**
 * Created by VladimirIlich on 9/4/2016.
 */

angular.module('App')

    .filter('capitalize', function () {
        return function (text) {
            if (text != null) {
                return text.substring(0, 1).toUpperCase() + text.substring(1);
            }
        }
    })

    .filter('lowerCase', function () {
        return function (text) {
            if (text != null) {
                return text.toLowerCase();
            }
        }
    })

    .filter('upperCase', function () {
        return function (text) {
            if (text != null) {
                return text.toUpperCase();
            }
        }
    })

    .filter('transforDate', function () {
        return function(text){
            if(text != null){

                var pos = text.indexOf('+');

                return text.substring(0,pos);

            }
        }
    })

