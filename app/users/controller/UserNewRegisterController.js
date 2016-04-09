/**
 * Created by VladimirIlich on 7/4/2016.
 */

angular.module('Home')

    .controller('UserNewCtrl',function($scope,uiGmapGoogleMapApi,UserService){

        $scope.selectAccT=0;
        $scope.showBioPanel = false;
        $scope.showRfid = false;
        $scope.showLoginAndPass = false;


        /**
         * add a google map with the location of the user address
         */
        $scope.addTheMap = function () {
            uiGmapGoogleMapApi.then(function (maps) {
                console.log("Google map cargado...");
                maps.visualRefresh = true;
                $scope.map = {
                    center: {
                        latitude: 10.37706,
                        longitude: -66.95635
                    },
                    zoom: 16,
                    options: {"MapTypeId": maps.MapTypeId.HYBRID}
                };
                $scope.marker = {
                    coords: {
                        latitude: 10.37706,
                        longitude: -66.95635
                    }
                };

            });
        }

        $scope.init = function(){
            console.log("Iniciando controlador UserNewCtrl...");
            var myUserPromise = UserService.getAccessType();
            myUserPromise.then(function(result){
              $scope.allAccessType = result;
            });

            $scope.addTheMap();
        }

        $scope.init();



        $scope.$watch('selectAccT',function(){
            console.log('Entro aqui: '+$scope.selectAccT)
            $scope.showBioPanel = false;
            $scope.showRfid = false;
            $scope.showLoginAndPass = false;

            if($scope.selectAccT === "1"){
                $scope.showLoginAndPass = true;
            }
            else if($scope.selectAccT === "2"){
                $scope.showBioPanel = true;
            }else if($scope.selectAccT === "3"){
                $scope.showRfid = true;
            }
        });

        var events = {
            places_changed: function (searchBox) {
                var place = searchBox.getPlaces();
                if (!place || place == 'undefined' || place.length == 0) {
                    console.log('no place data :(');
                    return;
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
        };

        $scope.searchbox = {
            'template': 'searchbox.tpl.html',
            'parentdiv': 'searchBoxParent',
            'options': {
                'autocomplete': true
            },
            'events': events
        };

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
            minDate: new Date(1920,1,1),
            startingDay: 1
        };

        /**
         * Open calendar
         */
        $scope.open1 = function() {
            $scope.popup1.opened = true;
        };

        $scope.popup1 = {
            opened: false
        };

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
                mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 0);

        }


    })
