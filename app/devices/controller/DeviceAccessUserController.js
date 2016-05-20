/**
 * Created by VladimirIlich on 22/4/2016.
 */

angular.module("App")
    .controller("DeviceAccessUserCtrl", function ($scope,
                                                  $state,
                                                  $sessionStorage,
                                                  $rootScope,
                                                  DeviceService,
                                                  UserService,
                                                  $log,
                                                  growl,
                                                  spinnerService,
                                                  $stateParams,
                                                  GLOBAL_CONSTANT,
                                                  GLOBAL_MESSAGE) {


        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        $scope.userFilter = [];
        $scope.allUserSelcStakeHolder = [];
        $scope.showTable = false;

        var filterCondition = {
            ReaxiumParameters: {
                Users: {
                    filter: ""
                }
            }
        };


        function init() {
            console.info("Iniciando controlador DeviceRelRouteCtrl");

            if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
                console.error("Usuario no a iniciado session");
                $state.go("login");
            }
            else{
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_DEVICE_MENU);

                console.log("Id device: " + $stateParams.id_device);
                console.log("Mode Device Relation User: " + $stateParams.modeDeviceRelUser);

                if(!isEmptyString($stateParams.id_device) && $stateParams.id_device != null){

                    DeviceService.setRelUserDevice({isModeRel: $stateParams.modeDeviceRelUser,id_device: $stateParams.id_device});

                    if ($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_CALL_CENTER) {

                        filterCondition.ReaxiumParameters.Users.user_type_id = $sessionStorage.rol_user;
                    }
                    else if ($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_SCHOOL) {
                        filterCondition.ReaxiumParameters.Users.user_type_id = $sessionStorage.rol_user;
                        filterCondition.ReaxiumParameters.Users.business_id = $sessionStorage.id_business;
                    }
                }
                else{
                    $state.go("device");
                }
            }
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

                if (result.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
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
            }).catch(function (err) {
                console.log("Error invocando service filter" + err);
            });
        };

        $scope.addUser = function (str) {

            if (!seachObjList(str.originalObject.user_id)) {

                spinnerService.show("spinnerNew");
                $log.debug(str.originalObject);

                var device_id = DeviceService.getRelUserDevice().id_device;

                DeviceService.getTypeAccessByUser({
                        ReaxiumParameters: {
                            ReaxiumDevice: {
                                user_id: str.originalObject.user_id,
                                device_id: device_id
                            }
                        }
                    })
                    .then(function (response) {

                        spinnerService.hide("spinnerNew");

                        var dataUser = response.ReaxiumResponse;

                        if (dataUser.code == 0) {

                            growl.success(GLOBAL_MESSAGE.MESSAGE_USER_VALIDATE_RELATION_DEVICE);
                            $log.debug(response);

                            var obj = {
                                device_id: device_id,
                                user_id: str.originalObject.user_id,
                                document_id: str.originalObject.document_id,
                                first_name: str.originalObject.first_name,
                                second_name: str.originalObject.second_name,
                                login_and_pass: {},
                                biometric: {},
                                rfid: {}

                            };

                            var arrayData = searchAccessTypeId(dataUser.object);

                            var disable_login_and_pass = (!arrayData.containsObj(GLOBAL_CONSTANT.ACCESS_LOGIN_AND_PASS)) ? 0 : 1;
                            var disable_bio = (!arrayData.containsObj(GLOBAL_CONSTANT.ACCESS_BIOMETRIC)) ? 0 : 1;
                            var disable_rfid = (!arrayData.containsObj(GLOBAL_CONSTANT.ACCESS_RFID)) ? 0 : 1;

                            obj.login_and_pass = {
                                disable_login_and_pass: disable_login_and_pass,
                                access_type_id: GLOBAL_CONSTANT.ACCESS_LOGIN_AND_PASS,
                                user_access_data_id: searchAccessDataId(dataUser.object, GLOBAL_CONSTANT.ACCESS_LOGIN_AND_PASS)
                            };

                            obj.biometric = {
                                disable_bio: disable_bio,
                                access_type_id: GLOBAL_CONSTANT.ACCESS_BIOMETRIC,
                                user_access_data_id: searchAccessDataId(dataUser.object, GLOBAL_CONSTANT.ACCESS_BIOMETRIC)
                            };

                            obj.rfid = {
                                disable_rfid: disable_rfid,
                                access_type_id: GLOBAL_CONSTANT.ACCESS_RFID,
                                user_access_data_id: searchAccessDataId(dataUser.object, GLOBAL_CONSTANT.ACCESS_RFID)
                            };


                            $log.debug(obj);
                            $scope.allUserSelcStakeHolder.push(obj);
                            $scope.showTable = true;

                        }
                        else {

                            console.info(dataUser.message);
                            if(dataUser.code == 1){
                                growl.warning(GLOBAL_MESSAGE.MESSAGE_USER_NO_HAS_DATE_ACCESS_DEVICE);
                            }else if(dataUser.code == 2){
                                growl.warning(GLOBAL_MESSAGE.MESSAGE_USER_HAS_ALL_ACCESS_DEVICE);
                            }
                        }
                    }).catch(function (err) {
                    console.error("Error invocando servicio " + err);
                    spinnerService.hide("spinnerNew");
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });

            } else {
               console.log("Usuario ya se encuentra en la lista interna");
                growl.warning("User is already included in your shortlist");
            }

            clearInput('ex2');

        };

        var searchAccessDataId = function (obj, id) {

            var user_access_data_id = 0;

            if (isEmptyArray(obj)) {
                obj.forEach(function (entry) {

                    if (entry.access_type_id === id) {
                        user_access_data_id = entry.user_access_data_id;
                    }
                });
            }

            return user_access_data_id;
        }

        var searchAccessTypeId = function (obj) {

            var typeAccessId = [];

            if (isEmptyArray(obj)) {
                obj.forEach(function (entry) {
                    typeAccessId.push(entry.access_type_id);
                });
            }

            return typeAccessId;
        }

        function buildJsonSend(userObj) {

            var obj = [];

            $.each($('#userTable').find('tbody tr'), function (index, elemento) {
                //cada usuario
                $.each($(elemento).find('td'), function (index2, elementoTD) {

                    //informacion del usuario
                    if ($(elementoTD).attr('id').indexOf('biometrico_' + userObj.user_id) > -1) {

                        var biometrico = $(elementoTD).find('input');
                        if ($(biometrico).is(':checked')) {
                            var arrayValues = $(biometrico).val().split("-");
                            obj.push({device_id: userObj.device_id, user_access_data_id: arrayValues[1]});

                        }
                    }
                    else if ($(elementoTD).attr('id').indexOf('rfid_' + userObj.user_id) > -1) {
                        var rfid = $(elementoTD).find('input');
                        if ($(rfid).is(':checked')) {
                            var arrayValues = $(rfid).val().split("-");
                            obj.push({device_id: userObj.device_id, user_access_data_id: arrayValues[1]});

                        }
                    }
                    else if ($(elementoTD).attr('id').indexOf('userPassword_' + userObj.user_id) > -1) {
                        var userpasss = $(elementoTD).find('input');
                        if ($(userpasss).is(':checked')) {
                            var arrayValues = $(userpasss).val().split("-");
                            obj.push({device_id: userObj.device_id, user_access_data_id: arrayValues[1]});
                        }
                    }
                });
            });

            return obj;
        }


        $scope.deleteUserTable = function (user_id) {

            console.log("Delete Element: " + user_id);
            var index = -1;
            for (var i = 0, len = $scope.allUserSelcStakeHolder.length; i < len; i++) {
                if ($scope.allUserSelcStakeHolder[i].user_id == user_id) {
                    index = i;
                    break;
                }
            }

            console.log("Delete Element Pos: " + index);
            $scope.allUserSelcStakeHolder.splice(index, 1);

            if ($scope.allUserSelcStakeHolder.length == 0) {
                $scope.showTable = false;
            }


        }

        var clearInput = function (id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            }
            else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };


        $scope.saveAccessUser = function () {

            var arrayObject = [];

            var jsonSendService = {
                ReaxiumParameters: {
                    ReaxiumDevice: {
                        object: []
                    }
                }
            };

            $scope.allUserSelcStakeHolder.forEach(function (entry) {
                arrayObject.push(buildJsonSend(entry));
            });

            if (isEmptyArray(arrayObject)) {

                spinnerService.show("spinnerNew");

                arrayObject.forEach(function (entry) {

                    entry.forEach(function (obj) {

                        $log.debug(obj);

                        jsonSendService.ReaxiumParameters.ReaxiumDevice.object.push(
                            {
                                device_id: obj.device_id,
                                user_access_data_id: obj.user_access_data_id
                            });
                    });

                });

                $log.debug("Json para enviar: ", jsonSendService);

                //llamando servicio para crear los accessos a los usuario

                DeviceService.newCreateAccessUserByDevice(jsonSendService)
                    .then(function (response) {
                        spinnerService.hide("spinnerNew");
                        if (response.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                            DeviceService.setShowGrowlMessage({
                                isShow: true,
                                message: GLOBAL_MESSAGE.MESSAGE_ASSOCIATE_ACCESS_DEVICE_SUCCESS
                            });
                            $state.go('device');
                        } else {
                            growl.error(response.ReaxiumResponse.message);
                        }

                    }).catch(function (err) {
                    spinnerService.hide("spinnerNew");
                    console.log("Error: " + err);
                    growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });
            }
            else {
                growl.warning(GLOBAL_MESSAGE.MESSAGE_ADD_USERS_TO_CONTINUE);
            }

        }


        function seachObjList(id_user) {

            var validate = false;

            if ($scope.allUserSelcStakeHolder.length > 0) {

                $scope.allUserSelcStakeHolder.forEach(function (entry) {

                    if (entry.user_id == id_user) {
                        validate = true;
                    }
                });
            }

            return validate;
        }

    })
