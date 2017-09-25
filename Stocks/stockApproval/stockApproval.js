//AngularJS controller to approve stockption request
// angular.module('stockApprovalApp', ['ui.bootstrap']);
// function stockApprovalCtl($scope, $http, $timeout, $dialog, $modal) {
function stockApprovalCtl($scope, $http, $timeout) {
    /// Add your stuff here
    var vm = $scope;
    vm.status = 'OK';
    vm.userDetails = '';
    vm.loaded = false;
    vm.Item_x0020_CodeId = '';
    vm.listName = 'RnR Product Catalog Approval';
    vm.listNameProduct = 'RnR Product Catalog';
    vm.rejectFlag = '';
    //empSelect = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,Item_x0020_Code/Items_x0020_Redemend,Item_x0020_Code/Available_x0020_Quantity,*';
    empSelect = 'Approved_x0020_By/Title,Item_x0020_Code/Item_x0020_Code,*';
    //empExpand = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,Item_x0020_Code/Items_x0020_Redemend,Item_x0020_Code/Available_x0020_Quantity';
    empExpand = 'Approved_x0020_By/Title,Item_x0020_Code/Item_x0020_Code';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    Active = 'Active';

    vm.itemID = '';
    vm.itemCatalogID = '';
    approvedFilter = '((Status eq \'' + Approved + '\' ) or ( Status eq \'' + Rejected + '\' )) and (Item_x0020_Status eq \'' + Active + '\')';
    pendingFilter = 'Status eq \'' + Pending + '\' and Item_x0020_Status eq \'' + Active + '\'';

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
    $timeout(function () {
        vm.loaded = true;
    }, 500);
    vm.saveRejectComment = function (comment) {
        if (vm.rejectFlag == '') {
            if (vm.itemID != '') {
                spcrud.update($http, vm.listName, vm.itemID, {
                    'Reject_x0020_Comment': comment
                }).then(function (response) {
                    alert("Comment Added");
                    vm.itemID = '';
                    vm.itemCatalogID = '';
                    comment = '';
                }, function (error) {
                    console.log('error', error);
                });
            }
            if (vm.itemCatalogID != '') {
                spcrud.update($http, vm.listNameProduct, vm.itemCatalogID, {
                    'Reject_x0020_Comment': comment
                }).then(function (response) {
                    vm.itemID = '';
                    vm.itemCatalogID = '';
                    comment = '';
                }, function (error) {
                    console.log('error', error);
                });
            }
        } else {
            alert("You have cancelled rejection!");
        }


    }

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
        // spcrud.read($http, vm.listName, vm.IDOptions).then(function (resp) {
        //     if (resp.status === 200)
        //         // if(resp.data.d.results.length!=0){}
        //         // var Status = resp.data.d.results[0].Status;
        //         if (resp.data.d.results.length == 0) {
        if (num === 1) {
            spcrud.read($http, vm.listName, vm.IDOptions).then(function (respID) {
                    if (respID.status === 200)
                        // if(resp.data.d.results.length!=0){}
                        // var Status = resp.data.d.results[0].Status;
                        if (respID.data.d.results.length <= 0) {

                            if (confirm("You are trying to approve! ")) {
                                // var sum = item.Items_x0020_Redemend + item.StockQuantity;
                                // var difference = item.Item_x0020_Code.Quantity - item.Item_x0020_Code.Items_x0020_Redemend;
                                // if (sum > difference) {
                                //     alert('We do not have those many items in stock!');
                                // } else {
                                // selectAll = '*';
                                // itemFilter = 'Item_x0020_Code eq \'' + item.Item_x0020_Code + '\'';
                                // vm.productOptions = {
                                //     select: selectAll,
                                //     filter: itemFilter
                                // }

                                // spcrud.read($http, vm.listNameProduct, vm.productOptions).then(function (resp) {

                                // if (resp.status === 200) {
                                // vm.Item_x0020_CodeId = resp.data.d.results[0].ID;
                                spcrud.update($http, vm.listName, item.ID, {
                                    'Status': 'Approved',
                                    'Approved_x0020_ById': vm.userDetails.data.d.Id,
                                    'Approved_x0020_Date': new Date(),
                                    'Quantity': item.Quantity + item.Updated_x0020_Quantity
                                }).then(function (response) {
                                    if (response.status === 204) {
                                        vm.readPending();
                                        vm.readApproved();
                                    }
                                }, function (error) {
                                    console.log('error', error);
                                });

                                spcrud.update($http, vm.listNameProduct, item.Item_x0020_CodeId, {
                                    'Status': 'Approved',
                                    'Approved_x0020_ById': vm.userDetails.data.d.Id,
                                    'Approved_x0020_Date': new Date(),
                                    'Quantity': item.Quantity + item.Updated_x0020_Quantity
                                }).then(function (error) {
                                    console.log('error', error);
                                });
                                // }

                                // }, function (error) {
                                //     console.log('error', error);
                                // });


                            }
                        } else {
                            var Status = resp.data.d.results[0].Status;
                            alert(" Item already " + Status);
                        }
                },

                function (error) {
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
        // } else {
        //     alert(" Item already " + Status);
        // }
        // }, function (error) {
        //     console.log('error', error);
        // });

    };
    vm.toggleModalReject = function (itemToEdit) {
        vm.item = itemToEdit;
        vm.showModal = !vm.showModal;
    };
    vm.cancel = function (item) {
        vm.showModal = false;
        item.Reject_x0020_Comment=null;
    }
    vm.toggleModal = function (btnClicked) {
        vm.buttonClicked = btnClicked;
        vm.showModal = !vm.showModal;
    };
    vm.RejectFunction = function (item) {
        empSelect = 'Status';
        Approved = 'Approved';
        Rejected = 'Rejected';
        Active = 'Active';
        IDFilter = '(Status eq \'' + Approved + '\' or Status eq \'' + Rejected + '\') and ID eq \'' + item.ID + '\'';
        vm.IDOptions = {
            select: empSelect,
            filter: IDFilter
        };
        spcrud.read($http, vm.listName, vm.IDOptions).then(function (resp) {
                    if (resp.status === 200)
                        // if(resp.data.d.results.length!=0){}
                        // var Status = resp.data.d.results[0].Status;
                        if (resp.data.d.results.length <= 0) {
                            if (item.Reject_x0020_Comment == null||item.Reject_x0020_Comment=="") {
                                alert("You need to specify a reason for Rejection!")
                            } else {
                                spcrud.update($http, vm.listName, item.ID, {
                                    'Status': 'Rejected',
                                    'Approved_x0020_ById': vm.userDetails.data.d.Id,
                                    'Approved_x0020_Date': new Date(),
                                    'Reject_x0020_Comment': item.Reject_x0020_Comment
                                    //'Quantity': item.Quantity + item.Updated_x0020_Quantity
                                }).then(function (response) {
                                    if (response.status === 204) {
                                        vm.readPending();
                                        vm.readApproved();
                                        vm.itemID = item.ID;
                                    }
                                }, function (error) {
                                    console.log('error', error);
                                });
                                spcrud.update($http, vm.listNameProduct, item.Item_x0020_CodeId, {
                                    'Status': 'Rejected',
                                    'Approved_x0020_ById': vm.userDetails.data.d.Id,
                                    'Approved_x0020_Date': new Date(),
                                    'Reject_x0020_Comment': item.Reject_x0020_Comment
                                    //'Quantity': item.Quantity + item.Updated_x0020_Quantity
                                }).then(function (response) {
                                    if (response.status === 204) {
                                        vm.itemCatalogID = item.Item_x0020_CodeId;
                                    }
                                }, function (error) {
                                    console.log('error', error);
                                });
                                vm.showModal = false;
                            }
                        }
                 else {
                     var Status = resp.data.d.results[0].Status;
                    alert(" Item already " + Status);
                    vm.showModal = false;
                    item=null;
                }
            },

            function (error) {
                console.log('error', error);
            });


    // } else {
    //     vm.rejectFlag = 'False';
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
angular.module('stockApprovalApp', []).controller('stockApprovalCtl', stockApprovalCtl).directive('modal', modal); //.controller('ModalInstanceCtrl', ModalInstanceCtrl); //controller('EditCtrl', EditCtrl);