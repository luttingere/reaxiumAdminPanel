"format amd";!function(a){"use strict";function b(a,b){return a.module("angularSpinner",[]).constant("SpinJSSpinner",b).provider("usSpinnerConfig",function(){var a={},b={};return{setDefaults:function(b){a=b||a},setTheme:function(a,c){b[a]=c},$get:function(){return{config:a,themes:b}}}}).factory("usSpinnerService",["$rootScope",function(a){var b={};return b.spin=function(b){a.$broadcast("us-spinner:spin",b)},b.stop=function(b){a.$broadcast("us-spinner:stop",b)},b}]).directive("usSpinner",["SpinJSSpinner","usSpinnerConfig",function(b,c){return{scope:!0,link:function(d,e,f){function g(){d.spinner&&d.spinner.stop()}d.spinner=null,d.key=a.isDefined(f.spinnerKey)?f.spinnerKey:!1,d.startActive=a.isDefined(f.spinnerStartActive)?d.$eval(f.spinnerStartActive):d.key?!1:!0,d.spin=function(){d.spinner&&d.spinner.spin(e[0])},d.stop=function(){d.startActive=!1,g()},d.$watch(f.usSpinner,function(h){g(),h=a.extend({},c.config,c.themes[f.spinnerTheme],h),d.spinner=new b(h),d.key&&!d.startActive||f.spinnerOn||d.spinner.spin(e[0])},!0),f.spinnerOn&&d.$watch(f.spinnerOn,function(a){a?d.spin():d.stop()}),d.$on("us-spinner:spin",function(a,b){b===d.key&&d.spin()}),d.$on("us-spinner:stop",function(a,b){b===d.key&&d.stop()}),d.$on("$destroy",function(){d.stop(),d.spinner=null})}}}])}"object"==typeof module&&module.exports?module.exports=b(require("angular"),require("spin.js")):"function"==typeof define&&define.amd?define(["angular","spin"],b):b(a.angular,a.Spinner)}(this);
//# sourceMappingURL=angular-spinner.min_back.js.map