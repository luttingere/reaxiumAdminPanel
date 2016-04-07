/**
 * Created by VladimirIlich on 6/4/2016.
 */

angular.module('Users')

.controller('UserSearchController',function($scope, UserService,$log){

    //TODO autocompletar para filtar usuario


    $scope.userFilter = [];
    $scope.allUser=[];
    $scope.user={};

    $scope.localSearch = function(str){
        var matches = [];
        invokeServiceUserFilter(str);
        $scope.userFilter.forEach(function(person) {
            var fullName = person.firstName + ' ' + person.lastName;
            if ((person.firstName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (person.lastName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0) ||
                (fullName.toLowerCase().indexOf(str.toString().toLowerCase()) >= 0)) {
                matches.push(person);
            }
        });

        return matches;
    }

    var invokeServiceUserFilter = function(str){

        var myUserFilterPromise =  UserService.getUsersFilter(str);

        myUserFilterPromise.then(function(result){

            if(result.ReaxiumResponse.code === 0){
                var at=[];
                var array = result.ReaxiumResponse.object;
                console.log("size:" +array.length);
                array.forEach(function(entry){
                    var aux = {};
                    aux.firstName= entry.first_name;
                    aux.lastName= entry.second_name;
                    aux.userId= entry.user_id;
                    aux.dni= entry.document_id;
                    aux.pic = "dist/img/fotoPerfil.jpg";
                    at.push(aux);
                });

                $scope.userFilter = at;
            }
        });
    }

    $scope.addUser = function(str){
        console.log($scope.userFilter);

        /*$scope.userFilter.forEach(function(person) {
            $scope.allUser.push(person);
        });*/
    }

})