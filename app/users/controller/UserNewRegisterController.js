/**
 * Created by VladimirIlich G&G on 7/4/2016.
 */

angular.module('Home')

    .controller('UserNewCtrl', function ($scope, uiGmapGoogleMapApi, UserService, $log,$timeout,$rootScope,spinnerService) {

        $scope.selectAccT = null;
        $scope.selectTypeUser = null;
        $scope.showBioPanel = false;
        $scope.showRfid = false;
        $scope.showLoginAndPass = false;
        $scope.showTableStakeHolder = false;
        $scope.modeEdit = false;
        $scope.userFilter = [];
        $scope.allUserSelcStakeHolder = [];
        $scope.showgrowlMessage = false;
        $scope.showMessage = "";

        $scope.users = {
            document_id: "",
            first_name: "",
            second_name: "",
            first_last_name: "",
            second_last_name: "",
            birthdate: "",
            email: "",
            user_type_id: 0,
            status_id: 1,
            user_photo: "/userimages/user_name_profile_picture.jpg",
            stakeholder_id: null
        };


        $scope.phoneNumbers = {
            phone_home_number: "",
            phone_office_number: "",
            phone_other_number: "",
        }

       /* $scope.security.accessType = {
            id_access_type: 0,
            name_access_type: ""
        }*/

        var addressObj = {
            address: "",
            latitude: "",
            longitude: ""
        }


        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};


        /**
         * watched variable typeAccess
         */
        $scope.$watch('selectAccT', function () {

            $scope.showBioPanel = false;
            $scope.showRfid = false;
            $scope.showLoginAndPass = false;

            switch (parseInt($scope.selectAccT)) {
                case 1:
                    $scope.showLoginAndPass = true;
                    break;
                case 2:
                    $scope.showBioPanel = true;
                    break;
                case 3:
                    $scope.showRfid = true;
                    break;
            }

        });

        /**
         * watched variable selectTypeUser
         */
        $scope.$watch('selectTypeUser', function () {

            $scope.showTableStakeHolder = false;

            if (parseInt($scope.selectTypeUser) == 3) {
                $scope.showTableStakeHolder = true;
            }
        });


        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {
            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");

                var latitude = (UserService.getModeEdit().isModeEdit) ? addressObj.latitude : UserService.getAddressDefault().latitude;
                var longitude = (UserService.getModeEdit().isModeEdit) ? addressObj.longitude : UserService.getAddressDefault().longitude;

                console.log("latitude: "+latitude);
                console.log("longitud: "+longitude);

                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude:latitude,
                        longitude: longitude
                    },
                    zoom: 16,
                    options: {"MapTypeId": maps.MapTypeId.HYBRID}
                };
                $scope.marker = {
                    coords: {
                        latitude:latitude,
                        longitude:longitude
                    }
                };
                spinnerService.hide("spinnerNew");
            })
        }

        /**
         * Event relationship google maps
         * @type {{places_changed: events.places_changed}}
         */
        var events = {
            places_changed: function (searchBox) {

                var place = searchBox.getPlaces();
                $log.debug("lugar: ", place);
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
                }
                else {

                    addressObj.address = place[0].formatted_address;
                    addressObj.latitude = place[0].geometry.location.lat();
                    addressObj.longitude = place[0].geometry.location.lng();

                }

                $scope.map = {
                    "center": {
                        "latitude": place[0].geometry.location.lat(),
                        "longitude": place[0].geometry.location.lng()
                    },
                    "zoom": 18
                };
                $scope.marker = {
                    id: 0,
                    coords: {
                        latitude: place[0].geometry.location.lat(),
                        longitude: place[0].geometry.location.lng()
                    }
                };
            }
        }

        /**
         * Method initial controller
         */
        $scope.init = function () {

            spinnerService.show("spinnerNew");

            console.log("Iniciando controlador UserNewCtrl...");

            //validate mode edit
            if(UserService.getModeEdit().isModeEdit){

                console.log("Esta en modo editar...");

                var promiseUserById = UserService.getUsersById(UserService.getModeEdit().idUser);
                promiseUserById.then(function(result){

                    try{

                        $log.debug(result);
                        UserService.setObjUserById(result);

                        $scope.users.document_id = result[0].document_id;
                        $scope.users.first_name = result[0].first_name;
                        $scope.users.second_name = result[0].second_name;
                        $scope.users.first_last_name = result[0].first_last_name;
                        $scope.users.second_last_name = result[0].second_last_name;

                        $scope.users.birthdate = new Date(result[0].birthdate);
                        $scope.users.email = result[0].email;

                        addressObj.latitude = result[0].address[0].latitude;
                        addressObj.longitude = result[0].address[0].longitude;
                        $scope.address = result[0].address[0].address;

                        //PhoneNumber

                            result[0].phone_numbers.forEach(function(entry){

                                if(entry.phone_name.toLowerCase() === "home"){
                                    $scope.phoneNumbers.phone_home_number = entry.phone_number;
                                }
                                else if(entry.phone_name.toLowerCase() === "office"){
                                    $scope.phoneNumbers.phone_office_number = entry.phone_number;
                                }else{
                                    $scope.phoneNumbers.phone_other_number = entry.phone_number;
                                }
                            });



                        //$scope.selectAccT = result[0].user_type.user_type_id;
                        $scope.selectTypeUser = result[0].user_type.user_type_id;
                        $scope.status_id = result[0].status_id;
                        $scope.selectAccT = result[0].user_type.user_type_id;


                        if($scope.selectTypeUser == 3){

                            result[0].UserRelationship.forEach(function(entry){
                                $scope.allUserSelcStakeHolder.push(entry);
                            })
                        }


                        $scope.addTheMap();
                    }
                    catch (err){
                        console.log("error cargando los datos para editar: "+err);
                    }
                    finally {
                        spinnerService.hide("spinnerNew");
                    }

                });
            }else{
                $scope.addTheMap();
            }
            /**
             * call services AccessType
             */
            var myUserPromise = UserService.getAccessType();
            myUserPromise.then(function (result) {
                $scope.allAccessType = result;
            });

            /***
             * call services AllUsersType
             */
            var myUserTypePromise = UserService.getAllUsersType();
            myUserTypePromise.then(function (result) {
                $scope.allUserType = result;
            });

            var myStatusUsers = UserService.getAllStatusUser();
            myStatusUsers.then(function (result) {
                $scope.allStatusUser = result;

            });

        }

        /**
         * Method initial controller
         */
        $scope.init();


        $scope.searchbox = {
            'template': 'searchbox.tpl.html',
            'parentdiv': 'searchBoxParent',
            'options': {
                'autocomplete': true
            },
            'events': events
        }

        /**
         * Formats date calendar
         * @type {string[]}
         */

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[1];
        $scope.altInputFormats = ['M!/d!/yyyy'];

        /**
         * Options calendar
         * @type {string[]}
         */

        $scope.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(1920, 1, 1),
            startingDay: 1
        };

        /**
         * Open calendar
         */
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

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
                            user_id: entry.user_id,
                            document_id: entry.document_id,
                            email:entry.email==null,
                            pic: "dist/img/fotoPerfil.jpg"
                        };

                        $scope.userFilter.push(aux);
                    });

                }
            });
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 0);

        };

        $scope.addUser = function (str) {
            $scope.allUserSelcStakeHolder.push(str.originalObject);
            clearInput('ex2');
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
         * Method save new user
         */
        $scope.saveNewUser = function () {

            if($scope.selectTypeUser === "3"){

                var aux = [];

                $scope.allUserSelcStakeHolder.forEach(function (entry) {
                    aux.push({user_id: entry.user_id})
                });

               var dataNewUserStakeHolder = {
                    ReaxiumParameters:{
                        Users: {

                            document_id: $scope.users.document_id,
                            first_name: $scope.users.first_name,
                            second_name: $scope.users.second_name,
                            first_last_name: $scope.users.first_last_name,
                            second_last_name: $scope.users.second_last_name,
                            user_type_id: parseInt($scope.selectTypeUser),
                            stakeholder_id: null,
                            user_photo: "/userimages/user_name_profile_picture.jpg",
                            birthdate: formatDate($scope.users.birthdate),
                            email: $scope.users.email

                        },
                        PhoneNumbers:[
                            {
                                phone_name: "Home",
                                phone_number: cleanMaskPhone($scope.phoneNumbers.phone_home_number)
                            },
                            {
                                phone_name: "Office",
                                phone_number: cleanMaskPhone($scope.phoneNumbers.phone_office_number)
                            },
                            {
                                phone_name: "Other",
                                phone_number:  cleanMaskPhone($scope.phoneNumbers.phone_other_number)
                            }
                        ],
                        address:[
                            {
                                address: addressObj.address,
                                latitude: addressObj.latitude,
                                longitude: addressObj.longitude
                            }
                        ],
                        Relationship: aux
                    }
                };

                /*is evaluated if in edit mode*/

                if(UserService.getModeEdit()){
                    var obj = UserService.getObjUserById();
                    dataNewUserStakeHolder.ReaxiumParameters.Users.user_id = obj[0].user_id;
                    dataNewUserStakeHolder.ReaxiumParameters.PhoneNumbers[0].phone_number_id = obj[0].phone_numbers[0].phone_number_id;
                    dataNewUserStakeHolder.ReaxiumParameters.PhoneNumbers[1].phone_number_id = obj[0].phone_numbers[1].phone_number_id;
                    dataNewUserStakeHolder.ReaxiumParameters.PhoneNumbers[2].phone_number_id = obj[0].phone_numbers[2].phone_number_id;
                    dataNewUserStakeHolder.ReaxiumParameters.address[0].address_id = obj[0].address[0].address_id;



                }

                $log.debug("Objeto para enviar", dataNewUserStakeHolder);

               /* var promiseCreateUserStake = UserService.createNewUserStakeHolder(dataNewUserStakeHolder);
                promiseCreateUserStake.then(function(response){
                    $scope.showgrowlMessage = true;
                    $scope.showMessage = response.message;


                });*/

            }
            else{

               var dataNewUser = {
                    ReaxiumParameters:{
                        Users: {

                            document_id: $scope.users.document_id,
                            first_name: $scope.users.first_name,
                            second_name: $scope.users.second_name,
                            first_last_name: $scope.users.first_last_name,
                            second_last_name: $scope.users.second_last_name,
                            user_type_id: parseInt($scope.selectTypeUser),
                            stakeholder_id: null,
                            user_photo: "/userimages/user_name_profile_picture.jpg",
                            birthdate: formatDate($scope.users.birthdate),
                            email: $scope.users.email

                        },
                        PhoneNumbers:[
                            {
                                phone_name: "Home",
                                phone_number: cleanMaskPhone($scope.phoneNumbers.phone_home_number)
                            },
                            {
                                phone_name: "Office",
                                phone_number: cleanMaskPhone($scope.phoneNumbers.phone_office_number)
                            },
                            {
                                phone_name: "Other",
                                phone_number:  cleanMaskPhone($scope.phoneNumbers.phone_other_number)
                            }
                        ],
                        address:[
                            {
                                address: addressObj.address,
                                latitude: addressObj.latitude,
                                longitude: addressObj.longitude
                            }
                        ]
                    }
                };

                if(UserService.getModeEdit()){
                    var obj = UserService.getObjUserById();
                    dataNewUser.ReaxiumParameters.Users.user_id = obj[0].user_id;
                    dataNewUser.ReaxiumParameters.PhoneNumbers[0].phone_number_id = obj[0].phone_numbers[0].phone_number_id;
                    dataNewUser.ReaxiumParameters.PhoneNumbers[1].phone_number_id = obj[0].phone_numbers[1].phone_number_id;
                    dataNewUser.ReaxiumParameters.PhoneNumbers[2].phone_number_id = obj[0].phone_numbers[2].phone_number_id;
                    dataNewUser.ReaxiumParameters.address[0].address_id = obj[0].address[0].address_id;



                }

                $log.debug("Objeto para enviar", dataNewUser);


               /* var promiseCreateUser = UserService.createNewUser(dataNewUser);
                promiseCreateUser.then(function(response){
                    $scope.showgrowlMessage = true;
                    $scope.showMessage = response.message;

                });*/
            }

           // $log.debug("Objeto para enviar", dataNewUser);
        }

        //var validateData = function(){}

    })
