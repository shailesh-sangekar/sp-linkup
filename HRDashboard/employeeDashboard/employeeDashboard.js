function employeeDashboardCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.UserId = '';
   
    var vm = $scope;
    vm.loaded = false;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.processForm = function() {
        vm.UserId = localStorage.getItem("UserID");
    }
    vm.processForm();
    vm.listEmployeeTimesheet = 'Employee Timesheet';
    vm.listEmployeeLeaves = 'Employee Leaves Master';
    vm.loaded = false;
    empSelect = '*';
    empExpand = '';
    TimesheetFilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
    vm.timesheetOptions = {
        select: empSelect,
        expand: empExpand,
        filter: TimesheetFilter
    };
    
    vm.gridItemsTimesheet = [];
    vm.gridItemsLeaves = [];
    vm.readTimesheet = function() {
        spcrud.read($http, vm.listEmployeeTimesheet, vm.timesheetOptions).then(function(resp) {
            if (resp.status === 200)
            vm.gridItemsTimesheet = resp.data.d.results;
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.readLeaves = function() {
        spcrud.read($http, vm.listEmployeeLeaves, vm.timesheetOptions).then(function(resp) {
            if (resp.status === 200)
            vm.gridItemsLeaves = resp.data.d.results;
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    
}
//load
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);