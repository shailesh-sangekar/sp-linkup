function employeeListCtl($scope, $http, $timeout) {
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
        localStorage.setItem("UserID", (employeeId));
        localStorage.setItem("UserName", (employeeName));
    }
    vm.formatDate = function(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [day, month, year].join('-');
    }
    vm.convertToDate = function(stringDate) {
        console.log(stringDate);
        var dateOut = new Date(stringDate);
        dateOut.setDate(dateOut.getDate() + 1);
        console.log(dateOut);
        return dateOut;
    };
}

//load
angular.module('employeeListApp', []).controller('employeeListCtl', employeeListCtl);