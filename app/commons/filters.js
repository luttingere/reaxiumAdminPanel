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

    /*.filter('selectFromSelected', function (GLOBAL_CONSTANT,TYPES_USERS) {
        return function (incItems, value,rolUser) {
            var out = [{}];

            if(value){
                for(var x=0; x<incItems.length; x++){
                    if(rolUser == GLOBAL_CONSTANT.ROL_SCHOOL){
                        if(incItems[x].user_type_id == TYPES_USERS.TYPE_SCHOOL){
                            out.push(incItems[x]);
                        }
                    }
                }
                return out;
            }
            else if(!value){
                return incItems
            }
        };
    });*/
