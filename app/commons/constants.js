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
        PROXY_URL_ALL_ROUTES: "http://54.200.133.84/reaxium/Routes/allRoutesSystem"


    })
    // configuracion file system imagenes
    .constant('FILE_SYSTEM_ROUTE',{
        FILE_SYSTEM_IMAGES:'http://localhost:8080/ProyectosGandG/images/',
        IMAGE_DEFAULT_USER:'http://localhost:8080/ProyectosGandG/images/profile-default.png'
    })