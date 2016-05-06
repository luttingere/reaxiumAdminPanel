/**
 * Created by Eduardo Luttinger on 03/05/2016.
 */
angular.module('App')

    .controller("UserHistoryAccessController", function ($scope,
                                                         UserService,
                                                         uiGmapGoogleMapApi,
                                                         $state,
                                                         $rootScope,
                                                         spinnerService,
                                                         $log,
                                                         $sessionStorage,
                                                         growl,
                                                         $confirm,
                                                         GLOBAL_MESSAGE,
                                                         GLOBAL_CONSTANT) {
        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};
        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        //array of users in the autocomplete field
        $scope.userFilter = [];

        console.log("Cargo el Controlador de Historico de accesos para un usuario");
        $scope.showMessage = "";

        $scope.showUserBox = "hideBox";

        $scope.userSelected = {
            fullName: "",
            photo: "",
            dni: "",
            userType: "student"
        }

        /**
         * cabecera de la tabla de usuarios
         * @type {*[]}
         */
        $scope.userTableHeaders = [{
            title: 'Access Date',
            value: 'datetime'
        }, {
            title: 'Traffic Type',
            value: 'TrafficType.traffic_type_name'
        }, {
            title: 'Device ID',
            value: 'ReaxiumDevice.device_id'
        },
           {
            title: 'Device Name',
            value: 'ReaxiumDevice.device_name'
           }
        ];

        //default criteria that will be sent to the server
        $scope.filterCriteria = {
            ReaxiumParameters: {
                page: 1,
                limit:5,
                sortDir: 'desc',
                sortedBy: 'datetime',
                filter: '',
                user_id:''
            }
        };

        /**
         * Method compare input with list server users filter
         * @param str
         * @returns {Array}
         */
        $scope.userAutoCompleteSearch = function (str) {
            var matches = [];

            invokeServiceUserFilter(str);

            $scope.userFilter.forEach(function (person) {
                matches.push(person);
            });

            return matches;
        };

        /**
         * show the access information of the selected user
         * @param selectedUser
         */
        $scope.showUserAccessInformation = function (selectedUser) {

            console.log(selectedUser)
            $scope.userSelected.fullName = selectedUser.title;
            $scope.userSelected.photo = selectedUser.image;
            $scope.userSelected.dni = selectedUser.originalObject.document_id;
            $scope.userSelected.user_id = selectedUser.originalObject.user_id;
            $scope.showUserBox = 'showBox';
            $scope.selectPage();
            clearInput('autoCompleteUserSearch');


        };


        /**
         * call services search user with filter, also fill the array of users
         * to be shown as an autocomplete
         * @param str
         */
        var invokeServiceUserFilter = function (str) {

            var myUserFilterPromise = UserService.getUsersFilter(str);

            myUserFilterPromise.then(function (result) {

                if (result.ReaxiumResponse.code === 0) {

                    //clean the array
                    $scope.userFilter.length = 0;

                    var array = result.ReaxiumResponse.object;

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
                console.log("Error servicio filtro: " + err);
            });
        };


        var clearInput = function (id) {
            if (id) {
                $scope.$broadcast('angucomplete-alt:clearInput', id);
            }
            else {
                $scope.$broadcast('angucomplete-alt:clearInput');
            }
        };

        $scope.getAllHistoricalAccess = function () {

            spinnerService.show("spinnerUserList");
            $scope.filterCriteria.ReaxiumParameters.user_id = $scope.userSelected.user_id;
            UserService.getHistoricalAccessOfAUser($scope.filterCriteria).then(function (data) {
                console.log(data);
                $scope.trafficHistory = data.traffic;
                $scope.totalPages = data.totalPages;
                console.log($scope.totalPages);
                $scope.totalRecords = data.totalRecords;
                spinnerService.hide("spinnerUserList");

                var messageGrowl = UserService.getShowGrowlMessage();

                if(messageGrowl.isShow){
                    growl.info(messageGrowl.message);
                    UserService.cleanGrowl();
                }

            }).catch(function(err){
                console.error("Error invocando servicio getAllUsers "+err);
                $scope.trafficHistory  = [];
                $scope.totalPages = 0;
                $scope.totalRecords = 0;
                spinnerService.hide("spinnerUserList");
                growl.error(GLOBAL_MESSAGE.MESSAGE_SERVICE_ERROR);
            });
        }

        //called when navigate to another page in the pagination
        $scope.selectPage = function () {
            $scope.getAllHistoricalAccess();
        };

        //Will be called when filtering the grid, will reset the page number to one
        $scope.filterResult = function () {
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllHistoricalAccess();
        };

        //call back function that we passed to our custom directive sortBy, will be called when clicking on any field to sort
        $scope.onSort = function (sortedBy, sortDir) {
            $scope.filterCriteria.ReaxiumParameters.sortDir = sortDir;
            $scope.filterCriteria.ReaxiumParameters.sortedBy = sortedBy;
            $scope.filterCriteria.ReaxiumParameters.page = 1;
            $scope.getAllHistoricalAccess();
        };





    })
