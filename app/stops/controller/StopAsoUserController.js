/**
 * Created by VladimirIlich on 9/5/2016.
 */

angular.module("App")
    .controller("StopAsoCtrl", function ($scope,
                                         $state,
                                         $stateParams,
                                         $rootScope,
                                         $sessionStorage,
                                         StopsService,
                                         UserService,
                                         $log,
                                         growl,
                                         spinnerService,
                                         GLOBAL_CONSTANT,
                                         GLOBAL_MESSAGE) {

        //menu sidebar
        $scope.menus = addActiveClassMenu($rootScope.appMenus, GLOBAL_CONSTANT.ID_STOPS_MENU);
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;
        $scope.userFilter = [];
        $scope.listUserSelect = [];
        $scope.showUserTable = false;
        var objUser = {};

        function init() {
            console.info("Iniciando Controlador StopAsoCtrl");
            console.log("Id stops: " + $stateParams.id_stop);
            console.log("Mode asocciate User Stop: " + $stateParams.modeAsocStopUser);
            StopsService.setModeAsociateUserStop({modeAsociateUserStop:$stateParams.modeAsocStopUser,id_stop:$stateParams.id_stop});
            //$log.debug(StopsService.getModeAsociateUserStop());
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

             UserService.getUsersFilter(str)
                .then(function (result) {

                if (result.ReaxiumResponse.code === 0) {
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
            });
        };


        $scope.addUser = function (str) {
            $scope.showUserTable = true;
            $log.debug(objUser);
            objUser = str.originalObject;
            $scope.listUserSelect.push(objUser);
            clearInput('ex2');
        };


        /**
         * Build json send service
         * @param id_user
         * @returns {Array}
         */
        function buildJsonSend(id_user) {

            var arrayResponse = [];
            var cont = 0;
            console.log("UserId: "+id_user);

            $.each($('#userStopsTable').find('tbody tr'), function (index, elemento) {

                var objResponse = {code:0,message:"",id_stop:"",user_id:"",start_time:"",end_time:""};

                //cada usuario
                $.each($(elemento).find('td'), function (index2, elementoTD) {

                    var id_td_table = $(elementoTD).attr('id');

                    if(id_td_table != undefined && id_td_table != null && id_td_table !=""){

                        if (id_td_table === 'id_user_' + id_user) {
                            objResponse.user_id = $(elementoTD).text();
                            cont++;
                        }
                        else if (id_td_table === 'timepicker_start_' + id_user) {

                            var start_date = $('#id_input_start_' + id_user).val();

                            if(start_date != ""){
                                objResponse.start_time = start_date;
                                cont++;
                            }
                            else{
                                objResponse.code = 1;
                                objResponse.message="start date empty";
                                arrayResponse.push(objResponse);
                                return false;
                            }
                        }
                        else if (id_td_table === 'timepicker_end_' + id_user) {

                            var end_date = $('#id_input_end_' + id_user).val();

                            if(end_date != ""){
                                objResponse.end_time = end_date;
                                cont++;
                            }else{
                                objResponse.code = 1;
                                objResponse.message = "end date empty";
                                arrayResponse.push(objResponse);
                                return false;
                            }
                        }

                        if(cont == 3){
                            objResponse.code = 0;
                            objResponse.message = "";
                            objResponse.id_stop = StopsService.getModeAsociateUserStop().id_stop;
                            arrayResponse.push(objResponse);
                            cont = 0;
                        }
                    }
                });

            });

            return arrayResponse;
        }


         $scope.timePickerStart = function(id_stop){
            var id = '#id_input_start_' +id_stop;
            $(id).timepicker({
                showMeridian: false,
                defaultTime: '00:00:00',
                minuteStep:5
            });
        }

        $scope.timePickerEnd = function(id_stop){
            var id = '#id_input_end_' +id_stop;
            $(id).timepicker({
                showMeridian: false,
                defaultTime: '00:00:00',
                minuteStep:5
            });
        }


        /**
         * Save users method
         */
        $scope.saveUserStop = function(){

            var objError = {code:0,message:""};
            var arrayAux = [];
            var jsonUserStop = {
                ReaxiumParameters:{
                    ReaxiumStops:{
                        object:[]
                    }
                }
            };


            $scope.listUserSelect.forEach(function(entry){
                arrayAux.push(buildJsonSend(entry.user_id));
            });

            $log.debug("arrayAux: ",arrayAux);

            arrayAux.forEach(function(entry){

                entry.forEach(function(obj){

                    if(obj.code == 0){
                        jsonUserStop.ReaxiumParameters.ReaxiumStops.object.push({
                            id_stop:obj.id_stop,
                            user_id:obj.user_id,
                            start_time:obj.start_time,
                            end_time:obj.end_time
                        });

                    }else{
                        objError.code = obj.code;
                        objError.message = obj.message;
                        jsonUserStop.ReaxiumParameters.ReaxiumStops.object=[];
                        return false;
                    }
                });
            });

            if(objError.code == 0){
                $log.debug("Request: ",jsonUserStop);
                spinnerService.show("spinnerNew");

                StopsService.registerAssociationStopAndUser(jsonUserStop)
                    .then(function(resp){
                        spinnerService.hide("spinnerNew");

                        if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                            StopsService.setShowGrowlMessage({isShow:true,message:resp.ReaxiumResponse.message});
                            $state.go('stops');
                        }else{
                            growl.error(resp.ReaxiumResponse.message);
                        }
                    })
                    .catch(function(err){
                        spinnerService.hide("spinnerNew");
                        console.error("Error invocando servicio: "+err);
                        growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
                    });

            }else{
                console.error("Error data invalida: "+objError.message);
                growl.error(objError.message);
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


        $scope.deleteUserTable = function (user_id) {

            console.log("Delete Element: " + user_id);
            var index = -1;
            for (var i = 0, len = $scope.listUserSelect.length; i < len; i++) {
                if ($scope.listUserSelect[i].user_id == user_id) {
                    index = i;
                    break;
                }
            }

            console.log("Delete Element Pos: " + index);
            $scope.listUserSelect.splice(index, 1);

            if ($scope.listUserSelect.length == 0) {
                $scope.showUserTable = false;
            }


        }
    })

