//AngularJS controller to approve redeemption request
function redeemCtl($scope, $http) {
    var vm = $scope;
    vm.listName = 'RnR Product Catalog';
    vm.Redeemlist = 'RnR Employee Redemptions';
    vm.EmployeeList = 'Employee Personal Details Master';
    vm.EmployeeMasterList = 'RnR Employee Master';
    vm.ImageList = 'RnR Product Images';
    vm.quantity = 0;
    vm.max = 2;
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
    vm.onChange = function (value) {
        var orderbyPoints = value;
        vm.orderFilter = { select: '*', orderby: orderbyPoints, filter: approvedFilter };
        vm.read();
        vm.asc = true;
    }
    vm.onChangeOrder = function (value) {
        if(vm.asc == false){
            //  var orderbyPoints = 'Points desc';
            //  vm.asc = true;
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
        else{
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
        console.log(vm.productDetails);
    }

    vm.getUserName = function () {
        spcrud.getCurrentUser($http).then(function (response) {
            if (response.status === 200)
                vm.userDetails = response.data.d;
            var userName = response.data.d.Id;
            //nameFilter = '(First_x0020_Name eq \'' + FirstName + '\') and (Last_x0020_Name eq \'' + LastName + '\')';
            var empSelect = '*';
            var nameFilter = 'Employee/ID eq ' +'\''+ userName+'\'';
            vm.nameOptions = {
                select: empSelect ,
                filter: nameFilter
            };
            vm.reademplist();
        }, function (error) {
            console.log('error', error);
        });
    }

    vm.reademplist = function () {
        spcrud.read($http, vm.EmployeeList, vm.nameOptions).then(function (response) {
            if (response.status === 200)
                vm.empDetails = response.data.d.results;
            var userId = vm.empDetails[0].ID;
            usernameFilter = '(Emp_x0020_ID eq \'' + userId + '\')';
            vm.nameFilterOptions = { filter: usernameFilter };
            vm.readempMasterlist();
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readempMasterlist = function () {
        spcrud.read($http, vm.EmployeeMasterList, vm.nameFilterOptions).then(function (response) {
            if (response.status === 200)
                vm.empMasterDetails = response.data.d.results;
        }, function (error) {
            console.log('error', error);
        });
    }

    vm.readlist = function () {
        spcrud.read($http, vm.Redeemlist).then(function (response) {
            if (response.status === 200)
                vm.redeemlistemp = response.data.d.results;
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.readImglist = function () {
        spcrud.read($http, vm.ImageList).then(function (response) {
            if (response.status === 200)
                vm.imgList = response.data.d.results;
        }, function (error) {
            console.log('error', error);
        });
    }
    vm.read();
    vm.getUserName();
    vm.readlist();
    vm.readImglist();

    vm.RedeemProduct = function (resp) {
        var date = new Date();
        var redeemdate = moment.parseZone(date).utc().format();
        var itemId = resp.ID;
        var quantity = resp.defaultQuantity;
        var productPoints =resp.Points;
        var redeeemPoints= quantity * productPoints;
        var userId = vm.empDetails[0].ID;
        idFilter = '(ID eq \'' + itemId + '\')';
        vm.idOptions = { filter: idFilter };
        if(redeeemPoints < vm.empMasterDetails[0].Balance){
            spcrud.read($http, vm.listName, vm.idOptions).then(function (resp) {
            if (resp.status === 200) {
                vm.product = resp.data.d.results;
                if (quantity < vm.product[0].Balance) {
                    spcrud.create($http, vm.Redeemlist, { 'Title': 'redeem adding', 'Status': 'Pending', 'Redemption_x0020_Date': redeemdate, 'Item_x0020_CodeId': itemId, 'Emp_x0020_IDId': userId, 'RedeemQuantity': quantity }
                    ).then(function (resp) {
                        alert("Thank you, Your redeem is successful.");
                    });
                }
                else {
                    alert("Selected Products available stock is " + vm.product[0].Balance + " You cannot request more than available quantity.");
                }

            }
        }, function (error) {
            console.log('error', error);
        });
        }
        else{
            alert("Sorry, Your balance is insufficient.");
        }
  
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