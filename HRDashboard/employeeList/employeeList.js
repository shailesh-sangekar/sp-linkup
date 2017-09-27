function employeeListCtl($scope, $http, $timeout) {
    //default data
    var vm = $scope;
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
    vm.readResigned();
    vm.viewMoreButton = function(employeeId, employeeName) {
        console.log(employeeId);
        console.log(employeeName);
        localStorage.setItem("UserID", (employeeId));
        localStorage.setItem("UserName", (employeeName));
    }
    vm.convertToDate=function(ResignDate){
        // var collectionDate = '2002-04-26 09:00:00'; 
    console.log('R'+ResignDate);
    $scope.newDate =new Date(ResignDate);
    console.log('s'+$scope.newDate);
    return $scope.newDate;
    }
}

//load
angular.module('employeeListApp', []).controller('employeeListCtl', employeeListCtl);