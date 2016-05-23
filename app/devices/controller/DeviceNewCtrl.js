/**
 * Created by VladimirIlich on 28/4/2016.
 */
angular.module("App")

    .controller("DeviceNewCtrl", function ($scope,
                                           $state,
                                           $stateParams,
                                           $log,
                                           $rootScope,
                                           $sessionStorage,
                                           DeviceService,
                                           BusinessService,
                                           growl,
                                           spinnerService,
                                           GLOBAL_CONSTANT,
                                           GLOBAL_MESSAGE) {

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        $scope.deviceName = "";
        $scope.deviceDescription = "";
        $scope.deviceSerialNumber = "";
        $scope.showTableBusiness = false;
        $scope.disabledFields = false;
        $scope.listBusinessAsoc = [];
        $scope.businessFilter = [];

        var loadServices = true;

          function validateSession() {
              console.info("Validando datos de session");

            if(isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)){
                console.error("Usuario no a iniciado session");
                loadServices = false;
                $state.go("login");
            }
            else{
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus),GLOBAL_CONSTANT.ID_DEVICE_MENU);
                DeviceService.setShowGrowlMessage({isShow:false,message:""});
            }
        }

        validateSession();


        function init(){
            console.info("Iniciando controlador DeviceNewCtrl");
            console.log("Id device: " + $stateParams.id_device);
            console.log("Mode Device Relation User: " + $stateParams.edit);
            DeviceService.setModeEdit({isModeEdit:Boolean($stateParams.edit),id_device:$stateParams.id_device});

            if(DeviceService.getModeEdit().isModeEdit){

                spinnerService.show("spinnerNew");

                DeviceService.getDeviceById(DeviceService.getModeEdit().id_device)
                    .then(function(resp){

                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){

                            $scope.deviceName =  resp.ReaxiumResponse.object[0].device_name;
                            $scope.deviceDescription = resp.ReaxiumResponse.object[0].device_description;
                            $scope.deviceSerialNumber = resp.ReaxiumResponse.object[0].device_serial;

                            if(isEmptyArray(resp.ReaxiumResponse.object[0].business)){

                                resp.ReaxiumResponse.object[0].business.forEach(function(entry){
                                    $scope.listBusinessAsoc.push(
                                        {
                                            business_id:entry.business_id,
                                            business_name:entry.business_name,
                                            business_id_number:entry.business_id_number
                                        }
                                    )
                                });

                                $scope.showTableBusiness = true;
                            }

                            $scope.disabledFields = true;
                            spinnerService.hide("spinnerNew");

                        }else{
                            spinnerService.hide("spinnerNew");
                            console.error("error invocando servicio: "+(resp.ReaxiumResponse.message));
                            growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                        }
                    })
                    .catch(function(err){
                        spinnerService.hide("spinnerNew");
                        console.error("error invocando servicio: "+err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });


            }
        }

        if(loadServices){
            init();
        }



        /**
         * Method compare input with list server users filter
         * @param str
         * @returns {Array}
         */
        $scope.localSearchBusiness = function (str) {
            var matches = [];

            invokeServiceBusinessFilter(str);

            $scope.businessFilter.forEach(function (business) {

                if (!business.business_name.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0 ||
                    !business.business_id_number.indexOf(str.toString()) >= 0 ||
                    !business.business_id.indexOf(str.toString()) >= 0) {

                    matches.push(business);
                }
            });

            return matches;
        };


        /**
         * call services search user with filter
         * @param str
         */
        var invokeServiceBusinessFilter = function (str) {

            BusinessService.getBusinessFilter(str)
                .then(function (resp) {
                    if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {
                        $scope.businessFilter = [];
                        var array = resp.ReaxiumResponse.object;
                        array.forEach(function (entry) {
                            var aux = {
                                business_id: entry.business_id,
                                business_name: entry.business_name,
                                business_id_number: entry.business_id_number
                            }

                            $scope.businessFilter.push(aux);
                        });
                    }
                    else {
                        console.info(resp.ReaxiumResponse.message);
                    }
                })
                .catch(function (err) {
                    console.error("Error: " + err);
                });

        };


        /**
         * Add obj business in the list
         * @param obj
         */
        $scope.addBusinessSelect = function(obj){

            if(!searchObjList(obj.originalObject.business_id)){
                $scope.showTableBusiness = true;
                $scope.listBusinessAsoc.push(obj.originalObject);
            }
            else{
                console.log("El business ya fue preseleccionado");
                growl.warning("Business is already included in your shortlist");
            }

            clearInput('ex21');
        };

        var clearInput = function (id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            }
            else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };


        /**
         * delete obj business in the table
         * @param business_id
         */
        $scope.deleteBusinessTable = function (business_id) {

            console.log("Delete Element: " + business_id);
            var index = -1;
            for (var i = 0, len = $scope.listBusinessAsoc.length; i < len; i++) {
                if ($scope.listBusinessAsoc[i].business_id == business_id) {
                    index = i;
                    break;
                }
            }

            console.log("Delete Element Pos: " + index);
            $scope.listBusinessAsoc.splice(index, 1);

            if ($scope.listBusinessAsoc.length == 0) {
                $scope.showTableBusiness = false;
            }

        }


        /**
         * Save device method
         */
        $scope.saveDevice = function () {

            console.info("Entro aqui");
            spinnerService.show("spinnerNew");

            var validObj = validateFieldNewDevice($scope.deviceName, $scope.deviceDescription,$scope.listBusinessAsoc,$scope.deviceSerialNumber);

            if (validObj.validate) {

                var objSend={
                    ReaxiumParameters:{
                        ReaxiumDevice:{
                            device_name: $scope.deviceName,
                            device_description: $scope.deviceDescription,
                            device_serial:$scope.deviceSerialNumber,
                            business:[]
                        }
                    }
                };


                if(DeviceService.getModeEdit().isModeEdit){
                    objSend.ReaxiumParameters.ReaxiumDevice.device_id = DeviceService.getModeEdit().id_device;
                }

                $scope.listBusinessAsoc.forEach(function(entry){
                        objSend.ReaxiumParameters.ReaxiumDevice.business.push({business_id:entry.business_id});
                });

                $log.debug("Obj Enviado:",objSend);

                DeviceService.createDevice(objSend)
                    .then(function (resp) {
                        spinnerService.hide("spinnerNew");
                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            DeviceService.setShowGrowlMessage({isShow: true,message:GLOBAL_MESSAGE.MESSAGE_CREATE_DEVICE});
                            $state.go('device');
                        }
                        else{
                            if(resp.ReaxiumResponse.code == 1){
                                growl.warning(resp.ReaxiumResponse.message);
                            }else{
                                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                            }

                        }
                    })
                    .catch(function (err) {
                        spinnerService.hide("spinnerNew");
                        console.error(err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                });

            }
            else {
                spinnerService.hide("spinnerNew");
                growl.error(validObj.message);
            }


        }


        /**
         * Valida si el usuario ya esta en la lista
         * @param id_user
         * @returns {boolean}
         */
        function searchObjList(id_business) {

            var validate = false;

            if ($scope.listBusinessAsoc.length > 0) {

                $scope.listBusinessAsoc.forEach(function (entry) {

                    if (entry.business_id == id_business) {
                        validate = true;
                    }
                });
            }

            return validate;
        }

    })