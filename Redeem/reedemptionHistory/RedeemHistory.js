function redeemHistoryCtl($scope, $http,$timeout) {
    var vm = $scope;
    vm.loaded = false; 
    vm.queryhistory = {};
    vm.queryhistoryBy = '$';
    vm.ImageList = 'RnR Product Images';
    empSelect = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,*';
    empExpand = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    approvedFilter = 'Status eq \'' + Approved + '\' or Status eq \'' + Rejected + '\'';
    pendingFilter = 'Status eq \'' + Pending + '\'';
    vm.pendingOptions = {
        select: empSelect,
        expand: empExpand,
        filter: pendingFilter
    };
    vm.approvedOptions = {
        select: empSelect,
        expand: empExpand,
        filter: approvedFilter
    };
    vm.Redeemlist = 'RnR Employee Redemptions';
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
    vm.readPendinglist();
    vm.readapprovedlist();
      $timeout(function() { vm.loaded = true; }, 500);
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