/**
 * Created by VladimirIlich on 20/5/2016.
 */
angular.module("App")
    .controller("BulkUsersCtrl", function ($scope,
                                           $sessionStorage,
                                           $state,
                                           growl,
                                           spinnerService,
                                           $log,
                                           BulkService,
                                           UserService,
                                           GLOBAL_CONSTANT,
                                           GLOBAL_MESSAGE) {

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};
        $scope.showButtonProcess = false;
        var nameFile = "";

        function init() {
            console.info("Inicio controlador Bulk Users Controller...");

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

            }
        }

        init();

        /**
         * Method get obj Flow image upload
         * @param file
         * @param message
         * @param flow
         */
        $scope.someHandlerMethod = function (file, message, flow) {

            console.log("Respuesta upload:" +message);

            var obj = JSON.parse(message);
            if (obj.success) {
                nameFile = obj.flowFilename;
                $scope.showButtonProcess=true;
            } else {
                growl.error("Could not upload the file to the server");
            }
        }

        $scope.processBulkUsers = function(){

            spinnerService.show('spinnerNew');
            console.log("name file:" +nameFile);

            if(!isEmptyString(nameFile)){

                var sendObj={
                    ReaxiumParameters:{
                        BulkUsers:{
                            name_file:nameFile
                        }
                    }
                };

                BulkService.sendBulkUsers(sendObj)
                    .then(function(resp){

                        spinnerService.hide('spinnerNew');

                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            UserService.setShowGrowlMessage({isShow:true,message:"User load completed successfully"});
                            $state.go('allUser');
                        }
                        else{
                            console.error("Error service: "+resp.ReaxiumResponse.message);
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }

                    })
                    .catch(function(err){
                        console.error("Error update access menu user rol: "+err);
                        spinnerService.hide('spinnerNew');
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });
            }

        }
    })