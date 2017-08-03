function stockManagementCtl($scope, $http) {
    var vm = $scope;
    vm.RnRProductCatalog = 'RnR Product Catalog';
    vm.ImageList = 'RnR Product Images';
    vm.ApprovalList = 'RnR Product Catalog Approval';
    vm.ItemDetails = [];
    vm.CheckItems = [];
    vm.id = '';
    vm.flag='';
    vm.IsVisible = false;
    vm.SaveButton = false;
    vm.AddButton = true;
    vm.ClearButton = true;
    vm.ClearEditButton = false;
    vm.checkID = '';
    vm.isDisabledQuantity = false;
    vm.isTotalDisabledQuantity = true;
    itemSelect = 'Item_x0020_Code/Item_x0020_Code,*';
    itemExpand = 'Item_x0020_Code/Item_x0020_Code';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    pendingFilter = 'Status eq \'' + Pending + '\' or Status eq \'' + Rejected + '\'';
    approvedFilter = 'Status eq \'' + Approved + '\'';
    pendingCheckFilter = 'Status eq \'' + Pending + '\' and ID eq \'' + vm.checkID + '\'';
    // Tabs
    $(".nav-tabs a").click(function () {
        $(this).tab('show');
    });
    //End
    vm.pendingOptions = {
        select: itemSelect,
        expand: itemExpand,
        filter: pendingFilter
    };
    vm.approvedOptions = {
        filter: approvedFilter
    };

    vm.pendingCheckOptions = {
        select: '*',
        filter: pendingCheckFilter
    };

    //Get RnR Product Catalog Items
    vm.read = function () {
        spcrud.read($http, vm.RnRProductCatalog, vm.approvedOptions).then(function (resp) {
            if (resp.status === 200)
                vm.ItemDetails = resp.data.d.results;
            var ItemCount = resp.data.d.results.length - 1;
            if (resp.data.d.results.length == 0) {
                vm.id = 1;
            }
            else {
                vm.id = resp.data.d.results[ItemCount].ID + 1;
            }
            vm.appendimg();

        }, function (error) {
            //console.log('error', error);
        });
    };
    vm.read();


    vm.readItem = function () {
        spcrud.read($http, vm.ApprovalList, vm.pendingCheckOptions).then(function (resp) {
            if (resp.status === 200)
                vm.CheckItems = resp.data.d.results;
            // var ItemCount = resp.data.d.results.length - 1;
            // if (resp.data.d.results.length == 0) {
            //     vm.id = 1;
            // }
            // else {
            //     vm.id = resp.data.d.results[ItemCount].ID + 1;
            // }
            // vm.appendimg();
            if (vm.CheckItems.length > 0) {
                alert('Item already in pending state!');
                
            }else{
                
                // spcrud.create($http, vm.ApprovalList, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_CodeId': resp.ID, 'Points': resp.Points, 'Quantity': resp.Updated_x0020_Quantity, 'Updated_x0020_Quantity': resp.NewQuantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description }
                // ).then(function (resp) {

                //     alert("Product Updated Successfully! And sent for approval.");
                //     vm.read();
                //     vm.claer();
                //     vm.SaveButton = vm.SaveButton ? false : false;
                //     vm.AddButton = vm.AddButton ? false : true;
                // });
                vm.flag=1;
            }

        }, function (error) {
            //console.log('error', error);
        });
    };
    vm.read();


    // Get RnR Product Catalog Approval(only pending) Items
    vm.readList = function () {
        spcrud.read($http, vm.ApprovalList, vm.pendingOptions).then(function (resp) {
            if (resp.status === 200)
                vm.ApprovalItemDetails = resp.data.d.results;
            var ItemCount = resp.data.d.results.length - 1;
            if (resp.data.d.results.length == 0) {
                vm.id = 1;
            }
            else {
                vm.id = resp.data.d.results[ItemCount].ID + 1;
            }
            vm.appendimg();
        }, function (error) {
        });
    };
    vm.readList();
    // vm.Validator = function (resp) {
    //     if (Item.NewQuantity <=  0) {
    //         alert("Enter Valid Quantity");
    //     }
    // }
    // Add New Item to RnR product catalog list
    vm.AddProduct = function (resp) {
        var itemId = resp.ID;
        if (resp.Item_x0020_Name == undefined) {
            alert("Enter Product Name");
        }
        else if (resp.Points == undefined) {
            alert("Enter Points");
        }
        else if (resp.Quantity == undefined) {
            alert("Enter Quanity");
        }
        else {

            spcrud.create($http, vm.RnRProductCatalog, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_Code': 'ESPP77100' + vm.id, 'Points': resp.Points, 'Quantity': 0, 'Updated_x0020_Quantity': resp.Quantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description }
            ).then(function (resp) {
                vm.itemId = resp.data.d.ID;
                spcrud.create($http, vm.ApprovalList, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_CodeId': vm.itemId, 'Points': resp.data.d.Points, 'Quantity': 0, 'Updated_x0020_Quantity': resp.data.d.Updated_x0020_Quantity, 'Item_x0020_Name': resp.data.d.Item_x0020_Name, 'Item_x0020_Description': resp.data.d.Item_x0020_Description }
                ).then(function (resp) {
                    alert("Product Added Successfully! And sent for Approval");

                    vm.readList();
                    vm.claer();
                });
            });
        }
    }

    vm.claer = function () {
        vm.Item = null;
        vm.SaveButton = vm.SaveButton ? false : false;
        vm.IsVisible = vm.IsVisible ? false : false;
        // vm.AddButton = vm.AddButton ? false : true;
    }

    vm.claerEdit = function () {

        vm.Item = null;
        vm.AddButton = vm.AddButton ? false : true;
        vm.SaveButton = vm.SaveButton ? false : false;
        vm.IsVisible = vm.IsVisible ? false : true;

    }
    // Get Image from RnR Product Images list
    vm.setFiles = function (element) {
        vm.$apply(function (vm) {
            // console.log('files:', element.files);
            // Turn the FileList object into an Array
            var reader = new FileReader();
            var a = reader.readAsBinaryString(element.files[0]);
            vm.files = []
            for (var i = 0; i < element.files.length; i++) {
                vm.files.push(element.files[i])
            }
            var fd = new FormData()
            for (var i in vm.files) {
                fd.append("uploadedFile", vm.files[i])
            }
            spcrud.uploadFile($http, vm.ImageList, element.files[0].name, fd).then(function (resp) {
                alert(resp.status);
                vm.itemId = resp.data.d.ID;
                vm.read();
            });
        });
    };
    // Update Item to RnR Product Catalog Approval list
    vm.UpdateItem = function (resp) {
        vm.checkID = resp.ID;
        if (resp.Item_x0020_Name == undefined) {
            alert("Enter Item Name");
        }
        else if (resp.Points == undefined) {
            alert("Enter Points");
        }
        else if (resp.NewQuantity == undefined) {
            alert("Enter Quanity");
        }
        else if (resp.ID != null) {
            
            //   spcrud.create($http, vm.ApprovalList, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_Code': 'ESPP77100' + vm.id, 'Points': resp.Points, 'Quantity': resp.Quantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description }
            // ).then(function (resp) {

            // });
            vm.readItem();
            if(vm.flag!=''){
                spcrud.create($http, vm.ApprovalList, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_CodeId': resp.ID, 'Points': resp.Points,'Quantity':resp.Quantity, 'Updated_x0020_Quantity': resp.Updated_x0020_Quantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description }
            ).then(function (resp) {

                alert("Product Updated Successfully! And sent for approval.");
                vm.read();
                vm.claer();
                vm.SaveButton = vm.SaveButton ? false : false;
                vm.AddButton = vm.AddButton ? false : true;
            });
            }
            
        } else {
            alert("Cannot Update Item");
        }
    }
    vm.OnEdit = function (resp) {
        vm.Item = resp;
        vm.SaveButton = vm.SaveButton ? false : true;
        vm.IsVisible = vm.IsVisible ? false : true;
        vm.AddButton = vm.AddButton ? false : false;
        vm.isDisabledQuantity = true;
        vm.ClearButton = false;
        vm.ClearEditButton = true;
    }
    vm.read();
    vm.appendimg = function () {
        vm.ItemDetails.forEach(function (product) {
            var id = product.Item_x0020_Code;
            nameFilter = 'Item_x0020_Code eq \'' + id + '\'';
            var Options = { filter: nameFilter };
            spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
                if (response.status === 200)
                    vm.Url = response.data.d.results;
                vm.ItemDetails.find(f => f.Item_x0020_Code == id).Url = response.data.d.results;
            }, function (error) {
                console.log('error', error);
            });

        }, this);
        console.log(vm.ItemDetails);
    }
}
angular.module('stockManagemenApp', []).controller('stockManagementCtl', stockManagementCtl);