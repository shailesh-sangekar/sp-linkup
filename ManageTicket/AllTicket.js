function AllTicketCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.spinnerloaded = false;
    vm.loaded = false;
    vm.listESPLServiceDesk = 'ESPL Service Desk';
    vm.listESPLServiceDepartments = 'ESPL Service Departments';
    vm.listServiceDeskComments = 'Service Desk Comments';

    Resigned = 'Resigned';


    vm.readPeopleList = function() {
        spcrud.getCurrentUser($http).then(function(response) {
            if (response.status === 200)
                var myJSON = JSON.stringify(response.data.d.results);
            vm.CurrentLoggedInUser = response.data.d.Title;
            vm.LoggedInUserID = response.data.d.Id;
            var DeptListFilter = '';
            for (i = 0; i < response.data.d.Groups.results.length; i++) {
                // if (vm.GroupFound == false) {
                if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskLinkupSupport') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Linkup Support' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskRMSSupport') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'RMS Support' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskIT') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'IT' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskHR') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'HR' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskFinance') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Finance' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskAdmins') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Admin' + '\') ';
                }

            }
            vm.readlistESPLServiceDesk(DeptListFilter);
        }, function(error) {
            console.log('error', error);
        });
    };

    vm.readPeopleList();

    vm.readlistESPLServiceDesk = function(DeptListFilter) {
        var deptFilter = DeptListFilter.substring(3);
        empSelect = 'Employee/Title,Department/Department,Editor/Title,Author/Title,*';
        empExpand = 'Employee/Title,Department/Department,Editor/Title,Author/Title';
        CreatedDate = 'Created desc';
        count = '1000';
        // deptFilter = DeptListFilter;
        vm.resignedOptions = {
            select: empSelect,
            expand: empExpand,
            filter: deptFilter,
            orderby: CreatedDate,
            top: count
        };
        spcrud.read($http, vm.listESPLServiceDesk, vm.resignedOptions).then(function(resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.DatalistESPLServiceDesk = resp.data.d.results;
            console.log('main data');
            console.log(vm.DatalistESPLServiceDesk);
            vm.DatalistESPLServiceDesk.forEach(f => {
                if (f.Created != null) {
                    var date2 = new Date();
                    var date1 = new Date(f.Created);
                    var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    f.ageDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                }

            });
            vm.readlistServiceDeskComments();
            // vm.readlistServiceDeskComments();
            vm.spinnerloaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.readlistServiceDeskComments = function() {
        vm.DatalistESPLServiceDesk.forEach(function(product) {
            var id = product.Service_x0020_Desk_x0020_ID;
            statusFilter = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID eq \'' + id + '\'';
            commentSelect = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,*';
            commentExpand = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID';
            ModeifiedDate = 'Modified desc';
            var Options = {
                select: commentSelect,
                expand: commentExpand,
                orderby: ModeifiedDate,
                filter: statusFilter
            };
            spcrud.read($http, vm.listServiceDeskComments, Options).then(function(response) {
                if (response.status === 200)
                    if (response.data.d.results !== null || response.data.d.results !== undefined) {
                        vm.DatalistServiceDeskComments1 = response.data.d.results;
                        vm.DatalistESPLServiceDesk.find(f => f.Service_x0020_Desk_x0020_ID == id).FinalStatus = response.data.d.results[0].Status;
                    } else {
                        vm.DatalistESPLServiceDesk.find(f => f.Service_x0020_Desk_x0020_ID == id).FinalStatus = 'N/A';
                    }

            }, function(error) {
                console.log('error', error);
            });

        }, this);
    };
}

//load
angular.module('AllTicketApp', []).controller('AllTicketCtl', AllTicketCtl);