function employeeListCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.ESPLHR = false;
    vm.GroupFound = false;
    vm.loaded = false;
    vm.loadedSpinner = false;
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
                        vm.GroupFound = true;
                        vm.loadedSpinner = true;
                        vm.readResigned();
                    } else {
                        vm.loadedSpinner = true;
                    }
                    // break;
                }
            }
        }, function(error) {
            console.log('error', error);
        });
    };
    vm.readPeopleList();
    vm.readResigned = function() {
        spcrud.read($http, vm.listEmployeePersonalDetailsMaster, vm.resignedOptions).then(function(resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsResigned = resp.data.d.results;
            vm.loaded = true;
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
}

//load
angular.module('employeeListApp', []).controller('employeeListCtl', employeeListCtl);