/**
 * Created by Eduardo Luttinger on 05/04/2016.
 */
app.controller("UserController", function ($scope, $location, $state, $stateParams) {
    console.log("Cargo el Controlador de Usuarios");





    addDataTable();
    return $scope;
});

function addDataTable(){
    $('#userTable').DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": true
    });
}