//AngularJS controller to approve redeemption request

function redeemApprovalCtl($scope, $http) {
/// Add your stuff here
var vm = $scope;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.listName = 'RnR Employee Redemptions';
    vm.listNameProduct = 'RnR Product Catalog';
    empSelect = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,Item_x0020_Code/Items_x0020_Redemend,Item_x0020_Code/Available_x0020_Quantity,*';
    empExpand = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,Item_x0020_Code/Items_x0020_Redemend,Item_x0020_Code/Available_x0020_Quantity';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    approvedFilter = 'Status eq \'' + Approved + '\' or Status eq \'' + Rejected + '\'';
    pendingFilter = 'Status eq \'' + Pending + '\'';
    vm.approvedOptions = {
        select: empSelect,
        expand: empExpand,
        filter: approvedFilter
    };
    vm.pendingOptions = {
        select: empSelect,
        expand: empExpand,
        filter: pendingFilter
    };
    vm.gridItemsApproved = [];
    vm.gridItemsPending = [];
    vm.getUserName = function () {
        spcrud.getCurrentUser($http).then(function (response) {
            if (response.status === 200)
                vm.userDetails = response;
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.getUserName();
    vm.readApproved = function () {
        spcrud.read($http, vm.listName, vm.approvedOptions).then(function (resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsApproved = resp.data.d.results;
        }, function (error) {
            console.log('error', error);
        });

    };
    vm.readApproved();
    vm.readPending = function () {
        spcrud.read($http, vm.listName, vm.pendingOptions).then(function (resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.gridItemsPending = resp.data.d.results;
        }, function (error) {
            console.log('error', error);
        });
    };
    vm.readPending();


    vm.updateApproval = function (item, num) {
        if (num === 1) {

            if (confirm("You are trying to approve! " + item.Item_x0020_Code.Item_x0020_Code)) {
                var sum = item.Item_x0020_Code.Items_x0020_Redemend + item.RedeemQuantity;
                var difference = item.Item_x0020_Code.Available_x0020_Quantity - item.Item_x0020_Code.Items_x0020_Redemend;
                if (sum > difference) {
                    alert('We do not have those many items in stock!');
                } else {
                    spcrud.update($http, vm.listName, item.ID, {
                        'Status': 'Approved',
                        'Redemption_x0020_Approved_x0020_Id': vm.userDetails.data.d.PrincipalType,
                        'Redemption_x0020_Approved_x0020_0': new Date()
                    }).then(function (response) {
                        if (response.status === 204) {
                            vm.readPending();
                            vm.readApproved();
                        }
                    }, function (error) {
                        console.log('error', error);
                    });

                    spcrud.update($http, vm.listNameProduct, item.Item_x0020_CodeId, {
                        'Items_x0020_Redemend': item.Item_x0020_Code.Items_x0020_Redemend + item.RedeemQuantity
                    }).then(function (error) {
                        console.log('error', error);
                    });

                }

            }

        } else {
            if (num === 2) {
                if (confirm("You are trying to reject! " + item.Item_x0020_Code.Item_x0020_Code)) {
                    spcrud.update($http, vm.listName, item.ID, {
                        'Status': 'Rejected',
                        'Redemption_x0020_Approved_x0020_Id': vm.userDetails.data.d.PrincipalType,
                        'Redemption_x0020_Approved_x0020_0': new Date()
                    }).then(function (response) {
                        if (response.status === 204) {
                            vm.readPending();
                            vm.readApproved();
                        }
                    }, function (error) {
                        console.log('error', error);
                    });
                }

            }
        }

    };
}


//load
angular.module('redeemApprovalApp', []).controller('redeemApprovalCtl', spcrudCtl);