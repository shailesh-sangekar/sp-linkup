function employeeDashboardCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.UserId = '';
    vm.loaded = false;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.processForm = function () {
        vm.UserId = localStorage.getItem("UserID");
    }
    vm.processForm();

    vm.listEmployeeTimesheet = 'Employee Timesheet';
    vm.listEmployeeLeaves = 'Leave Request Master';
    vm.listEmployeeCertificates = 'Certification Master';
    vm.EmployeeMasterList = 'RnR Employee Master';
    vm.Redeemlist = 'RnR Employee Redemptions';
    vm.ProjectTeamMembersList = 'Project Team Members';
    vm.ProjectsList = 'Projects';
    vm.loaded = false;
    FullDayCount: Number = 0;
    empSelect = '*';
    empExpand = '';
    Pending = 'Approved';
    TimesheetFilter = 'Title eq \'' + vm.UserId + '\'';
    // TimesheetFilter = 'Title eq \'' + vm.UserId + '\' and Submitted_x0020_Status eq \'' + Pending + '\'';
    EmployeeFilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
    CertFilter = EmployeeFilter + ' and Start_x0020_Date ge  \'' + (new Date()).getFullYear() +
        '-01-01T00:00:00Z' + '\' and Start_x0020_Date le   \'' + (new Date()).getFullYear() +
        '-12-31T23:59:59Z\'';
    var status = "Active";
    var projectTeamMembersListFilter = '(Emp_x0020_ID/ID eq ' + '\'' + vm.UserId + '\') and (Status eq \'' + status + '\')';
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
        filter: EmployeeFilter
    };
    vm.gridItemsTimesheet = [];
    vm.gridItemsLeaves = [];
    vm.gridItemsCertificates = [];
    vm.readTimesheet = function () {
        spcrud.read($http, vm.listEmployeeTimesheet, vm.timesheetOptions).then(function (resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsTimesheet = resp.data.d.results;
            vm.numPendingTimeSheet = 0;
            vm.numNotSubmitted = 0;
            vm.numPartiallyApproved = 0;
            vm.numApproved = 0;
            vm.numSubmitted = 0;
            vm.numPendingTimeSheet = vm.gridItemsTimesheet.reduce(function (n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Pending");
            }, 0);
            vm.numNotSubmitted = vm.gridItemsTimesheet.reduce(function (n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Not Submitted");
            }, 0);
            vm.numPartiallyApproved = vm.gridItemsTimesheet.reduce(function (n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Partially Approved");
            }, 0);
            vm.numApproved = vm.gridItemsTimesheet.reduce(function (n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Approved");
            }, 0);
            vm.numSubmitted = vm.gridItemsTimesheet.reduce(function (n, Timesheet) {
                return n + (Timesheet.Submitted_x0020_Status == "Submitted");
            }, 0);
        }, function (error) {
            console.log('error', error);
        });
    };
    vm.readTimesheet();
    vm.readLeaves = function () {
        spcrud.read($http, vm.listEmployeeLeaves, vm.employeeOptions).then(function (resp) {
            if (resp.status === 200)
                vm.gridItemsLeaves = resp.data.d.results;
            vm.numFullDayLeave = 0;
            vm.numFullDayAbsence = 0;
            vm.numHalfDayLeave = 0;
            vm.numHalfDayAbsence = 0;
            vm.numFullDayLeave = vm.gridItemsLeaves.reduce(function (n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.L_x0020_Total == "1");
            }, 0);
            vm.numFullDayAbsence = vm.gridItemsLeaves.reduce(function (n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.A_x0020_Total == "1");
            }, 0);
            vm.numHalfDayLeave = vm.gridItemsLeaves.reduce(function (n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.HL_x0020_Total == "1");
            }, 0);
            vm.numHalfDayAbsence = vm.gridItemsLeaves.reduce(function (n, leavesheet) {
                return n + (leavesheet.Status == 'Approved' && leavesheet.HA_x0020_Total == "1");
            }, 0);
        }, function (error) {
            console.log('error', error);
        });
    };
    vm.readLeaves();
    vm.readCertificates = function () {
        spcrud.read($http, vm.listEmployeeCertificates, vm.certOptions).then(function (resp) {
            if (resp.status === 200)
                vm.gridItemsCertificates = resp.data.d.results;
            console.log('Certificates Details');
            console.log(vm.gridItemsCertificates);
            vm.loaded = true;
        }, function (error) {
            console.log('error', error);
        });

    };
    vm.readCertificates();
    vm.readRedeemList = function () {
        var status = "Pending";
        var redeemFilter = '(Emp_x0020_ID/ID eq ' + '\'' + vm.UserId + '\') and (Status eq \'' + status + '\')';
        vm.redeemOptions = {
            select: empSelect,
            expand: empExpand,
            filter: redeemFilter
        };
        spcrud.read($http, vm.Redeemlist, vm.redeemOptions).then(function (response) {
            if (response.status === 200)
                vm.redeemlistemp = response.data.d.results;
            vm.availablepts = 0;
            vm.totalUsedPts = 0;
            vm.redeemlistemp.forEach(function (item) {
                vm.availablepts = item.Item_x0020_Code.Points * item.RedeemQuantity;
                vm.totalUsedPts = vm.availablepts + vm.totalUsedPts;

            }, this);
            vm.readempMasterlist();
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readempMasterlist = function () {
        vm.totalpts = 0;
        spcrud.read($http, vm.EmployeeMasterList, vm.nameFilterOptions).then(function (response) {
            if (response.status === 200)
                vm.empMasterDetails = response.data.d.results;
            vm.empMasterDetails[0].Balance = parseFloat(vm.empMasterDetails[0].Balance);
            vm.totalpts = vm.empMasterDetails[0].Balance + vm.totalUsedPts;
            // console.log(vm.totalpts);
            // console.log(vm.empMasterDetails[0].Balance);
            // console.log(vm.totalUsedPts);
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readRedeemList();
    vm.readProjectTeamMembersList = function () {

        spcrud.read($http, vm.ProjectTeamMembersList, vm.projectTeamMembersListOptions).then(function (response) {
            if (response.status === 200)
                vm.projectTeamMembersList = response.data.d.results;
            vm.readProjectsList(vm.projectTeamMembersList);
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readProjectsList = function (projectTeamMembersList) {
        var Count=0;
        var projectsListFilter='';
        vm.projectsList.forEach(function (item) {
                
                    if(Count===(projectTeamMembersList.length-1)){
                    projectsListFilter='(Project_x0020_Master_x0020_ID eq ' + '\''+item.Project_x0020_Master_x0020_ID+ '\')';                        
                    }
                    else{
                    projectsListFilter='(Project_x0020_Master_x0020_ID eq ' + '\''+item.Project_x0020_Master_x0020_ID+ '\') or';  
                    }
                

            }, this);
        vm.projectsListOptions = {
            select: empSelect,
            expand: empExpand,
            filter: projectListFilter
        };
        spcrud.read($http, vm.ProjectsList, vm.projectsListOptions).then(function (response) {
            if (response.status === 200)
                vm.empProjectDetails = response.data.d.results;
            
            // console.log(vm.totalpts);
            // console.log(vm.empMasterDetails[0].Balance);
            // console.log(vm.totalUsedPts);
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readProjectTeamMembersList();
}
//load
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);