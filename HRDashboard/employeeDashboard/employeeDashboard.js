function employeeDashboardCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.UserId = '';
    vm.processForm = function() {
        vm.UserId = localStorage.getItem("UserID");
    }
    vm.processForm();
}
//load
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);