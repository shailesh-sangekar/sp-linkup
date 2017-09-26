function employeeDashboardCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.UserId = '';
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
    FullDayCount: Number = 0;
    empSelect = '*';
    empExpand = '';
    Pending = 'Approved';
    TimesheetFilter = 'Title eq \'' + vm.UserId + '\'';
    // TimesheetFilter = 'Title eq \'' + vm.UserId + '\' and Submitted_x0020_Status eq \'' + Pending + '\'';
    EmployeeFilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
    CertFilter = EmployeeFilter + ' and Start_x0020_Date ge datetime \'' + (new Date()).getFullYear() +
        '-01-01T00:00:00Z' + '\' and Start_x0020_Date le datetime  \'' + (new Date()).getFullYear() +
        '-12-31T23:59:59Z\'';
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
            vm.numPendingTimeSheet = 0;
            vm.numNotSubmitted = 0;
            vm.numPartiallyApproved = 0;
            vm.numApproved = 0;
            vm.numSubmitted = 0;
            vm.numPendingTimeSheet = vm.gridItemsTimesheet.reduce(function(n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Pending");
            }, 0);
            vm.numNotSubmitted = vm.gridItemsTimesheet.reduce(function(n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Not Submitted");
            }, 0);
            vm.numPartiallyApproved = vm.gridItemsTimesheet.reduce(function(n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Partially Approved");
            }, 0);
            vm.numApproved = vm.gridItemsTimesheet.reduce(function(n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Approved");
            }, 0);
            vm.numSubmitted = vm.gridItemsTimesheet.reduce(function(n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Submitted");
            }, 0);
        }, function(error) {
            console.log('error', error);
        });
    };
    vm.readTimesheet();
    vm.readLeaves = function() {
        spcrud.read($http, vm.listEmployeeLeaves, vm.employeeOptions).then(function(resp) {
            if (resp.status === 200)
                vm.gridItemsLeaves = resp.data.d.results;
            vm.numFullDayLeave = 0;
            vm.numFullDayAbsence = 0;
            vm.numHalfDayLeave = 0;
            vm.numHalfDayAbsence = 0;
            vm.numFullDayLeave = vm.gridItemsLeaves.reduce(function(n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.L_x0020_Total == "1");
            }, 0);
            vm.numFullDayAbsence = vm.gridItemsLeaves.reduce(function(n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.A_x0020_Total == "1");
            }, 0);
            vm.numHalfDayLeave = vm.gridItemsLeaves.reduce(function(n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.HL_x0020_Total == "1");
            }, 0);
            vm.numHalfDayAbsence = vm.gridItemsLeaves.reduce(function(n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.HA_x0020_Total == "1");
            }, 0);
        }, function(error) {
            console.log('error', error);
        });
    };
    vm.readLeaves();
    vm.readCertificates = function() {
        spcrud.read($http, vm.listEmployeeCertificates, vm.certOptions).then(function(resp) {
            if (resp.status === 200)
                vm.gridItemsCertificates = resp.data.d.results;
            console.log('Timesheet Details');
            console.log(vm.gridItemsCertificates);
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.readCertificates();
}
//load
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);