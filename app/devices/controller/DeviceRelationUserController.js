/**
 * Created by VladimirIlich on 22/4/2016.
 */

angular.module("App")
    .controller("DeviceRelUserCtrl", function ($scope,
                                               $state,
                                               $sessionStorage,
                                               $rootScope,
                                               DeviceService,
                                               $log,
                                               growl,
                                               spinnerService,
                                               GLOBAL_CONSTANT) {

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.userFilter = [];
        $scope.allUserSelcStakeHolder = [];
        $scope.showTable = false;
        /**
         * Method compare input with list server users filter
         * @param str
         * @returns {Array}
         */
        $scope.localSearch = function (str) {
            var matches = [];

            invokeServiceUserFilter(str);

            $scope.userFilter.forEach(function (person) {
                matches.push(person);
                var fullName = person.first_name + ' ' + person.second_name;
                if ((person.first_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                    (person.second_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                    (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {

                }
            });

            return matches;
        };


        /**
         * call services search user with filter
         * @param str
         */
        var invokeServiceUserFilter = function (str) {

            var myUserFilterPromise = DeviceService.getAllUsersFilter(str);

            myUserFilterPromise.then(function (result) {

                if (result.ReaxiumResponse.code === 0) {
                    $scope.userFilter = [];
                    var array = result.ReaxiumResponse.object;
                    console.log("size:" + array.length);
                    array.forEach(function (entry) {
                        var aux = {
                            first_name: entry.first_name,
                            second_name: entry.second_name,
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

            spinnerService.show("spinnerNew");
            $log.debug(str.originalObject);

            var device_id = DeviceService.getRelUserDevice().id_device;

            DeviceService.getTypeAccessByUser({ReaxiumParameters: {ReaxiumDevice: {user_id: str.originalObject.user_id,device_id:device_id}}})
                .then(function (response) {

                    spinnerService.hide("spinnerNew");

                    var dataUser = response.ReaxiumResponse;

                    if (dataUser.code == 0) {
                        growl.success("Valid user to relate with device");
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

                        $log.debug("Arreglo de mierda", arrayData);
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

                    } else {
                        console.log("Error no se encuentra data pata el usuario");
                        growl.error(response.ReaxiumResponse.message);
                    }
                }).catch(function (err) {
                console.error("Error invocando serviico " + err);
                spinnerService.hide("spinnerNew");
            });

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


        $scope.deleteUserTable = function () {
            $scope.allUserSelcStakeHolder = [];
            $scope.showTable = false;
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

            spinnerService.show("spinnerNew");

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
                        if(response.ReaxiumResponse.code == 0){
                            growl.success(response.ReaxiumResponse.message);
                        }else{
                            growl.error(response.ReaxiumResponse.message);
                        }

                    }).catch(function (err) {
                    spinnerService.hide("spinnerNew");
                    console.log("Error: "+err);
                });


            } else {
                growl.error("Select type access please!");
            }

        }

    })
