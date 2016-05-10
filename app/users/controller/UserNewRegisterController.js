/**
 * Created by VladimirIlich G&G on 7/4/2016.
 */

angular.module('App')

    .controller('UserNewCtrl', function ($scope,
                                         uiGmapGoogleMapApi,
                                         UserService,
                                         $log,
                                         $timeout,
                                         $rootScope,
                                         spinnerService,
                                         FILE_SYSTEM_ROUTE,
                                         $state,
                                         $sessionStorage,
                                         $stateParams,
                                         growl,
                                         BusinessService,
                                         GLOBAL_CONSTANT) {

        $scope.selectTypeUser = null;
        $scope.showTableStakeHolder = false;
        $scope.modeEdit = false;
        $scope.userFilter = [];
        $scope.allUserSelcStakeHolder = [];
        $scope.showgrowlMessage = false;
        $scope.showMessage = "";
        $scope.headerName="";


        var nameImageUpload="";


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
            access_type:1,
            user_photo: FILE_SYSTEM_ROUTE.IMAGE_DEFAULT_USER,
            stakeholder_id: null,
            business_id: 0
        };

        $scope.phoneNumbers = {
            phone_home_number: "",
            phone_office_number: "",
            phone_other_number: "",
        }


        var addressObj = {
            address: "",
            latitude: "",
            longitude: ""
        }


        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.businessFilter = [];
        $scope.selectBusiness = null;
        $scope.selectEditBusiness = null;
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
                    !business.business_id.indexOf(str.toString()) >= 0 ){

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
                .then(function(resp){
                   if(resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE){
                       $scope.businessFilter = [];
                       var array = resp.ReaxiumResponse.object;
                       array.forEach(function(entry){
                           var aux ={
                               business_id: entry.business_id,
                               business_name: entry.business_name,
                               business_id_number: entry.business_id_number
                           }

                           $scope.businessFilter.push(aux);
                       });
                   }
                   else{
                       console.info(resp.ReaxiumResponse.message);
                   }
                })
                .catch(function(err){
                    console.error("Error: "+err);
                });

        };


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
         * watched variable selectBusiness
         */
        $scope.$watch('selectBusiness',function(){
            if($scope.selectBusiness != undefined && $scope.selectBusiness != null){
                console.log($scope.selectBusiness);
                $scope.users.business_id = $scope.selectBusiness.originalObject.business_id;
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

           // spinnerService.show("spinnerNew");

            console.info("Iniciando controlador UserNewCtrl...");
            console.info("Mode edit: "+$stateParams.edit);
            console.info("Id del usuario: "+$stateParams.id_user);

            UserService.setModeEdit({isModeEdit:Boolean($stateParams.edit),idUser:parseInt($stateParams.id_user)});
            UserService.setShowGrowlMessage({isShow:false,message:""});


            /***
             * call services AllUsersType
             */
            var myUserTypePromise = UserService.getAllUsersType();
            myUserTypePromise.then(function (result) {
                $scope.allUserType = result;
            }).catch(function(err){
                console.error("Error servicio allUserType: "+err);
            });

            var myStatusUsers = UserService.getAllStatusUser();
            myStatusUsers.then(function (result) {
                $scope.allStatusUser = result;

            }).catch(function(err){
                console.error("Error servicio allStatusUser: "+err);
            });

            //validate mode edit
            if(UserService.getModeEdit().isModeEdit){

                console.log("Esta en modo editar...");

                var promiseUserById = UserService.getUsersById(UserService.getModeEdit().idUser);
                promiseUserById.then(function(result){

                    try{

                        $log.debug(result);
                        UserService.setObjUserById(result);
                        $scope.headerName = result[0].first_name +' '+result[0].first_last_name
                        $scope.users.user_photo = result[0].user_photo;
                        $scope.users.document_id = result[0].document_id;
                        $scope.users.first_name = result[0].first_name;
                        $scope.users.second_name = result[0].second_name;
                        $scope.users.first_last_name = result[0].first_last_name;
                        $scope.users.second_last_name = result[0].second_last_name;

                        $scope.selectEditBusiness = {
                            business_id: result[0].busines.business_id,
                            business_name: result[0].busines.business_name,
                            business_id_number: result[0].busines.business_id_number
                        };

                        $scope.users.birthdate = new Date(result[0].birthdate);
                        $scope.users.email = result[0].email;


                        addressObj.latitude = (result[0].address.length > 0) ? result[0].address[0].latitude :  UserService.getAddressDefault().latitude;
                        addressObj.longitude = (result[0].address.length > 0) ? result[0].address[0].longitude :  UserService.getAddressDefault().longitude;
                        addressObj.address = (result[0].address.length > 0) ? result[0].address[0].address : "No disponible";
                        $scope.address = (result[0].address.length > 0) ? result[0].address[0].address : "No disponible";

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

                        $scope.selectTypeUser = (result[0].user_type != null) ? result[0].user_type.user_type_id : 0;
                        $scope.status_id = result[0].status.status_id;
                        $scope.selectAccT = (result[0].user_type != null) ? result[0].user_type.user_type_id : 0;


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
                        //spinnerService.hide("spinnerNew");
                    }

                }).catch(function(err){
                    console.error("Error servicio getUsersById "+err);
                });
            }else{
                $scope.addTheMap();
            }

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
            }).catch(function(err){
                console.log("Error servicio filtro: "+err);
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
         * Method get obj Flow image upload
         * @param file
         * @param message
         * @param flow
         */
        $scope.someHandlerMethod = function(file,message,flow){

            console.log(message);
            var obj = JSON.parse(message);

            if(obj.success){
                nameImageUpload = file.name;
            }else{
                nameImageUpload = FILE_SYSTEM_ROUTE.IMAGE_DEFAULT_USER;
            }
            console.log("Nombre archivo cargado: "+nameImageUpload);
        }

        /**
         * Method save new user
         */
        $scope.saveNewUser = function () {

            $scope.showgrowlMessage = false;

            spinnerService.show("spinnerNew");

            var pathImage = "";

            if(UserService.getModeEdit().isModeEdit){
                if(!isEmptyString(nameImageUpload)){
                    pathImage = FILE_SYSTEM_ROUTE.FILE_SYSTEM_IMAGES + nameImageUpload;
                }else{
                    pathImage = $scope.users.user_photo;
                }

            }else{
                if(!isEmptyString(nameImageUpload)){
                    pathImage = FILE_SYSTEM_ROUTE.FILE_SYSTEM_IMAGES + nameImageUpload;
                }else{
                    pathImage = FILE_SYSTEM_ROUTE.IMAGE_DEFAULT_USER;
                }
            }

            //validate user relationship stakeholder
            if($scope.selectTypeUser == 3){

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
                            user_photo: pathImage,
                            birthdate: formatDate($scope.users.birthdate),
                            email: $scope.users.email,
                            business_id : $scope.users.business_id

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

                if(UserService.getModeEdit().isModeEdit){

                    var obj = UserService.getObjUserById();
                    dataNewUserStakeHolder.ReaxiumParameters.Users.user_id = obj[0].user_id;

                    if(!isUndefined(obj[0].phone_numbers[0])){
                        dataNewUserStakeHolder.ReaxiumParameters.PhoneNumbers[0].phone_number_id = obj[0].phone_numbers[0].phone_number_id;
                    }

                    if(!isUndefined(obj[0].phone_numbers[1])){
                        dataNewUserStakeHolder.ReaxiumParameters.PhoneNumbers[1].phone_number_id = obj[0].phone_numbers[1].phone_number_id;
                    }

                    if(!isUndefined(obj[0].phone_numbers[2])){
                        dataNewUserStakeHolder.ReaxiumParameters.PhoneNumbers[2].phone_number_id = obj[0].phone_numbers[2].phone_number_id;
                    }


                    dataNewUserStakeHolder.ReaxiumParameters.address[0].address_id = obj[0].address[0].address_id;

                }

                $log.debug("Objeto para enviar stakeHolder", dataNewUserStakeHolder);

                var validObj = validateParamNewUser(dataNewUserStakeHolder,3);

                if(validObj.validate){

                     var promiseCreateUserStake = UserService.createNewUserStakeHolder(dataNewUserStakeHolder);
                     promiseCreateUserStake.then(function(response){
                         if(response.code == 0){

                             UserService.setShowGrowlMessage({isShow:true,message:response.message});
                             spinnerService.hide("spinnerNew");
                             $state.go("allUser");
                         }
                         else{
                             spinnerService.hide("spinnerNew");
                             growl.error(response.message);
                         }
                     }).catch(function(err){
                         console.error("Error creando usuario StakeHolder" +err);
                     });

                }else{
                    spinnerService.hide("spinnerNew");
                    growl.error(validObj.message);
                }

            }
            else{
                //new user normal

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
                            user_photo: pathImage,
                            birthdate: formatDate($scope.users.birthdate),
                            email: $scope.users.email,
                            business_id : $scope.users.business_id

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

                if(UserService.getModeEdit().isModeEdit){

                    var obj = UserService.getObjUserById();
                    dataNewUser.ReaxiumParameters.Users.user_id = obj[0].user_id;

                    if(!isUndefined(obj[0].phone_numbers[0])){
                        dataNewUser.ReaxiumParameters.PhoneNumbers[0].phone_number_id = obj[0].phone_numbers[0].phone_number_id;
                    }
                    if(!isUndefined(obj[0].phone_numbers[1])){
                        dataNewUser.ReaxiumParameters.PhoneNumbers[1].phone_number_id = obj[0].phone_numbers[1].phone_number_id;
                    }

                    if(!isUndefined(obj[0].phone_numbers[2])){
                        dataNewUser.ReaxiumParameters.PhoneNumbers[2].phone_number_id = obj[0].phone_numbers[2].phone_number_id;
                    }

                    dataNewUser.ReaxiumParameters.address[0].address_id = obj[0].address[0].address_id;

                }

                $log.debug("Objeto para enviar", dataNewUser);

                var validObj = validateParamNewUser(dataNewUser,null);

                if(validObj.validate){

                     var promiseCreateUser = UserService.createNewUser(dataNewUser);
                     promiseCreateUser.then(function(response){

                         if(response.code == 0){
                             UserService.setShowGrowlMessage({isShow:true,message:response.message});
                             spinnerService.hide("spinnerNew");
                             $state.go("allUser");
                         }else{
                             spinnerService.hide("spinnerNew");
                             growl.error(response.message)
                         }

                     });

                }else{
                    spinnerService.hide("spinnerNew");
                    growl.error(validObj.message);
                }


            }

        }

    });
