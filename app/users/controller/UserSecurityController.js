/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module('App')

.controller("SecurityCrl",function($scope,$rootScope,$state,$log,UserService,spinnerService,$sessionStorage){

    $scope.showgrowlMessage = false;
    $scope.showMessage = "";
    $scope.userFilter = [];
    $scope.showForm = false;
    $scope.access={
        login:"",
        pass:""
    }
    var objUser = {};

    //menu sidebar
    $scope.menus = $rootScope.appMenus;

    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //data user by session
    $scope.photeUser = $sessionStorage.user_photo;
    $scope.nameUser = $sessionStorage.nameUser;

    var init = function(){

        console.log("Iniciando controlador de seguridad");
        UserService.setShowGrowlMessage({isShow:false,message:""});
    }

    init();
    /**
     * Method compare input with list server users filter
     * @param str
     * @returns {Array}
     */
    $scope.localSearch = function (str) {
        var matches = [];

        invokeServiceUserFilter(str);

        $scope.userFilter.forEach(function (person) {

            if (!person.first_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0 ||
                !person.second_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0 ||
                !person.document_id.indexOf(str.toString()) >= 0 ||
                !person.first_last_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0 ||
                !person.second_last_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0 ||
                !person.email.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0){

                matches.push(person);
            }
        });

        return matches;
    };

    /**
     * call services search user with filter
     * @param str
     */
    var invokeServiceUserFilter = function (str) {

        var myUserFilterPromise = UserService.getUsersFilter(str);

        myUserFilterPromise.then(function (result) {

            if (result.ReaxiumResponse.code === 0) {
                $scope.userFilter = [];
                var array = result.ReaxiumResponse.object;
                console.log("size:" + array.length);
                array.forEach(function (entry) {
                    var aux = {
                        first_name: entry.first_name,
                        second_name: entry.second_name,
                        first_last_name:entry.first_last_name,
                        second_last_name:entry.second_last_name,
                        user_id: entry.user_id,
                        document_id: entry.document_id,
                        email:entry.email,
                        pic: entry.user_photo
                    };

                    $scope.userFilter.push(aux);
                });

            }
        });
    };


    $scope.addUser = function (str) {
        $scope.showForm = true;
        objUser = str.originalObject;
        $log.debug(objUser);
    };


    $scope.saveAccessUser = function (){

        spinnerService.show("spinnerNew");
        var resValidate = validateAccess($scope.access);

        if(objUser != null && objUser != undefined){
            if(resValidate.validate){
                var objJson ={
                    ReaxiumParameters:{
                        UserAccessData:{
                            user_id: objUser.user_id,
                            access_type_id: 1,
                            user_login: $scope.access.login,
                            user_password: $scope.access.pass
                        }
                    }
                };

                var promiseAccessNew = UserService.createAccessUser(objJson);
                promiseAccessNew.then(function(response){
                    $log.debug("respuesta Servicio",response);
                    UserService.setShowGrowlMessage({isShow:true,message:response.message});
                    spinnerService.hide("spinnerNew");
                    $state.go("allUser");
                }).catch(function (err){
                    console.error("Error salvando credenciales usuario" +err);
                });
            }else{
                UserService.setShowGrowlMessage({isShow:true,message:resValidate.message});
                spinnerService.hide("spinnerNew");
                $state.go("allUser");
            }
        }
        else{
            UserService.setShowGrowlMessage({isShow:true,message:resValidate.message});
            spinnerService.hide("spinnerNew");
            $state.go("allUser");
        }
    }

})