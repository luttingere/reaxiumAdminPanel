/**
 * Created by VladimirIlich on 6/4/2016.
 * Metodos utilitarios
 * */

var numeros="0123456789";
var letras="abcdefghyjklmnñopqrstuvwxyz";

/**
 * Search object inside of array
 * @param obj
 * @returns {boolean}
 */
Array.prototype.containsObj = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}


function searchObjGeo(latitude_key, longitude_key, myArray) {
    var resp = true;
    for (var i = 0; i < myArray.length; i++) {
        if (myArray[i].latitude === latitude_key && myArray[i].longitude === longitude_key) {
            resp = false;
        }
    }

    return resp;
}


/**
 * Empty string
 * @param str
 * @returns {boolean}
 */
function isEmptyString(str) {
    return (!str || 0 === str.length);
}

/**
 * Empty array
 * @param array
 * @returns {boolean}
 */
function isEmptyArray(array) {

    if (array.length > 0) {
        return true;
    } else {
        return false;
    }
}


/**
 * Compare two objects
 * @param obj1
 * @param obj2
 * @returns {boolean}
 */

function compareObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}


function isDaysClass(dateSelect, daysActivity) {
    var flag = false;
    var daySelect = dateSelect.split(".");

    daysActivity.forEach(function (entry) {
        if (parseInt(entry) === parseInt(daySelect[0])) {
            flag = true;
        }

    });

    return flag;
}

/***
 *
 * @param phone
 * @returns {*}
 */
function cleanMaskPhone(phone) {

    return phone.replace("(", "").replace(")", "").replace("-", "");
}

/**
 *
 * @param date
 * @returns {*}
 */
function formatDate(date) {
    return moment(date).format("DD/MM/YYYY");
}

/**
 * validate obj send service create users
 * @param obj
 * @param mode
 * @returns {boolean}
 */
function validateParamNewUser(obj, mode) {

    var response = {
        validate: true,
        message: ""
    };

    var expRegEmail = new RegExp("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$");
    var objUsers = obj.ReaxiumParameters.Users;
    var arrayPhones = obj.ReaxiumParameters.PhoneNumbers;
    var objAddress = obj.ReaxiumParameters.address;


    //validar datos del usuario
    if (objUsers.first_name == undefined || isEmptyString(objUsers.first_name)) {
        response.validate = false;
        response.message = "First Name field must not be empty";

    } else if (objUsers.first_last_name == undefined || isEmptyString(objUsers.first_last_name)) {
        response.validate = false;
        response.message = "LastName field must not be empty";

    }  else if (objUsers.user_type_id == undefined || isEmptyString(objUsers.user_type_id)) {
        response.validate = false;
        response.message = "User Type field must not be empty";

    }
    else if(objUsers.business_id == undefined || isEmptyString(objUsers.business_id)){
        response.validate = false;
        response.message = "Business field must not be empty";
    }
      else if (objUsers.birthdate == undefined || isEmptyString(objUsers.birthdate) ||
        objUsers.birthdate.trim().toLowerCase() === "Invalid date".trim().toLowerCase()) {

            response.validate = false;
            response.message = "Birthdate field must not be empty";

    }else if(!validateDateBirthDate(objUsers.birthdate,true)){

        response.validate = false;
        response.message = "Invalid date format. Please verify that is mm/dd/yyyy.";
    }
    else if (objUsers.email == undefined || isEmptyString(objUsers.email) || !objUsers.email.match(expRegEmail)) {
        if(objUsers.user_type_id != 2){
            response.validate = false;
            response.message = "Email field invalid";
        }
    }

    //validar que el usuario tenga por lo menos un phone
    if (response.validate) {
        var cont = 0;
        if (isEmptyArray(arrayPhones)) {
            arrayPhones.forEach(function (entry) {
                if (isEmptyString(entry.phone_number)) {
                    cont++;
                }
            });

            if (cont == 3) {
                response.validate = false;
                response.message = "Phone fields must not be empty";
            }
        } else {
            response.validate = false;
            response.message = "Phone fields must not be empty";
        }
    }


    //validar direccion

   /* if (response.validate) {

        if (objAddress[0].address == undefined || isEmptyString(objAddress[0].address)) {
            response.validate = false;
            response.message = "Address Invalid";

        } else if (objAddress[0].latitude == undefined || isEmptyString(objAddress[0].latitude)) {

            response.validate = false;
            response.message = "Address latitude Invalid";

        } else if (objAddress[0].longitude == undefined || isEmptyString(objAddress[0].longitude)) {
            response.validate = false;
            response.message = "Address longitude Invalid";
        }
    }*/

    //en caso de ser stakeholder
    if (response.validate) {
        if (mode == 3) {
            var arrayStake = obj.ReaxiumParameters.Relationship;

            if (!isEmptyArray(arrayStake)) {
                response.validate = false;
                response.message = "Please add a student relationship to proceed";
            }
        }
    }


    return response;
}

/**
 * validate the business fields
 * @param obj
 * @returns {{validate: boolean, message: string}}
 */
function validateParamNewBusiness(obj) {

    var response = {
        validate: true,
        message: ""
    };


    var objBusiness = obj.ReaxiumParameters.Business;
    var phone = obj.ReaxiumParameters.BusinessPhoneNumbers;
    var objAddress = obj.ReaxiumParameters.BusinessAddress;


    //validar datos del usuario
    if (objBusiness.business_name == undefined || isEmptyString(objBusiness.business_name)) {

        response.validate = false;
        response.message = "Business name cannot be empty";

    } else if (objBusiness.business_id_number == undefined || isEmptyString(objBusiness.business_id_number)) {

        response.validate = false;
        response.message = "Business DNI cannot be empty";

    } else if (phone.phone_name == undefined || isEmptyString(phone.phone_name)) {

        response.validate = false;
        response.message = "Business phone name cannot be empty";

    } else if (phone.phone_number == undefined || isEmptyString(phone.phone_number)) {

        response.validate = false;
        response.message = "Business phone number cannot be empty";

    } else if (objAddress.address == undefined || isEmptyString(objAddress.address)) {
        response.validate = false;
        response.message = "Address Invalid";

    } else if (objAddress.latitude == undefined || isEmptyString(objAddress.latitude)) {

        response.validate = false;
        response.message = "Address latitude Invalid";

    } else if (objAddress.longitude == undefined || isEmptyString(objAddress.longitude)) {
        response.validate = false;
        response.message = "Address longitude Invalid";
    }


    return response;
}


function validateAccess(obj) {

    var response = {
        validate: true,
        message: ""
    };

    if (isEmptyString(obj.login)) {

        response.validate = false;
        response.message = "Login empty";

    } else if (isEmptyString(obj.pass)) {
        response.validate = false;
        response.message = "Password empty";
    }else if(isEmptyString(obj.confirmPass)){
        response.validate = false;
        response.message = "Confirm Password empty";
    }

    return response;
}

function validateFieldsNewRoute() {}


function validateFieldNewDevice(name_device, desc_device,list_business,device_serial) {

    var response = {
        validate: true,
        message: ""
    };

    if (isEmptyString(name_device)) {
        response.validate = false;
        response.message = "Field Name Device  cannot be empty";
    }
    else if (isEmptyString(desc_device)) {
        response.validate = false;
        response.message = "Field Description Device cannot be empty";
    }
    else if(!isEmptyArray(list_business)){
        response.validate = false;
        response.message = "You must add a business to continue the process";
    }
    else if(isEmptyString(device_serial)){
        response.validate = false;
        response.message = "You must add a serial business to continue the process";
    }

    return response;
}


function isUndefined(obj) {

    if (obj == undefined) {
        return true;
    }
    return false;
}


function addActiveClassMenu(arrayMenuOriginal,id_menu){

    var arrayMenu = arrayMenuOriginal;

    //active options menu
    for(var i=0; i < arrayMenu.length;i++){
        if(arrayMenu[i].id == id_menu){
            arrayMenu[i].class_active_menu = true;
        }else{
            arrayMenu[i].class_active_menu = false;
        }
    }

    return arrayMenu;
}

/**
 * Generar un numero random aleatorio
 * @param min
 * @param max
 * @returns {number}
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Saber si un string contiene numeros
 * @param texto
 * @returns {number}
 */
function has_number(texto){
    for(var i=0; i<texto.length; i++){
        if (numeros.indexOf(texto.charAt(i),0)!=-1){
            return 1;
        }
    }
    return 0;
}

/**
 * Saber si un string contiene letras
 * @param texto
 * @returns {number}
 */
function has_letters(texto){
    texto = texto.toLowerCase();
    for(var i=0; i<texto.length; i++){
        if (letras.indexOf(texto.charAt(i),0)!=-1){
            return 1;
        }
    }
    return 0;
}


function validateDateBirthDate(fecha){

    var validate = true;

    if(validarFormatoFecha(fecha)){
        if(existeFecha(fecha)){
            if(!validarFechaMenorActual(fecha)){
                validate=false;
                console.log("Fecha es mayor a la actual");
            }
        }else{
            validate=false;
            console.log("Fecha es no existe es incorrecta");
        }
    }else{
        validate=false;
        console.log("Fecha tiene un formato desconocido");
    }

    return validate;
}

/**
 *
 * @param campo
 * @returns {boolean}
 */
function validarFormatoFecha(campo) {
    var RegExPattern = /^\d{1,2}\/\d{1,2}\/\d{2,4}$/;
    if ((campo.match(RegExPattern)) && (campo!='')) {
        return true;
    } else {
        return false;
    }
}


/**
 *
 * @param fecha
 * @returns {boolean}
 */
function existeFecha(fecha){
    var fechaf = fecha.split("/");
    var day = fechaf[0];
    var month = fechaf[1];
    var year = fechaf[2];
    var date = new Date(year,month,'0');
    if((day-0)>(date.getDate()-0)){
        return false;
    }
    return true;
}

/**
 *
 * @param fecha
 * @returns {boolean}
 */
function existeFecha2 (fecha) {
    var fechaf = fecha.split("/");
    var d = fechaf[0];
    var m = fechaf[1];
    var y = fechaf[2];
    return m > 0 && m < 13 && y > 0 && y < 32768 && d > 0 && d <= (new Date(y, m, 0)).getDate();
}


function validarFechaMenorActual(date){
    var x=new Date();
    var fecha = date.split("/");
    x.setFullYear(fecha[2],fecha[1]-1,fecha[0]);
    var today = new Date();

    if (x >= today)
        return false;
    else
        return true;
}