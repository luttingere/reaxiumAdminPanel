/**
 * Created by Eduardo Luttinger on 04/04/2016.
 */
var adminPanel = angular.module('adminPanel', []);
var adminPanelMenu = [{
        name: 'User Administration',
        subMenus: [{name: 'All Users'}]
    },
    {
        name: 'Bus Administration',
        subMenus: [{name: 'All Buses'}]
    }];
adminPanel.controller('AdminPanelController', function ($scope) {
    $scope.menus = adminPanelMenu;
    $scope.menuOptions = {searchWord:''};
    return $scope;
});
