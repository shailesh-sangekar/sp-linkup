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
    vm.listEmployeeLeaves = 'Leave Request Master';
    vm.listEmployeeCertificates = 'Certification Master';
    vm.loaded = false;
    empSelect = '*';
    empExpand = '';
    TimesheetFilter = 'Title eq \'' + vm.UserId + '\'';
    EmployeeFilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
    CertFilter=EmployeeFilter+' and Expected_x0020_Certification_x0020_Date ge datetime\''+(new Date()).getFullYear()
+'-01-01T00:00:00Z'+'\' and Expected_x0020_Certification_x0020_Date le datetime'+(new Date()).getFullYear()
+'-12-31T23:59:59Z';
    vm.timesheetOptions = {
        select: empSelect,
        expand: empExpand,
        filter: TimesheetFilter
    };
    vm.certOptions = {
        select: empSelect,
        expand: empExpand,
        filter: CertFilter
    };
    vm.employeeOptions = {
        select: empSelect,
        expand: empExpand,
        filter: EmployeeFilter
    };
    vm.gridItemsTimesheet = [];
    vm.gridItemsLeaves = [];
    vm.gridItemsCertificates = [];
    vm.readTimesheet = function() {
        spcrud.read($http, vm.listEmployeeTimesheet, vm.timesheetOptions).then(function(resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsTimesheet = resp.data.d.results;
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.readLeaves = function() {
        spcrud.read($http, vm.listEmployeeLeaves, vm.employeeOptions).then(function(resp) {
            if (resp.status === 200)
            vm.gridItemsLeaves = resp.data.d.results;
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.readCertificates = function() {
        spcrud.read($http, vm.listEmployeeCertificates, vm.certOptions).then(function(resp) {
            if (resp.status === 200)
            vm.gridItemsCertificates = resp.data.d.results;
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    
}
//load
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);