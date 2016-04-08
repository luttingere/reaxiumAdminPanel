/**
 * Created by VladimirIlich on 6/4/2016.
 */

angular.module('Users')

.controller('UserSearchController',function($scope, UserService,$log){

    //TODO autocompletar para filtar usuario

    $scope.userFilter = [];
    $scope.allUser=[];

    $scope.localSearch = function(str){
        var matches = [];

        invokeServiceUserFilter(str);

        $scope.userFilter.forEach(function(person) {
            matches.push(person);
            var fullName = person.firstName + ' ' + person.lastName;
            if ((person.firstName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (person.lastName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {

            }
        });

        return matches;
    }

    var invokeServiceUserFilter = function(str){

        var myUserFilterPromise =  UserService.getUsersFilter(str);

        myUserFilterPromise.then(function(result){

            if(result.ReaxiumResponse.code === 0){
                $scope.userFilter=[];
                var array = result.ReaxiumResponse.object;
                console.log("size:" +array.length);
                array.forEach(function(entry){
                    var aux = {
                        firstName: entry.first_name,
                        lastName: entry.second_name,
                        userId: entry.user_id,
                        dni: entry.document_id,
                        pic: "dist/img/fotoPerfil.jpg"
                    };

                    $scope.userFilter.push(aux);
                });

            }
        });
    }

    $scope.addUser = function(str){
        $scope.allUser.push(str.originalObject);
        clearInput('ex2');
    }

    var clearInput = function (id) {
        if (id) {
            $scope.$broadcast('angucomplete-alt:clearInput', id);
        }
        else{
            $scope.$broadcast('angucomplete-alt:clearInput');
        }
    }

})