var welcomePage = 'app/home/views/content.html';
var appMenus = [{
    'name': 'User Administration',
    'subMenus': [{
        'name': 'All Users',
        'url': "app/users/views/userDashboard.html"
    }]
}, {
    'name': 'Bus Administration',
    'subMenus': [{
        'name': 'All Buses',
        'url': "app/home/views/content.html"
    }]
}];

app.controller("HomeController", function ($scope, $location, $state, $stateParams) {
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
});