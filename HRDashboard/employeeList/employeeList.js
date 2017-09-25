function employeeListCtl($scope, $http, $timeout) {
    //default data
    var vm = $scope;
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
    
    // vm.getUserName = function () {
    //     spcrud.getCurrentUser($http).then(function (response) {
    //         if (response.status === 200)
    //             vm.userDetails = response;
    //     }, function (error) {
    //         console.log('error', error);
    //     });
    // }
    vm.getUserName();
    vm.readResigned = function () {
        spcrud.read($http, vm.listName, vm.resignedOptions).then(function (resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsResigned = resp.data.d.results;
        }, function (error) {
            console.log('error', error);
        });

    };
    vm.readResigned();
    
}

//load
angular.module('employeeListApp', []).controller('employeeListCtl', employeeListCtl);