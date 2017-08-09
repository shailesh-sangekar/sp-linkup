function redeemHistoryCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.loaded = false;
    vm.queryhistory = {};
    vm.queryhistoryBy = '$';
    vm.ImageList = 'RnR Product Images';
    vm.EmployeeList = 'Employee Personal Details Master';
    empSelect = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,*';
    empExpand = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity';
    vm.Redeemlist = 'RnR Employee Redemptions';

    vm.getUserName = function () {
        spcrud.getCurrentUser($http).then(function (response) {
            if (response.status === 200)
                vm.userDetails = response.data.d;
            var userName = response.data.d.Id;
            var empSelect = '*';
            var nameFilter = 'Employee/ID eq ' + '\'' + userName + '\'';
            vm.nameOptions = {
                select: empSelect,
                filter: nameFilter
            };
            vm.reademplist();
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.getUserName();
    vm.reademplist = function () {
        spcrud.read($http, vm.EmployeeList, vm.nameOptions).then(function (response) {
            if (response.status === 200)
                vm.empDetails = response.data.d.results;
            var userId = vm.empDetails[0].ID;
            Approved = 'Approved';
            Pending = 'Pending';
            Rejected = 'Rejected';
            pendingFilter = '(Status eq \'' + Pending + '\') and (Emp_x0020_ID eq \'' + userId + '\')';
            vm.pendingOptions = {
                select: empSelect,
                expand: empExpand,
                filter: pendingFilter
            };
            approvedFilter = '(Status eq \'' + Approved + '\') or (Status eq \'' + Rejected + '\') and (Emp_x0020_ID eq \'' + userId + '\')';
            vm.approvedOptions = {
                select: empSelect,
                expand: empExpand,
                filter: approvedFilter
            };
            vm.readPendinglist();
            vm.readapprovedlist();

        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readPendinglist = function () {
        spcrud.read($http, vm.Redeemlist, vm.pendingOptions).then(function (response) {
            if (response.status === 200)
                vm.redeemPendinglistemp = response.data.d.results;
            vm.appendimg();
            console.log(vm.redeemPendinglistemp);
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readapprovedlist = function () {
        spcrud.read($http, vm.Redeemlist, vm.approvedOptions).then(function (response) {
            if (response.status === 200)
                vm.redeemApprovedlistemp = response.data.d.results;
            vm.appendApproveimg();
            console.log(vm.redeemApprovedlistemp);
        }, function (error) {
            console.log('error', error);
        });
    }

    $timeout(function () { vm.loaded = true; }, 500);
    vm.appendApproveimg = function () {
        vm.redeemApprovedlistemp.forEach(function (product) {
            var id = product.Item_x0020_Code.Item_x0020_Code;
            nameFilter = 'Item_x0020_Code eq \'' + id + '\'';
            var Options = { filter: nameFilter };
            spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
                if (response.status === 200)
                    // vm.Url = response.data.d.results;
                    vm.redeemApprovedlistemp.find(f => f.Item_x0020_Code.Item_x0020_Code == id).Url = response.data.d.results;
                //  vm.loaded = true;
            }, function (error) {
                console.log('error', error);
            });

        }, this);
    }
    vm.appendimg = function () {
        vm.redeemPendinglistemp.forEach(function (product) {
            var id = product.Item_x0020_Code.Item_x0020_Code;
            nameFilter = 'Item_x0020_Code eq \'' + id + '\'';
            var Options = { filter: nameFilter };
            spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
                if (response.status === 200)
                    // vm.Url = response.data.d.results;
                    vm.redeemPendinglistemp.find(f => f.Item_x0020_Code.Item_x0020_Code == id).Url = response.data.d.results;
            }, function (error) {
                console.log('error', error);
            });

        }, this);
        console.log(vm.productDetails);
    }
}

angular.module('redeemHistoryApp', []).controller('redeemHistoryCtl', redeemHistoryCtl);