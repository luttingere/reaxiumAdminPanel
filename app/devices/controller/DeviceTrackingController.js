/**
 * Created by VladimirIlich on 31/5/2016.
 */

var interval = null;

angular.module("App")
    .controller("DeviceTrackCtrl", function ($scope,
                                             $state,
                                             $stateParams,
                                             DeviceService,
                                             RoutesServices,
                                             spinnerService,
                                             $sessionStorage,
                                             $interval,
                                             $log,
                                             $timeout,
                                             growl,
                                             GLOBAL_CONSTANT) {

        //Search on the menu
        $scope.menuOptions = {searchWord: ''};

        var map = undefined;
        var marker = undefined;

        var numDeltas = 100;
        var delay = 20; //milliseconds
        var delta = 0;
        var deltaLat;
        var deltaLng;

        var position = [];


        function init() {

            if (isUndefined($sessionStorage.rol_user) || isEmptyString($sessionStorage.rol_user)) {
                console.error("Usuario no a iniciado session");
                $state.go("login");
            }
            else {
                //data user by session
                $scope.photeUser = $sessionStorage.user_photo;
                $scope.nameUser = $sessionStorage.nameUser;
                //menu sidebar
                $scope.menus = addActiveClassMenu(JSON.parse($sessionStorage.appMenus), GLOBAL_CONSTANT.ID_DEVICE_MENU);

                if ($sessionStorage.rol_user == GLOBAL_CONSTANT.USER_ROL_SCHOOL) {
                    $scope.filterCriteria.ReaxiumParameters.business_id = $sessionStorage.id_business;
                }

                var request = {
                    ReaxiumParameters: {
                        ReaxiumDevice: {
                            device_id: $stateParams.id_device
                        }
                    }
                };

                DeviceService.getTrackingDevice(request)
                    .then(function (resp) {

                        if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                            $log.debug("Respuesta servicio tracking", resp);

                            var latitude = parseFloat(resp.ReaxiumResponse.object[0].latitude);
                            var longitude = parseFloat(resp.ReaxiumResponse.object[0].longitude);

                            createMapAndMarker(latitude, longitude);

                            // invocando ciclo interval para tracking
                            interval = $interval(function () {
                                deviceTracking();
                            }, GLOBAL_CONSTANT.TIME_INTERVAL);
                        }
                        else {


                            var latitude = RoutesServices.getAddressDefault().latitude;
                            var longitude = RoutesServices.getAddressDefault().longitude;

                            createMapAndMarker(latitude,longitude);
                            growl.warning("Device ID: "+$stateParams.id_device +" tracking is not enabled");
                            console.error("Error invocando servicio tracking: " + resp.ReaxiumResponse.message);
                        }

                    })
                    .catch(function (err) {
                        console.error("Error invocando servicio tracking: " + err);
                        $interval.cancel($scope.move);
                    });

            }
        }

        init();

        /**
         * Create Map and Marker
         * @param latitude
         * @param longitude
         */
        function createMapAndMarker(latitude, longitude) {

            position = [latitude, longitude];

            var latlng = new google.maps.LatLng(position[0], position[1]);

            var myOptions = {
                zoom: 16,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };

            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

            marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: "Your current location!"
            });
        }

        /**
         * Device Tracking
         */
        function deviceTracking() {


            var request = {
                ReaxiumParameters: {
                    ReaxiumDevice: {
                        device_id: $stateParams.id_device
                    }
                }
            };

            DeviceService.getTrackingDevice(request)
                .then(function (resp) {

                    if (resp.ReaxiumResponse.code == GLOBAL_CONSTANT.SUCCESS_RESPONSE_SERVICE) {

                        console.log(resp);

                        var latitude = resp.ReaxiumResponse.object[0].latitude;
                        var longitude = resp.ReaxiumResponse.object[0].longitude;

                        var result = [parseFloat(latitude), parseFloat(longitude)];
                        transition(result);

                    } else {
                        console.error("Error invocando servicio tracking: " + resp.ReaxiumResponse.message);
                    }

                })
                .catch(function (err) {
                    console.error("Error invocando servicio tracking: " + err);
                    $interval.cancel(interval);
                });

        }


        function transition(result) {

            try{
                delta = 0;
                deltaLat = (result[0] - position[0]) / numDeltas;
                deltaLng = (result[1] - position[1]) / numDeltas;
                moveMarker();
            }catch(err){
                console.error(err);
                $interval.cancel(interval);
            }

        }

        function moveMarker() {

            try{
                position[0] += deltaLat;
                position[1] += deltaLng;
                var latlng = new google.maps.LatLng(position[0], position[1]);

                marker.setPosition(latlng);
                map.panTo(marker.getPosition());
                if (delta != numDeltas) {
                    delta++;
                    setTimeout(moveMarker, delay);
                }
            }catch(err){
                console.error(err);
                $interval.cancel(interval);
            }

        }


    })
