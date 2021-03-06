/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module('App')

    .controller("SecurityCrl", function ($scope,
                                         $rootScope,
                                         $state,
                                         $log,
                                         UserService,
                                         spinnerService,
                                         $sessionStorage,
                                         growl,
                                         GLOBAL_CONSTANT,
                                         GLOBAL_MESSAGE) {

        $scope.showgrowlMessage = false;
        $scope.showMessage = "";
        $scope.userFilter = [];
        $scope.showForm = false;
        $scope.access = {
            login: "",
            pass: "",
            confirmPass: ""
        };

        var objUser = {};

        var filterCondition = {
            ReaxiumParameters: {
                Users: {
                    filter: ""
                }
            }
        };
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        var init = function () {

            console.info("Iniciando controlador de seguridad");

            if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                console.error("Usuario no a iniciado session");
                $state.go("login");
            }
            else {
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus), GLOBAL_CONSTANT.ID_USER_MENU);

                if ($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_CALL_CENTER) {

                    filterCondition.ReaxiumParameters.Users.user_type_id = $sessionStorage.rol_user;
                }
                else if ($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_SCHOOL) {
                    filterCondition.ReaxiumParameters.Users.user_type_id = $sessionStorage.rol_user;
                    filterCondition.ReaxiumParameters.Users.business_id = $sessionStorage.id_business;
                }

            }

            UserService.setShowGrowlMessage({isShow: false, message: ""});
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
                    !person.email.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) {

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

            filterCondition.ReaxiumParameters.Users.filter = str;

            UserService.getUsersFilter(filterCondition)
                .then(function (result) {

                    if (result.ReaxiumResponse.code === GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                        $scope.userFilter = [];
                        var array = result.ReaxiumResponse.object;
                        console.log("size:" + array.length);
                        array.forEach(function (entry) {
                            var aux = {
                                first_name: entry.first_name,
                                second_name: entry.second_name,
                                first_last_name: entry.first_last_name,
                                second_last_name: entry.second_last_name,
                                user_id: entry.user_id,
                                document_id: entry.document_id,
                                email: entry.email,
                                pic: entry.user_photo
                            };

                            $scope.userFilter.push(aux);
                        });

                    }
                })
                .catch(function (err) {
                    console.error("Error servicio: "+err);
                });
        };


        $scope.addUser = function (str) {
            $scope.showForm = true;
            objUser = str.originalObject;
            $log.debug(objUser);
        };


        $scope.saveAccessUser = function () {

            spinnerService.show("spinnerNew");
            var resValidate = validateAccess($scope.access);

            if (objUser != null && objUser != undefined) {

                if (resValidate.validate) {

                    if ($scope.access.pass === $scope.access.confirmPass) {

                        var objJson = {
                            ReaxiumParameters: {
                                UserAccessData: {
                                    user_id: objUser.user_id,
                                    access_type_id: 1,
                                    user_login: $scope.access.login,
                                    user_password: $scope.access.pass
                                }
                            }
                        };

                         UserService.createAccessUser(objJson)
                        .then(function (response) {

                            spinnerService.hide("spinnerNew");
                            $log.debug(response);
                            if(response.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                                UserService.setShowGrowlMessage({isShow: true, message: response.message});
                                $state.go("allUser");
                            }else{
                                if(response.code === "2"){
                                    growl.warning(response.message);
                                }else{
                                    console.error(response.message);
                                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                                }
                            }

                        }).catch(function (err) {
                            spinnerService.hide("spinnerNew");
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            console.error("Error salvando credenciales usuario" + err);
                        });
                    } else {
                        //UserService.setShowGrowlMessage({isShow:true,message:resValidate.message});
                        spinnerService.hide("spinnerNew");
                        growl.warning("Password and Confirm Password does not match");
                    }

                }
                else {
                    spinnerService.hide("spinnerNew");
                    growl.warning("Login and Pass empty");
                }
            }
            else {
                console.error("Error Obj User invalido");
            }
        }

    })