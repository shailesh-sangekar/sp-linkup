function redeemCtl($scope, $http) {
    var vm = $scope;
    vm.listName = 'RnR Product Catalog';
    vm.Redeemlist = 'RnR Employee Redemptions';
    vm.EmployeeList = 'Employee Personal Details Master';
    vm.EmployeeMasterList = 'RnR Employee Master';
    vm.ImageList = 'RnR Product Images';
    empSelect = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity,*';
    empExpand = 'Redemption_x0020_Approved_x0020_/Title,Emp_x0020_ID/First_x0020_Name,Emp_x0020_ID/Last_x0020_Name,Item_x0020_Code/Item_x0020_Code,Item_x0020_Code/Item_x0020_Name,Item_x0020_Code/Points,Item_x0020_Code/Quantity';
    vm.quantity = 0;
    vm.max = 2;
    vm.EmpCodeID = '';
    vm.productDetails = [];
    vm.orderByvalue = 'Latest';
    var orderbyPoints = 'Created asc';
    var Approved = 'Approved';
    var approvedFilter = 'Status eq \'' + Approved + '\' ';
    vm.orderFilter = { select: '*', orderby: orderbyPoints, filter: approvedFilter };
    vm.asc = false;
    vm.Sort = {};
    vm.Sort.valueId = "Created desc";
    vm.Sort.values = [{
        id: "Created desc",
        name: "Latest"
    }, {
        id: "Points desc",
        name: "Points"
    }];

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
            vm.read();
            vm.reademplist();
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.getUserName();

    vm.onChange = function (value) {
        var orderbyPoints = value;
        vm.orderFilter = { select: '*', orderby: orderbyPoints, filter: approvedFilter };
        vm.read();
        vm.asc = true;
    }
    vm.onChangeOrder = function (value) {
        if (vm.asc == false) {
            if (value == 'Created desc') {
                var orderbyPoints = 'Created desc';
                vm.asc = true;
            }
            else if (value == 'Points desc') {
                var orderbyPoints = 'Points desc';
                vm.asc = true;
            }
            else {
                var orderbyPoints = 'Created desc';
                vm.asc = true;
            }
        }
        else {
            if (value == 'Created desc') {
                var orderbyPoints = 'Created asc';
                vm.asc = false;
            }
            else if (value == 'Points desc') {
                var orderbyPoints = 'Points asc';
                vm.asc = false;
            }
            else {
                var orderbyPoints = 'Created asc';
                vm.asc = false;
            }
        }
        vm.orderFilter = { select: '*', orderby: orderbyPoints, filter: approvedFilter };
        vm.read();
    }

    vm.read = function () {
        spcrud.read($http, vm.listName, vm.orderFilter).then(function (resp) {
            if (resp.status === 200)
                vm.productDetails = resp.data.d.results;
            vm.productDetails.forEach(f => f.defaultQuantity = 0);
            vm.orderByvalue = 'Latest';
            vm.appendimg();
        }, function (error) {
            console.log('error', error);
        });
    };
    vm.appendimg = function () {
        vm.productDetails.forEach(function (product) {
            var id = product.Item_x0020_Code;
            nameFilter = 'Item_x0020_Code eq \'' + id + '\'';
            var Options = { filter: nameFilter };
            spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
                if (response.status === 200)
                    vm.Url = response.data.d.results;
                vm.productDetails.find(f => f.Item_x0020_Code == id).Url = response.data.d.results;
            }, function (error) {
                console.log('error', error);
            });

        }, this);
    }



    vm.reademplist = function () {
        spcrud.read($http, vm.EmployeeList, vm.nameOptions).then(function (response) {
            if (response.status === 200)
                vm.empDetails = response.data.d.results;
            var userId = vm.empDetails[0].ID;
            usernameFilter = '(Emp_x0020_ID eq \'' + userId + '\')';
            vm.nameFilterOptions = { filter: usernameFilter };
            vm.readlist();
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readempMasterlist = function () {
        vm.totalavailablepts = 0;
        spcrud.read($http, vm.EmployeeMasterList, vm.nameFilterOptions).then(function (response) {
            if (response.status === 200)
                vm.empMasterDetails = response.data.d.results;
            vm.empMasterDetails[0].Balance = parseFloat(vm.empMasterDetails[0].Balance);
            vm.totalavailablepts = vm.empMasterDetails[0].Balance - vm.totalUsedPts;
        }, function (error) {
            console.log('error', error);
        });
    }

    vm.readlist = function () {
        var status = "Pending";
        var userId = vm.empDetails[0].ID;
        var redeemFilter = '(Emp_x0020_ID/ID eq ' + '\'' + userId + '\') and (Status eq \'' + status + '\')';
        vm.redeemOptions = {
            select: empSelect,
            expand: empExpand,
            filter: redeemFilter
        };
        spcrud.read($http, vm.Redeemlist, vm.redeemOptions).then(function (response) {
            if (response.status === 200)
                vm.redeemlistemp = response.data.d.results;
            vm.availablepts = 0;
            vm.totalUsedPts = 0;
            vm.redeemlistemp.forEach(function (item) {
                vm.availablepts = item.Item_x0020_Code.Points * item.RedeemQuantity;
                vm.totalUsedPts = vm.availablepts + vm.totalUsedPts;

            }, this);
            vm.readempMasterlist();
        }, function (error) {
            console.log('error', error);
        });
    }

    vm.RedeemProduct = function (resp) {
        var date = new Date();
        var redeemdate = moment.parseZone(date).utc().format();
        var itemId = resp.ID;
        var quantity = resp.defaultQuantity;
        var productPoints = resp.Points;
        var redeeemPoints = quantity * productPoints;
        var userId = vm.empDetails[0].ID;
        vm.id = vm.empDetails[0].Employee_x0020_ID;
        selectID = '*';
        itemFilter = 'Emp_x0020_ID/Employee_x0020_ID eq \'' + vm.id + '\'';
        vm.empOptions = {
            select: selectID,
            filter: itemFilter
        }
        spcrud.read($http, vm.EmployeeMasterList, vm.empOptions).then(function (resp) {
            if (resp.status === 200) {
                vm.EmpCodeID = resp.data.d.results[0].ID;
                vm.updateRedeempoints = resp.data.d.results[0].Redemend;
                vm.newupdateRedem = redeeemPoints + vm.updateRedeempoints;
                idFilter = '(ID eq \'' + itemId + '\')';
                vm.idOptions = { filter: idFilter };
                if (vm.newupdateRedem <= vm.empMasterDetails[0].Balance) {
                    spcrud.read($http, vm.listName, vm.idOptions).then(function (resp) {
                        if (resp.status === 200) {
                            vm.product = resp.data.d.results;
                            if (quantity <= vm.product[0].Balance) {
                                spcrud.create($http, vm.Redeemlist, { 'Title': 'redeem adding', 'Status': 'Pending', 'Redemption_x0020_Date': redeemdate, 'Item_x0020_CodeId': itemId, 'Emp_x0020_IDId': userId, 'RedeemQuantity': quantity }
                                ).then(function (resp) {
                                vm.add=vm.product[0].Items_x0020_Redemend + quantity;
                                // spcrud.update($http, vm.listName,vm.product[0].ID, {
                                //     'Items_x0020_Redemend': vm.add
                                // }).then(function (error) {
                                //     console.log(' we have error', error);
                                // });
                                spcrud.update($http, vm.listName, vm.product[0].ID, {
                                    'Items_x0020_Redemend': vm.add
                                }).then(function (resp) {
                                    alert("Thank you, successful.");
                                }, function (error) {
                                    console.log('we have error', error);
                                });


                                spcrud.update($http, vm.EmployeeMasterList, vm.EmpCodeID, {
                                    'Redemend': vm.newupdateRedem
                                }).then(function (resp) {
                                    alert("Thank you, Your redeem is successful.");
                                    var vm = $scope;
                                    vm.getUserName();
                                }, function (error) {
                                    console.log('error', error);
                                });
                            });
                        }
                        else {
                            vm.product[0].Balance = parseFloat(vm.product[0].Balance);
                            alert("Selected Products available stock is " + vm.product[0].Balance + " You cannot request more than available quantity.");
                        }
                    }
                    }, function (error) {
                        console.log('error', error);
                    });
                }
                else {
                    alert("Sorry, Your balance is insufficient.");
                }
            }
        });


    }
    vm.add = function (id, defaultQuantity) {
        if (defaultQuantity < vm.productDetails[id].Balance) {
            vm.productDetails[id].defaultQuantity = defaultQuantity + 1;
        }

    };


    vm.minus = function (id, defaultQuantity) {
        if (defaultQuantity > 0) {
            vm.productDetails[id].defaultQuantity = defaultQuantity - 1;
        }
        else {
            // alert("Opps, sorry");
        }

    };

}
//load
angular.module('redeemApp', []).controller('redeemCtl', redeemCtl);