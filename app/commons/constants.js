/**
 * Created by VladimirIlich on 21/4/2016.
 */

angular.module("App")

    //Configuracion de todos los endpoints manejados por la aplicacion
    .constant('CONST_PROXY_URL', {

        PROXY_URL_LOGIN: "http://54.200.133.84/reaxium/Access/checkUserAccess",
        PROXY_URL_ALL_USER: "http://54.200.133.84/reaxium/Users/allUsersInfo",
        PROXY_URL_ALL_USER_WITH_FILTER: "http://54.200.133.84/reaxium/Users/allUsersWithFilter",
        PROXY_URL_ACCESS_TYPE_LIST: "http://54.200.133.84/reaxium/SystemList/accessTypeList",
        PROXY_URL_USER_BY_ID: "http://54.200.133.84/reaxium/Users/userInfo",
        PROXY_URL_ALL_USERS_TYPE: "http://54.200.133.84/reaxium/Users/usersTypeList",
        PROXY_URL_ALL_STATUS_USER: "http://54.200.133.84/reaxium/SystemList/statusList",
        PROXY_URL_CREATE_NEW_USER: "http://54.200.133.84/reaxium/Users/createUser",
        PROXY_URL_CREATE_USER_STAKEHOLDER: "http://54.200.133.84/reaxium/Users/createStakeholderUser",
        PROXY_URL_DELETE_USER: "http://54.200.133.84/reaxium/Users/deleteUser",
        PROXY_URL_CREATE_ACCESS_USER: "http://54.200.133.84/reaxium/Access/createAccessNewUser",
        PROXY_URL_ALL_DEVICES: "http://54.200.133.84/reaxium/Device/allDevicesInfo",
        PROXY_URL_ALL_ROUTES: "http://54.200.133.84/reaxium/Routes/allRoutesSystem",
        PROXY_URL_ALL_USER_WITH_PAGINATE: "http://54.200.133.84/reaxium/Users/allUsersInfoWithPagination",
        PROXY_URL_CHECK_ACCESS_BY_USER: "http://54.200.133.84/reaxium/Access/checkAccessControlByUser",
        PROXY_URL_CREATE_ACCESS_USER_BY_DEVICE: "http://54.200.133.84/reaxium/Access/addDeviceAccessData"

    })
    // configuracion file system imagenes
    .constant('FILE_SYSTEM_ROUTE',{
        FILE_SYSTEM_IMAGES:'http://localhost:8080/ProyectosGandG/images/',
        IMAGE_DEFAULT_USER:'http://localhost:8080/ProyectosGandG/images/profile-default.png',
        FILE_SYSTEM_IMAGES_PROD:'http://54.200.133.84/reaxium_user_images/',
        IMAGE_DEFAULT_USER_PROD:'http://54.200.133.84/reaxium_user_images/profile-default.png',

    })
    .constant('GLOBAL_CONSTANT',{
        ACCESS_LOGIN_AND_PASS: 1,
        ACCESS_BIOMETRIC: 2,
        ACCESS_RFID: 3
    })