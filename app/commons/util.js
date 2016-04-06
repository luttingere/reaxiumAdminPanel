/**
 * Created by VladimirIlich on 6/4/2016.
 * Metodos utilitarios
 * */

//TODO si un elemento esta presente desntro de un arreglo
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}

//valida si un objeto es vacio
function isEmptyString(str) {
    return (!str || 0 === str.length);
}

function isEmptyArray(array){

    if(array.length > 0){
        return true;
    }else{
        return false;
    }
}


// Compare two objects
function compareObjects(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

//TODO Validar si el dia seleccionado es valido para reservar
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