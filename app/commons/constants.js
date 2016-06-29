/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        /*Proxy User*/
        PROXY_URL_ALL_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/allUsersInfo",
        PROXY_URL_USER_BY_ID: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/userInfo",
        PROXY_URL_ALL_USER_WITH_FILTER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/allUsersWithFilter",
        PROXY_URL_ALL_USERS_TYPE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/usersTypeList",
        PROXY_URL_CREATE_NEW_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/createUser",
        PROXY_URL_DELETE_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/deleteUser",
        PROXY_URL_ALL_USER_WITH_PAGINATE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/allUsersInfoWithPagination",
        PROXY_URL_SHOW_ACCESS_HISTORY_BY_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Traffic/trafficFilteredByUser",
        PROXY_URL_CREATE_USER_STAKEHOLDER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Users/createStakeholderUser",
        PROXY_URL_STOPS_AND_ROUTE_BY_USER:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/getUserByIdForStops",

        /*Proxy Business*/
        PROXY_URL_CREATE_NEW_BUSINESS: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Business/createBusiness",
        PROXY_URL_ALL_BUSINESS_WITH_PAGINATE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Business/allBusiness",
        PROXY_URL_ALL_BUSINESS_WITH_FILTER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Business/allBusinessFiltered",
        PROXY_URL_DELETE_BUSINESS: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Business/deleteBusiness",
        PROXY_URL_BUSINESS_BY_ID: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Business/businessById",
        PROXY_URL_DELETE_BUSINESS_BY_ID: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Business/deleteBusiness",


        /*Proxy Access*/
        PROXY_URL_LOGIN: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Access/checkUserAccess",
        PROXY_URL_CREATE_ACCESS_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Access/createAccessNewUser",
        PROXY_URL_CHECK_ACCESS_BY_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Access/checkAccessControlByUser",
        PROXY_URL_CREATE_ACCESS_USER_BY_DEVICE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Access/addDeviceAccessData",
        PROXY_URL_GET_ALL_ACCESS_USER:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Access/getAllAccessUsersInfo",

        /*Proxy System*/
        PROXY_URL_ACCESS_TYPE_LIST: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/SystemList/accessTypeList",
        PROXY_URL_ALL_STATUS_USER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/SystemList/statusList",
        PROXY_URL_MENU_SHOW: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/SystemList/getMenu",
        PROXY_URL_GET_ACCESS_MENU:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/SystemList/getAccessActiveMenu",
        PROXY_URL_UPDATE_ACCESS_ROL_MENU:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/SystemList/updateAccessMenuByUserRol",

        /*Proxy Device*/
        PROXY_URL_ALL_DEVICES: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/allDevicesInfo",
        PROXY_URL_ALL_DEVICES_WITH_PAGINATE:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/allDeviceWithPagination",
        PROXY_URL_CREATE_DEVICES:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/createDevice",
        PROXY_URL_ASSOCIATE_A_DEVICE_WITH_ROUTE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/associateADeviceWithRoute",
        PROXY_URL_DELETE_DEVICE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/deleteDevice",
        PROXY_URL_GET_ROUTE_BY_DEVICE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Routes/deviceGetRoutes",
        PROXY_URL_DELETE_ROUTE_BY_DEVICE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/deleteRouteByDevice",
        PROXY_URL_GET_USERS_ACCESS_BY_DEVICE:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/getUsersByDevice",
        PROXY_URL_DELETE_USERS_ACCESS_BY_DEVICE:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/deleteUserAccessDevice",
        PROXY_URL_GET_BUSINESS_BY_DEVICE:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/getBusinessByDevice",
        PROXY_URL_DELETE_BUSINESS_BY_DEVICE:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/deleteBusinessDevice",
        PROXY_URL_GET_DEVICE_ID:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/deviceInfo",
        PROXY_URL_TRACKING_DEVICE:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Device/getLocationDevice",


        /*Proxy Stops*/
        PROXY_URL_ALL_STOPS: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/allStopsWithPagination",
        PROXY_URL_STOPS_WITH_FILTER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/allStopsWithFilter",
        PROXY_URL_CREATE_STOPS:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/createStops",
        PROXY_URL_ASSOCIATION_STOP_AND_USER:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/associationStopAndUser",
        PROXY_URL_DELETE_STOP: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/deleteStops",
        PROXY_URL_GET_STOP_BY_ID:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/getStopById",
        PROXY_URL_GET_USERS_BY_STOP:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/getUserByStops",
        PROXY_URL_DELETE_USERS_BY_STOP:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Stops/deleteUserRelationShipStop",

        /*Proxy Routes*/
        PROXY_URL_ALL_ROUTES: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Routes/allRoutesWithPagination",
        PROXY_URL_CREATE_ROUTE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Routes/createRoutes",
        PROXY_URL_GET_ROUTE_BY_ID_WITH_STOPS: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Routes/getRouteByIdRelationStop",
        PROXY_URL_ALL_ROUTE_WITH_FILTER: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Routes/allRouteWithFilter",
        PROXY_URL_DELETE_ROUTE: "http://localhost:8080/ProyectosGAndG/reaxiumCloud/Routes/deleteRoute",

        /*Proxy Bulks*/
        PROXY_URL_BULK_USERS_SYSTEM:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Bulk/bulkUsersSystem",
        PROXY_URL_BULK_STOPS_SYSTEM:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Bulk/bulkStopsSystem",
        PROXY_URL_BULK_SCHOOL_SYSTEM:"http://localhost:8080/ProyectosGAndG/reaxiumCloud/Bulk/bulkSchoolSystem"

    })
    // configuracion file system imagenes
    .constant('FILE_SYSTEM_ROUTE',{
        FILE_SYSTEM_IMAGES_DESA:'http://localhost:8080/ProyectosGandG/images/',
        IMAGE_DEFAULT_DESA:'http://localhost:8080/ProyectosGandG/images/profile-default.png',
        FILE_SYSTEM_IMAGES:'http://54.200.133.84/reaxium_user_images/',
        IMAGE_DEFAULT_USER:'http://54.200.133.84/reaxium_user_images/profile-default.png',
        IMAGE_MARKER_MAP:"http://54.200.133.84/reaxium_user_images/Map-Marker.png"

    })
    .constant('GLOBAL_CONSTANT',{
        ACCESS_LOGIN_AND_PASS: 1,
        ACCESS_BIOMETRIC: 2,
        ACCESS_RFID: 3,
        ACCESS_DOCUMENT_ID:4,
        SUCCESS_RESPONSE_SERVICE:0,
        USER_ROL_ADMIN:1,
        USER_ROL_SCHOOL:5,
        USER_ROL_CALL_CENTER:6,
        REAXIUM_ADMIN_SCHOOL:5,
        ID_HOME_MENU:0,
        ID_BUSINESS_MENU:1,
        ID_USER_MENU:2,
        ID_DEVICE_MENU:3,
        ID_ROUTES_MENU:4,
        ID_STOPS_MENU:5,
        ID_SUPER_USER:6,
        TIME_INTERVAL:5000

    })

    .constant('TYPES_USERS',{
        TYPE_SCHOOL: 5,
        TYPE_USER_STAKEHOLDER:3,
        TYPE_USER_STUDENT:2

    })

    .constant("GLOBAL_MESSAGE",{
        MESSAGE_CONFIRM_ACTION:"Are you sure you want to delete ?",
        MESSAGE_ERROR_FATAL:"Error Internal Plataform",
        MESSAGE_SERVICE_ERROR:"Service Unavailable try again later",
        MESSAGE_CREATE_DEVICE:"Device created successfully",
        MESSAGE_ASSOCIATE_DEVICE_WITH_ROUTES:"Route associated with the device successfully",
        MESSAGE_USER_VALIDATE_RELATION_DEVICE:"Valid user to relate with device",
        MESSAGE_USER_HAS_ALL_ACCESS_DEVICE:"User already registered with all access to the system",
        MESSAGE_USER_NO_HAS_DATE_ACCESS_DEVICE:"The user does not have any type of access created, please register an access type for this user",
        MESSAGE_ADD_USERS_TO_CONTINUE:"Add users to continue with the process",
        MESSAGE_DELETE_DEVICE:"Device successfully deleted",
        MESSAGE_DELETE_ROUTE_OF_DEVICE:"Route associated with the device successfully removed",
        MESSAGE_DELETE_USERS_OF_DEVICE:"User associated with the device successfully removed",
        MESSAGE_ROUTE_CREATE_SUCCESS:"Route created successfully",
        MESSAGE_DELETE_ROUTE:"Route successfully removed",
        MESSAGE_ASSOCIATE_USER_WITH_STOP:"Associating user successfully stop",
        MESSAGE_CREATE_NEW_STOPS:"Stops successfully created",
        MESSAGE_DELETE_STOP:"Stop successfully removed",
        MESSAGE_DELETE_USER_OF_STOP:"User removed successfully stop",
        MESSAGE_ASSOCIATE_ACCESS_DEVICE_SUCCESS:"Access related to the device successfully",
        MESSAGE_DELETE_BUSINESS_OF_DEVICE:"The business has successfully removed the device"
    })