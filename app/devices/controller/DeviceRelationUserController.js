/**
 * Created by VladimirIlich on 22/4/2016.
 */

angular.module("App")
    .controller("DeviceRelUserCtrl",function($scope,$state,$sessionStorage,$rootScope,DeviceService,$log){

        //menu sidebar
        $scope.menus = $rootScope.appMenus;
        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        //data user by session
        $scope.photeUser = $sessionStorage.user_photo;
        $scope.nameUser = $sessionStorage.nameUser;

        $scope.userFilter = [];
        $scope.allUserSelcStakeHolder = [];
        $scope.showTable =false;
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
                            email:entry.email,
                            pic: entry.user_photo
                        };

                        $scope.userFilter.push(aux);
                    });

                }
            });
        };

        $scope.addUser = function (str) {

            if($scope.allUserSelcStakeHolder.length==0){
                $scope.allUserSelcStakeHolder.push(str.originalObject);
                $log.debug(str.originalObject);
                $scope.showTable = true;
            }

            clearInput('ex2');
        };


        $scope.deleteUserTable = function(){
            $scope.allUserSelcStakeHolder=[];
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
    })
