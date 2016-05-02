/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        /*Proxy User*/
        PROXY_URL_ALL_USER: "http://54.200.133.84/reaxium/Users/allUsersInfo",
        PROXY_URL_USER_BY_ID: "http://54.200.133.84/reaxium/Users/userInfo",
        PROXY_URL_ALL_USER_WITH_FILTER: "http://54.200.133.84/reaxium/Users/allUsersWithFilter",
        PROXY_URL_ALL_USERS_TYPE: "http://54.200.133.84/reaxium/Users/usersTypeList",
        PROXY_URL_CREATE_NEW_USER: "http://54.200.133.84/reaxium/Users/createUser",
        PROXY_URL_DELETE_USER: "http://54.200.133.84/reaxium/Users/deleteUser",
        PROXY_URL_ALL_USER_WITH_PAGINATE: "http://54.200.133.84/reaxium/Users/allUsersInfoWithPagination",
        PROXY_URL_CREATE_USER_STAKEHOLDER: "http://54.200.133.84/reaxium/Users/createStakeholderUser",

        /*Proxy Access*/
        PROXY_URL_LOGIN: "http://54.200.133.84/reaxium/Access/checkUserAccess",
        PROXY_URL_CREATE_ACCESS_USER: "http://54.200.133.84/reaxium/Access/createAccessNewUser",
        PROXY_URL_CHECK_ACCESS_BY_USER: "http://54.200.133.84/reaxium/Access/checkAccessControlByUser",
        PROXY_URL_CREATE_ACCESS_USER_BY_DEVICE: "http://54.200.133.84/reaxium/Access/addDeviceAccessData",

        /*Proxy System*/
        PROXY_URL_ACCESS_TYPE_LIST: "http://54.200.133.84/reaxium/SystemList/accessTypeList",
        PROXY_URL_ALL_STATUS_USER: "http://54.200.133.84/reaxium/SystemList/statusList",

        /*Proxy Device*/
        PROXY_URL_ALL_DEVICES: "http://54.200.133.84/reaxium/Device/allDevicesInfo",
        PROXY_URL_ALL_DEVICES_WITH_PAGINATE:"http://54.200.133.84/reaxium/Device/allDeviceWithPagination",
        PROXY_URL_CREATE_DEVICES:"http://54.200.133.84/reaxium/Device/createDevice",
        PROXY_URL_ASSOCIATE_A_DEVICE_WITH_ROUTE: "http://54.200.133.84/reaxium/Device/associateADeviceWithRoute",
        PROXY_URL_DELETE_DEVICE: "http://54.200.133.84/reaxium/Device/deleteDevice",
        PROXY_URL_GET_ROUTE_BY_DEVICE: "http://54.200.133.84/reaxium/Routes/deviceGetRoutes",
        PROXY_URL_DELETE_ROUTE_BY_DEVICE: "http://54.200.133.84/reaxium/Device/deleteRouteByDevice",


        /*Proxy Routes*/
        PROXY_URL_ALL_ROUTES: "http://54.200.133.84/reaxium/Routes/allRoutesWithPagination",
        PROXY_URL_ALL_STOPS: "http://54.200.133.84/reaxium/Routes/allStopsSystem",
        PROXY_URL_STOPS_WITH_FILTER: "http://54.200.133.84/reaxium/Routes/allStopsWithFilter",
        PROXY_URL_CREATE_ROUTE: "http://54.200.133.84/reaxium/Routes/createRoutes",
        PROXY_URL_GET_ROUTE_BY_ID_WITH_STOPS: "http://54.200.133.84/reaxium/Routes/getRouteByIdRelationStop",
        PROXY_URL_ALL_ROUTE_WITH_FILTER: "http://54.200.133.84/reaxium/Routes/allRouteWithFilter",
        PROXY_URL_DELETE_ROUTE: "http://54.200.133.84/reaxium/Routes/deleteRoute"

    })
    // configuracion file system imagenes
    .constant('FILE_SYSTEM_ROUTE',{
        FILE_SYSTEM_IMAGES:'http://localhost:8080/ProyectosGandG/images/',
        IMAGE_DEFAULT_USER:'http://localhost:8080/ProyectosGandG/images/profile-default.png',
        FILE_SYSTEM_IMAGES_PROD:'http://54.200.133.84/reaxium_user_images/',
        IMAGE_DEFAULT_USER_PROD:'http://54.200.133.84/reaxium_user_images/profile-default.png',
        IMAGE_MARKER_MAP:"http://54.200.133.84/reaxium_user_images/Map-Marker.png"

    })
    .constant('GLOBAL_CONSTANT',{
        ACCESS_LOGIN_AND_PASS: 1,
        ACCESS_BIOMETRIC: 2,
        ACCESS_RFID: 3,
        SUCCESS_RESPONSE_SERVICE:0
    })

    .constant("GLOBAL_MESSAGE",{
        MESSAGE_CONFIRM_ACTION:"Are you sure you want to delete ?",
        MESSAGE_ERROR_FATAL:"Error Internal Plataform",
        MESSAGE_SERVICE_ERROR:"Service Unavailable try again later"
    })