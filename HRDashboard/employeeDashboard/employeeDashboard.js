function employeeDashboardCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.UserId = '';
    vm.loaded = false;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.processForm = function() {
        vm.UserId = localStorage.getItem("UserID");
        vm.UserName = localStorage.getItem("UserName");
    }
    vm.processForm();

    vm.listEmployeeTimesheet = 'Employee Timesheet';
    vm.listEmployeeLeaves = 'Employee Leaves Master';
    vm.listEmployeeCertificates = 'Certification Master';
    vm.EmployeeMasterList = 'RnR Employee Master';
    vm.Redeemlist = 'RnR Employee Redemptions';
    vm.ProjectTeamMembersList = 'Project Team Members';
    vm.ProjectsList = 'Projects';
    vm.showTable = false;
    vm.showProjectTable = false;
    empSelect = '*';
    empExpand = '';
    Pending = 'Approved';
    TimesheetFilter = 'Title eq \'' + vm.UserId + '\'';
    EmployeeFilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
    EmployeeLeaveFilter = EmployeeFilter + ' and Year eq  \'' + (new Date()).getFullYear() + '\'';
    CertFilter = EmployeeFilter + ' and Start_x0020_Date ge  \'' + (new Date()).getFullYear() +
        '-01-01T00:00:00Z' + '\' and Start_x0020_Date le   \'' + (new Date()).getFullYear() +
        '-12-31T23:59:59Z\'';
    var status = "Active";
    var projectTeamMembersListFilter = '(Team_x0020_Members/Title eq ' + '\'' + vm.UserName + '\') and (Status eq \'' + status + '\')';
    vm.projectTeamMembersListOptions = {
        select: "Project_x0020_Master_x0020_ID",
        expand: empExpand,
        filter: projectTeamMembersListFilter
    };
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
        filter: EmployeeLeaveFilter
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
                vm.gridItemsLeaves = resp.data.d.results[0];
            vm.gridItemsLeaves.Actual_x0020_Balance = parseFloat(vm.gridItemsLeaves.Actual_x0020_Balance);
        }, function(error) {
            console.log('error', error);
        });
    };
    vm.readLeaves();
    vm.readCertificates = function() {
        spcrud.read($http, vm.listEmployeeCertificates, vm.certOptions).then(function(resp) {
            if (resp.status === 200)
                vm.gridItemsCertificates = resp.data.d.results;
            if (vm.gridItemsCertificates.length > 0) {
                vm.showTable = true;
            } else {
                vm.showTable = false;
            }
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.readCertificates();
    vm.readempMasterlist = function() {
        vm.totalpts = 0;
        var redeemFilter = '(Emp_x0020_ID/Employee_x0020_ID eq ' + '\'' + vm.UserId + '\')';
        vm.redeemOptions = {
            select: empSelect,
            expand: empExpand,
            filter: redeemFilter
        };
        spcrud.read($http, vm.EmployeeMasterList, vm.redeemOptions).then(function(response) {
            if (response.status === 200)
                vm.empMasterDetails = response.data.d.results[0];
            vm.empMasterDetails.Balance = parseFloat(vm.empMasterDetails.Balance);
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });
    }
    vm.readempMasterlist();
    vm.readProjectTeamMembersList = function() {

        spcrud.read($http, vm.ProjectTeamMembersList, vm.projectTeamMembersListOptions).then(function(response) {
            if (response.status === 200)
                vm.projectTeamMembersList = response.data.d.results;
        }, function(error) {
            console.log('error', error);
        });
    }
    vm.readProjectsList = function(projectTeamMembersList) {
        var Count = 0;
        vm.projectsList = projectTeamMembersList;
        var projectsListFilter = '';
        vm.projectsList.forEach(function(item) {

            if (Count === (projectTeamMembersList.length - 1)) {
                projectsListFilter = projectsListFilter + ' (Project_x0020_Master_x0020_ID eq ' + '\'' + item.Project_x0020_Master_x0020_ID + '\')';
            } else {
                projectsListFilter = projectsListFilter + ' (Project_x0020_Master_x0020_ID eq ' + '\'' + item.Project_x0020_Master_x0020_ID + '\') or';
            }
            Count++;

        }, this);
        var projSelect = 'Delivery_x0020_Manager/Title,Project_x0020_Manager/Title,Delivery_x0020_Unit/Title,*';
        var projExpand = 'Delivery_x0020_Manager/Title,Project_x0020_Manager/Title,Delivery_x0020_Unit/Title';
        vm.projectsListOptions = {
            select: projSelect,
            expand: projExpand,
            filter: projectsListFilter
        };
        spcrud.read($http, vm.ProjectsList, vm.projectsListOptions).then(function(response) {
            if (response.status === 200)
                vm.empProjectDetails = response.data.d.results;
            console.log(vm.empProjectDetails);
            if (vm.empProjectDetails.length > 0) {
                vm.showProjectTable = true;
            } else {
                vm.showProjectTable = false;
            }
            vm.loaded = true;
        }, function(error) {
            console.log('error', error);
        });
    }
    vm.readProjectTeamMembersList();
}
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);