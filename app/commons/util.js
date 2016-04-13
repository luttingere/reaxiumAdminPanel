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