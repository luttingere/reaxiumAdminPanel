/**
 * Created by VladimirIlich on 14/5/2016.
 */
angular.module('App')
.controller('SuperUserCtrl',function($scope,
                                     $sessionStorage,
                                     UserService,
                                     spinnerService,
                                     growl,
                                     $log,
                                     GLOBAL_CONSTANT,
                                     GLOBAL_MESSAGE){

    $scope.checkBoxAdmin={
        id_user_type:1,
        object:[
            {
                menu_id:1,
                checkBoxActive:false,
                id_user_type:1
            },
            {
                menu_id:2,
                checkBoxActive:false,
                id_user_type:1
            },
            {
                menu_id:3,
                checkBoxActive:false,
                id_user_type:1
            },
            {
                menu_id:4,
                checkBoxActive:false,
                id_user_type:1
            },
            {
                menu_id:5,
                checkBoxActive:false,
                id_user_type:1
            },

            {
                menu_id:6,
                checkBoxActive:false,
                id_user_type:1
            }
        ]

    };

    $scope.checkBoxSchool={
        id_user_type:5,
        object:[
            {
                menu_id:1,
                checkBoxActive:false,
                id_user_type:5
            },
            {
                menu_id:2,
                checkBoxActive:false,
                id_user_type:5
            },
            {
                menu_id:3,
                checkBoxActive:false,
                id_user_type:5
            },
            {
                menu_id:4,
                checkBoxActive:false,
                id_user_type:5
            },
            {
                menu_id:5,
                checkBoxActive:false,
                id_user_type:5
            },

            {
                menu_id:6,
                checkBoxActive:false,
                id_user_type:5
            }
        ]
    };

    $scope.checkBoxCallCenter={
        id_user_type:6,
        object:[
            {
                menu_id:1,
                checkBoxActive:false,
                id_user_type:6
            },
            {
                menu_id:2,
                checkBoxActive:false,
                id_user_type:6
            },
            {
                menu_id:3,
                checkBoxActive:false,
                id_user_type:6
            },
            {
                menu_id:4,
                checkBoxActive:false,
                id_user_type:6
            },
            {
                menu_id:5,
                checkBoxActive:false,
                id_user_type:6
            },

            {
                menu_id:6,
                checkBoxActive:false,
                id_user_type:6
            }
        ]
    };


    /***
     * Service get access menu by rol user
     */
    function callServiceAccessMenu(){
        spinnerService.show("spinnerNew");

        UserService.getAccessMenuByRol()
            .then(function(resp){
                if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                    resp.ReaxiumResponse.object.forEach(function(entry){


                        if(entry.user_type_id == $scope.checkBoxAdmin.id_user_type){

                            for(var i=0;i<$scope.checkBoxAdmin.object.length;i++){
                                if($scope.checkBoxAdmin.object[i].menu_id == entry.menu_id){
                                    $scope.checkBoxAdmin.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                    break;
                                }
                            }
                        }
                        else if(entry.user_type_id == $scope.checkBoxSchool.id_user_type){

                            for(var i=0;i<$scope.checkBoxSchool.object.length;i++){
                                if($scope.checkBoxSchool.object[i].menu_id == entry.menu_id){
                                    $scope.checkBoxSchool.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                    break;
                                }
                            }
                        }
                        else if(entry.user_type_id == $scope.checkBoxCallCenter.id_user_type){

                            for(var i=0;i<$scope.checkBoxCallCenter.object.length;i++){
                                if($scope.checkBoxCallCenter.object[i].menu_id == entry.menu_id){
                                    $scope.checkBoxCallCenter.object[i].checkBoxActive = (entry.active_menu == 1) ? true : false;
                                    break;
                                }
                            }
                        }
                    });
                }else{
                    console.error("Error obteniendo la data del servicio: "+resp.ReaxiumResponse.message);
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                }
            })
            .catch(function(err){
                console.error("Error obteniendo la data del servicio: "+err);
                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
            }).finally(function(){
            spinnerService.hide("spinnerNew");
        });
    }


    function init(){

        console.info("Iniciando controlador SuperUserController");

        if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
            console.error("Usuario no a iniciado session");
            $state.go("login");
        }
        else{
            //data user by session
            $scope.photeUser = $sessionStorage.user_photo;
            $scope.nameUser = $sessionStorage.nameUser;
            //menu sidebar
            $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_SUPER_USER);
            callServiceAccessMenu();
        }
    }

    init();


    $scope.saveAccess = function(){
        spinnerService.show("spinnerNew");

        var jsonSend ={
            ReaxiumParameters:{
                ReaxiumSystem:{
                    object:[]
                }
            }
        };


        $scope.checkBoxAdmin.object.forEach(function(entry){
            var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
            jsonSend.ReaxiumParameters.ReaxiumSystem.object.push({type_user_id:entry.id_user_type,menu_id:entry.menu_id,active_menu:checkActiveMenu})
        });

        $scope.checkBoxCallCenter.object.forEach(function(entry){
            var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
            jsonSend.ReaxiumParameters.ReaxiumSystem.object.push({type_user_id:entry.id_user_type,menu_id:entry.menu_id,active_menu:checkActiveMenu})
        });

        $scope.checkBoxSchool.object.forEach(function(entry){
            var checkActiveMenu = (entry.checkBoxActive == false) ? 0 : 1;
            jsonSend.ReaxiumParameters.ReaxiumSystem.object.push({type_user_id:entry.id_user_type,menu_id:entry.menu_id,active_menu:checkActiveMenu})
        });

        $log.debug("Arreglo final",jsonSend);

        UserService.updateAllAccessMenu(jsonSend)

            .then(function(resp){
                if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                    growl.success("Access the menu successfully updated");
                }
                else{
                    console.error("Error update access menu user rol: "+resp.ReaxiumResponse.message);
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                }
            })
            .catch(function(err){
                console.error("Error update access menu user rol: "+err);
                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
            })
            .finally(function(){
                spinnerService.hide("spinnerNew");
            });

    }

})