function employeeListCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.count = 0;
    vm.ESPLHR = false;
    vm.GroupFound = false
    vm.NotAuthorised = false;
    vm.spinnerloaded = false;
    vm.loaded = false;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.listEmployeePersonalDetailsMaster = 'Employee Personal Details Master';
    vm.loaded = false;
    empSelect = '*';
    empExpand = '';
    Resigned = 'Resigned';
    ResignedFilter = 'Status/Employee_x0020_Status eq \'' + Resigned + '\'';
    vm.resignedOptions = {
        select: empSelect,
        expand: empExpand,
        filter: ResignedFilter
    };

    vm.gridItemsResigned = [];

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
                        vm.NotAuthorised = false;
                        vm.GroupFound = true;
                    } else {
                        vm.NotAuthorised = true;
                    }
                }
            }
        }, function(error) {
            console.log('error', error);
        });
    };


    vm.readResigned = function() {
        spcrud.read($http, vm.listEmployeePersonalDetailsMaster, vm.resignedOptions).then(function(resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsResigned = resp.data.d.results;
            vm.spinnerloaded = true;
            vm.loaded = true;
            vm.readPeopleList();
        }, function(error) {
            console.log('error', error);
        });

    };
    vm.viewMoreButton = function(employeeId, employeeName, empResignDate) {
        localStorage.setItem("UserID", (employeeId));
        localStorage.setItem("UserName", (employeeName));
        localStorage.setItem("UserResignDate", (empResignDate));
    }
    vm.convertToDate = function(ResignDate) {
        // var collectionDate = '2002-04-26 09:00:00'; 
        // console.log('R' + ResignDate);
        if (ResignDate == '' || ResignDate == null) {
            return 'N/A';
        } else {
            var arr = ResignDate.split("-");
            var collectionDate = arr[1] + '-' + arr[0] + '-' + arr[2];
            $scope.newDate = new Date(collectionDate);
            // console.log('s' + $scope.newDate);
            return $scope.newDate;
        }

    }
    vm.readResigned();



}

//load
angular.module('employeeListApp', []).controller('employeeListCtl', employeeListCtl);