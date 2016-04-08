var welcomePage = 'app/home/views/content.html';
var appMenus = [{
    'name': 'User Administration',
    'subMenus': [{
        'name': 'All Users',
        'url': "app/users/views/userDashboard.html"
    },{
        'name': 'Search Users',
        'url': "app/users/views/userSearchDashboard.html"
    }, {
        'name': 'New Users',
        'url': "app/users/views/userNewRegister.html"
    }]
}, {
    'name': 'Bus Administration',
    'subMenus': [{
        'name': 'All Buses',
        'url': "app/home/views/content.html"
    }]
}];

angular.module('Home')

.controller('HomeController',['$scope','$state', function ($scope,$state) {
    //Menu
    $scope.menus = appMenus;
    //Search on the menu
    $scope.menuOptions = {searchWord: ''};

    //Display Content logic
    $scope.currentView = welcomePage;
    $scope.setView = function (view) {
        $scope.currentView = view;
    };
    return $scope;
}]);