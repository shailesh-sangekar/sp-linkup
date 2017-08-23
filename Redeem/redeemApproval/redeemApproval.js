function redeemApprovalCtl($scope, $http, $timeout) {
    //default data
    var vm = $scope;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.listName = 'RnR Employee Redemptions';
    vm.loaded = false;
    vm.listNameProduct = 'RnR Product Catalog';
    vm.listEmployeeMaster = 'RnR Employee Master';
    empSelect = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/Employee_x0020_ID,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,Item_x0020_Code/Items_x0020_Redemend,Item_x0020_Code/Available_x0020_Quantity,*';
    empExpand = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/Employee_x0020_ID,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,Item_x0020_Code/Items_x0020_Redemend,Item_x0020_Code/Available_x0020_Quantity';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    Active = 'Active';
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
                // var myJSON = JSON.stringify(resp.data.d.results);
                vm.gridItemsPending = resp.data.d.results;
        }, function (error) {
            console.log('error', error);
        });
    };
    vm.readPending();
    $timeout(function () {
        vm.loaded = true;
    }, 500);

    vm.updateApproval = function (item, num) {
        empSelect = 'Status';
        Approved = 'Approved';
        Rejected = 'Rejected';
        Active = 'Active';
        IDFilter = '(Status eq \'' + Approved + '\' or Status eq \'' + Rejected + '\') and ID eq \'' + item.ID + '\'';
        vm.IDOptions = {
            select: empSelect,
            filter: IDFilter
        };

        if (num === 1) {
            spcrud.read($http, vm.listName, vm.IDOptions).then(function (resp) {
                if (resp.status === 200)
                    // var myJSON = JSON.stringify(resp.data.d.results);

                    if (resp.data.d.results.length <= 0) {
                        if (confirm("You are trying to approve! " + item.Item_x0020_Code.Item_x0020_Code)) {
                            spcrud.update($http, vm.listName, item.ID, {
                                'Status': 'Approved',
                                'Redemption_x0020_Approved_x0020_Id': vm.userDetails.data.d.Id,
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
                    } else {
                        var Status = resp.data.d.results[0].Status;
                        alert(" Item already " + Status);
                    }
            }, function (error) {
                console.log('error', error);
            });

        } else {
            if (num === 2) {
                var itemToEdit = item;
                if (confirm("You are trying to reject! ")) {
                    vm.toggleModalReject(itemToEdit);
                }
            }
        }



    };
    vm.toggleModalReject = function (itemToEdit) {
        vm.item = itemToEdit;
        vm.showModal = !vm.showModal;
    };
    vm.cancel = function () {
        vm.showModal = false;
    }
    vm.RejectFunction = function (item) {
        spcrud.read($http, vm.listName, vm.IDOptions).then(function (resp) {
            if (resp.status === 200)
                // var myJSON = JSON.stringify(resp.data.d.results);

                if (resp.data.d.results.length <= 0) {
                    if (item.Reject_x0020_Comment == null) {
                        alert("You need to specify a reason for Rejection!")
                    } else {
                        if (confirm("You are trying to reject! " + item.Item_x0020_Code.Item_x0020_Code)) {
                            selectID = 'ID,Redemend';
                            itemFilter = 'Emp_x0020_ID/Employee_x0020_ID eq \'' + item.Emp_x0020_ID.Employee_x0020_ID + '\'';
                            vm.empOptions = {
                                select: selectID,
                                filter: itemFilter
                            }
                            spcrud.read($http, vm.listEmployeeMaster, vm.empOptions).then(function (resp) {
                                if (resp.status === 200) {
                                    vm.Emp_x0020_CodeId = resp.data.d.results[0].ID;
                                    vm.Redemend = resp.data.d.results[0].Redemend;
                                    spcrud.update($http, vm.listName, item.ID, {
                                        'Status': 'Rejected',
                                        'Redemption_x0020_Approved_x0020_Id': vm.userDetails.data.d.Id,
                                        'Redemption_x0020_Approved_x0020_0': new Date(),
                                        'Reject_x0020_Comment': item.Reject_x0020_Comment
                                    }).then(function (response) {
                                        if (response.status === 204) {
                                            vm.readPending();
                                            vm.readApproved();
                                        }
                                    }, function (error) {
                                        console.log('error', error);
                                    });
                                    spcrud.update($http, vm.listNameProduct, item.Item_x0020_CodeId, {
                                        'Items_x0020_Redemend': item.Item_x0020_Code.Items_x0020_Redemend - item.RedeemQuantity
                                    }).then(function (error) {
                                        console.log('error', error);
                                    });
                                    var finalRedemend = vm.Redemend - (item.Item_x0020_Code.Points * item.RedeemQuantity);
                                    spcrud.update($http, vm.listEmployeeMaster, vm.Emp_x0020_CodeId, {
                                        'Redemend': finalRedemend
                                    }).then(function (error) {
                                        console.log('error', error);
                                    });
                                }

                            }, function (error) {
                                console.log('error', error);
                            });
                        }

                    }

                } else {
                    var Status = resp.data.d.results[0].Status;
                    alert(" Item already " + Status);
                    vm.showModal = false;
                }
        }, function (error) {
            console.log('error', error);
        });
        // }
    };
}

function modal() {
    return {
        template: '<div class="modal fade">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
            // '<h4 class="modal-title">{{ buttonClicked }} clicked!!</h4>' + 
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.visible, function (value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function () {
                scope.$apply(function () {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
};
//load
angular.module('redeemApprovalApp', []).controller('redeemApprovalCtl', redeemApprovalCtl).directive('modal', modal);