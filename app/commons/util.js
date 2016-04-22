/**
 * Created by VladimirIlich on 6/4/2016.
 * Metodos utilitarios
 * */

/**
 * Search object inside of array
 * @param obj
 * @returns {boolean}
 */
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
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
function isEmptyArray(array){

    if(array.length > 0){
        return true;
    }else{
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


function isDaysClass(dateSelect,daysActivity){
    var flag = false;
    var daySelect = dateSelect.split(".");

    daysActivity.forEach(function(entry){
        if(parseInt(entry) === parseInt(daySelect[0])){
            flag=true;
        }

    });

    return flag;
}

/***
 *
 * @param phone
 * @returns {*}
 */
function cleanMaskPhone(phone){

    return phone.replace("(","").replace(")","").replace("-","");
}

/**
 *
 * @param date
 * @returns {*}
 */
function formatDate(date){
    return moment(date).format("YYYY-MM-DD");
}

/**
 * validate obj send service create users
 * @param obj
 * @param mode
 * @returns {boolean}
 */
function validateParamNewUser(obj,mode){

    var response = {
       validate : true,
        message : ""
    };

    var expRegEmail = new RegExp("^[_a-z0-9-]+(.[_a-z0-9-]+)*@[a-z0-9-]+(.[a-z0-9-]+)*(.[a-z]{2,4})$");
    var objUsers = obj.ReaxiumParameters.Users;
    var arrayPhones = obj.ReaxiumParameters.PhoneNumbers;
    var objAddress = obj.ReaxiumParameters.address;


    //validar datos del usuario
    if(objUsers.document_id == undefined || isEmptyString(objUsers.document_id)){
        response.validate = false;
        response.message = "Document Id Invalid";

    }else if(objUsers.first_name == undefined || isEmptyString(objUsers.first_name)){
        response.validate = false;
        response.message = "FirstName empty";

    }else if(objUsers.second_name == undefined || isEmptyString(objUsers.second_name)){
        response.validate = false;
        response.message = "SecondName empty";

    }else if(objUsers.first_last_name == undefined || isEmptyString(objUsers.first_last_name)){
        response.validate = false;
        response.message = "FirstLastName empty";

    }else if(objUsers.second_last_name == undefined || isEmptyString(objUsers.second_last_name)){
        response.validate = false;
        response.message = "SecondLastName empty";

    }else if(objUsers.user_type_id == undefined || isEmptyString(objUsers.user_type_id)){
        response.validate = false;
        response.message = "User Type Invalid";

    }else if(objUsers.user_photo == undefined || isEmptyString(objUsers.user_photo)){
        response.validate = false;
        response.message = "Photo empty";

    }else if(objUsers.birthdate == undefined || isEmptyString(objUsers.birthdate) ||
        objUsers.birthdate.trim().toLowerCase() === "Invalid date".trim().toLowerCase()){
        response.validate = false;
        response.message = "Birthdate Invalid";

    }else if(objUsers.email == undefined || isEmptyString(objUsers.email) || !objUsers.email.match(expRegEmail)){
        response.validate = false;
        response.message = "Email Invalid";
    }

    //validar que el usuario tenga por lo menos un phone
    if(response.validate){
        var cont = 0;
        if(isEmptyArray(arrayPhones)){
            arrayPhones.forEach(function(entry){
               if(isEmptyString(entry.phone_number)){
                   cont++;
               }
            });

            if(cont == 3){
                response.validate = false;
                response.message = "Phone empty";
            }
        }else{
            response.validate = false;
            response.message = "Phone empty";
        }
    }


    //validar direccion

    if(response.validate){

        if(objAddress[0].address == undefined || isEmptyString(objAddress[0].address)){
            response.validate = false;
            response.message = "Address Invalid";

        }else if(objAddress[0].latitude == undefined || isEmptyString(objAddress[0].latitude)){

            response.validate = false;
            response.message = "Address latitude Invalid";

        }else if(objAddress[0].longitude == undefined || isEmptyString(objAddress[0].longitude)){
            response.validate = false;
            response.message = "Address longitude Invalid";
        }
    }

    //en caso de ser stakeholder
    if(response.validate){
        if(mode == 3){
            var arrayStake = obj.ReaxiumParameters.Relationship;

            if(!isEmptyArray(arrayStake)){
                response.validate = false;
                response.message = "No relationShip StakeHolder";
            }
        }
    }


    return response;
}


function validateAccess(obj){

    var response = {
        validate : true,
        message : ""
    };

    if(isEmptyString(obj.login)){

        response.validate = false;
        response.message = "Login empty";

    }else if(isEmptyString(obj.pass)){
        response.validate = false;
        response.message = "Password empty";
    }

    return response;
}