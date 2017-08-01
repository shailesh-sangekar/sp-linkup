function stockManagementCtl($scope, $http) {
    var vm = $scope;
    vm.listName = 'RnR Product Catalog';
    vm.ImageList = 'RnR Product Images';
    vm.ItemDetails = [];
    vm.id = '';
    vm.IsVisible = false;
    vm.SaveButton = false;
    vm.AddButton = true;
    vm.isDisabledQuantity =false;
    // vm.Item='';
    // vm.Item.Name = '';

    vm.read = function () {
        spcrud.read($http, vm.listName).then(function (resp) {
            if (resp.status === 200)
                vm.ItemDetails = resp.data.d.results;
            var ItemCount = resp.data.d.results.length - 1;
            vm.id = resp.data.d.results[ItemCount].ID + 1;
            vm.appendimg();
        }, function (error) {
            console.log('error', error);
        });

    };
    vm.read();
    // Add Item
    vm.AddProduct = function (resp) {
        var itemId = resp.ID;
        //var letters = /^[A-Za-z]+$/; 
        if (resp.Item_x0020_Name == undefined) {
            alert("Enter Item Name");
        }
        
        //else if (resp.Item_x0020_Name != letters)
           // {
             //   alert("Enter Valid Item Name");
           // }
       else if (resp.Points == undefined)
        {
            alert("Enter Points");
        }
    else if (resp.Quantity == undefined)
        {
            alert("Enter Quanity");
        }
        else {

            spcrud.create($http, vm.listName, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_Code': 'ESPP77100' + vm.id, 'Points': resp.Points, 'Quantity': resp.Quantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description }
            ).then(function (resp) {
                alert("Item Added Successfully");
                vm.itemId = resp.data.d.ID;
                vm.read();
                vm.claer();

            });
        }

    }

    vm.claer = function (){
        vm.Item = null;
    }
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

    // Update Item
    vm.UpdateItem = function (resp) {
        if (resp.Item_x0020_Name == undefined) {
            alert("Enter Item Name");
        }
      
       else if (resp.Points == undefined)
        {
            alert("Enter Points");
        }
    else if (resp.Quantity == undefined)
        {
            alert("Enter Quanity");
        }
       else  if (resp.ID != null) {
          
           //Item.TotalQuantity= Item.Quantity + Item.NewQuantity
            spcrud.update($http, vm.listName, resp.ID, { 'Item_x0020_Code': 'ESPP77100', 'Points': resp.Points, 'Quantity':resp.TotalQuantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description }
            ).then(function (resp) {
                alert("Item Updated Successfully");
                vm.read();
                vm.claer();
                vm.SaveButton = vm.SaveButton ?false: false;
                vm.AddButton = vm.AddButton ?false: true;
            });
        } else {
            alert("Cannot Update Item");
        }
    }

//   vm.TotalQuantity = function() {
   
//         vm.Item.TotalQuantity = Item.Quantity + Item.NewQuantity;
//     }


    vm.OnEdit = function (resp) {
        vm.Item = resp;
        vm.SaveButton = vm.SaveButton ?false: true;
        vm.IsVisible = vm.IsVisible ? false : true;
         vm.AddButton = vm.AddButton ?false: false;
         vm.isDisabledQuantity =true;

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
