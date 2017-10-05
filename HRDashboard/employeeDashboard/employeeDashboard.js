function employeeDashboardCtl($scope, $http, $timeout, $window, $location) {
    var vm = $scope;
    vm.UserId = '';
    vm.ESPLHR = false;
    vm.GroupFound = false;
    vm.NotAuthorised1 = false;
    vm.loaded = false;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.newDate = '';
    vm.oldDate = '';
    vm.processForm = function() {
        vm.UserId = localStorage.getItem("UserID");
        vm.UserName = localStorage.getItem("UserName");
        vm.UserResignDate = localStorage.getItem("UserResignDate");
        if (vm.UserId == null) {
            self.location = "http://espld209/SitePages/Employee%20List.aspx";
        } else {


            vm.convertToDate(vm.UserResignDate);
            vm.getPastYear(vm.UserResignDate);
            vm.getData();
        }

    }
    vm.convertToDate = function(UserResignDate) {
        // var collectionDate = '2002-04-26 09:00:00'; 
        // console.log('R' + ResignDate);
        if (UserResignDate == '' && UserResignDate == null && UserResignDate == undefined) {
            return 'N/A';
        } else {
            var arr = UserResignDate.split("-");
            var collectionDate = arr[2] + '-' + arr[1] + '-' + arr[0] + 'T23:59:59Z';
            vm.newDate = collectionDate;
            // console.log('s' + $scope.newDate);
        }
    }

    vm.getPastYear = function(UserResignDate) {
        // var collectionDate = '2002-04-26 09:00:00'; 
        // console.log('R' + ResignDate);
        if (UserResignDate == '' && UserResignDate == null && UserResignDate == undefined) {
            return 'N/A';
        } else {
            var arr = UserResignDate.split("-");
            // var arrYear=arr[2].split(" ");
            var a = parseInt(arr[2]) - 1;
            var collectionDate = a + '-' + arr[1] + '-' + arr[0] + 'T00:00:00Z';
            vm.oldDate = collectionDate;
            // console.log('s' + $scope.newDate);
        }
    }

    $(window).unload(function() {
        localStorage.removeItem('UserID');
        localStorage.removeItem('UserName');
    });
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
    
    var status = "Active";
    
    
    vm.gridItemsTimesheet = [];
    vm.gridItemsLeaves = [];
    vm.gridItemsCertificates = [];
    vm.readPeopleList = function() {
        spcrud.getCurrentUser($http).then(function(response) {
            if (response.status === 200)
                var myJSON = JSON.stringify(response.data.d.results);
            vm.CurrentLoggedInUser = response.data.d.Title;
            vm.LoggedInUserID = response.data.d.Id;
            for (i = 0; i < response.data.d.Groups.results.length; i++) {
                if (vm.GroupFound == false) {
                    if (response.data.d.Groups.results[i].LoginName == 'ESPL HR') {
                        vm.ESPLHR = true;
                        vm.GroupFound = true;
                        vm.NotAuthorised = false;
                        vm.processForm();
                    } else {
                        vm.NotAuthorised = true;
                    }
                }
                // break;
            }
        }, function(error) {
            console.log('error', error);
        });
    };
    vm.readPeopleList();
    vm.getData = function() {
        vm.readTimesheet();
        vm.readLeaves();
        vm.readempMasterlist();
        vm.readCertificates();
        vm.readProjectTeamMembersList();

    }
    vm.readTimesheet = function() {
        TimesheetFilter = 'Title eq \'' + vm.UserId + '\'';
        vm.timesheetOptions = {
            select: empSelect,
            expand: empExpand,
            filter: TimesheetFilter
        };
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

    vm.readLeaves = function() {
        EmployeeFilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
        EmployeeLeaveFilter = EmployeeFilter + ' and Year eq  \'' + (new Date()).getFullYear() + '\'';
        vm.employeeOptions = {
            select: empSelect,
            expand: empExpand,
            filter: EmployeeLeaveFilter
        };
        spcrud.read($http, vm.listEmployeeLeaves, vm.employeeOptions).then(function(resp) {
            if (resp.status === 200)
                vm.gridItemsLeaves = resp.data.d.results[0];
            vm.gridItemsLeaves.Actual_x0020_Balance = parseFloat(vm.gridItemsLeaves.Actual_x0020_Balance);
            vm.halfLeave = parseFloat(vm.gridItemsLeaves.HL_x0020_Taken) * 0.5;
            vm.halfAbscent = parseFloat(vm.gridItemsLeaves.HA_x0020_Taken) * 0.5;
            vm.totalLeaves = parseFloat(vm.gridItemsLeaves.L_x0020_Taken) + parseFloat(vm.gridItemsLeaves.A_x0020_Taken) + vm.halfLeave + vm.halfAbscent;
        }, function(error) {
            console.log('error', error);
        });
    };

    vm.readCertificates = function() {
        UserIdfilter = 'Employee_x0020_ID eq \'' + vm.UserId + '\'';
        CertFilter = UserIdfilter + ' and Start_x0020_Date ge  \'' + vm.oldDate + '\' and Start_x0020_Date le   \'' + vm.newDate + '\'';

        vm.certOptions = {
            select: empSelect,
            expand: empExpand,
            filter: CertFilter
        };
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
        }, function(error) {
            console.log('error', error);
        });
    }

    vm.readProjectTeamMembersList = function() {
        var status = "Active";
        var projectTeamMembersListFilter = '(Team_x0020_Members/Title eq ' + '\'' + vm.UserName + '\') and (Status eq \'' + status + '\')';
        vm.projectTeamMembersListOptions = {
            select: "Project_x0020_Master_x0020_ID",
            expand: empExpand,
            filter: projectTeamMembersListFilter
        };
        spcrud.read($http, vm.ProjectTeamMembersList, vm.projectTeamMembersListOptions).then(function(response) {
            if (response.status === 200)
                vm.projectTeamMembersList = response.data.d.results;
            vm.readProjectsList(vm.projectTeamMembersList);
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
}
angular.module('employeeDashboardApp', []).controller('employeeDashboardCtl', employeeDashboardCtl);