function stockManagementCtl($scope, $http) {
    var vm = $scope;
    vm.RnRProductCatalog = 'RnR Product Catalog';
    vm.ImageList = 'RnR Product Images';
    vm.ApprovalList = 'RnR Product Catalog Approval';
    vm.ItemDetails = [];
    vm.CheckItems = '';
    vm.id = '';
    vm.flag = '';
    vm.IsVisible = false;
    vm.IsVisibleWhenReduced =false;
    vm.SaveButton = false;
    vm.AddButton = true;
    vm.ClearButton = true;
    vm.ClearEditButton = false;
    vm.checkID = '';
    vm.isDisabledQuantity = false;
    vm.isTotalDisabledQuantity = true;
    itemSelect = 'Item_x0020_Code/Item_x0020_Code,*';
    itemExpand = 'Item_x0020_Code/Item_x0020_Code';
    Active = 'Active';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    orderbyModified = 'Modified desc';
    pendingFilter = '((Status eq \'' + Pending + '\' ) or ( Status eq \'' + Rejected + '\' )) and (Item_x0020_Status eq \'' + Active + '\')';
    approvedFilter = 'Status eq \'' + Approved + '\' and Item_x0020_Status eq \'' + Active + '\'';
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
    // Read List RnR Product catalog (only Approved)
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
        });
    };
    vm.read();
    // Read List RnR Product catalog approval (Pending and rejected)
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
             vm.appendimgtoapproval();
        }, function (error) {
        });
    };
    vm.readList();
    //Calculate total Quantity
    vm.TotalQuantity = function (resp){
            vm.Item.TotalQuantity = vm.Item.NewQuantity + vm.Item.Quantity;
            if(vm.Item.NewQuantity < 0)
                {
                        vm.IsVisibleWhenReduced =true; 
                }
                    else
                        vm.IsVisibleWhenReduced =false; 
                        vm.Item.Comments = null;
    }
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
            
            
            spcrud.create($http, vm.RnRProductCatalog, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_Code': 'ESPP77100' + vm.id, 'Points': resp.Points, 'Quantity': 0, 'Updated_x0020_Quantity': resp.Quantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description, 'Item_x0020_Status': 'Active' }
            ).then(function (resp) {
                vm.itemId = resp.data.d.ID;
                spcrud.create($http, vm.ApprovalList, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_CodeId': vm.itemId, 'Points': resp.data.d.Points, 'Quantity': 0, 'Updated_x0020_Quantity': resp.data.d.Updated_x0020_Quantity, 'Item_x0020_Name': resp.data.d.Item_x0020_Name, 'Item_x0020_Description': resp.data.d.Item_x0020_Description, 'Item_x0020_Status': 'Active' }
                ).then(function (response) {
                    vm.uploadFile();
                   //  spcrud.read($http, vm.ImageList).then(function (ImageResponse) {
                      //   vm.ImageId = ImageResponse.data.d.Results[0].ID;
                  //spcrud.update($http, vm.ImageList, vm.ImageId, { 'Item_x0020_CodeId': vm.itemId}
                        //).then(function (resp) {  
                    alert("Product Added Successfully! And sent for Approval");

                    vm.readList();
                    
                    vm.claer();
                });
                });
           //  });
           // });
        }
    }

/*------------------------------------------------------------ Image code ----------------------------------*/


vm.uploadFile= function() {
 var deferred = $.Deferred();
    // Define the folder path for this example.
    var serverRelativeUrlToFolder = '/RnR Product Images';    //Ex: '/sites/<Site>/<SubSite>/<LibraryName>';
    // Get test values from the file input and text input page controls.
    var fileInput = jQuery('#FileUpload');    
    // Get the server URL.
    var serverUrl = _spPageContextInfo.webAbsoluteUrl;
// Below Code call all files in a loop, Initiate method calls using jQuery promises.
    // Get the local file as an array buffer.
 (function Tasks(i,callback)
 {
  if(i<fileInput[0].files.length)
  {
   var success = ProcessFiles(i);
   success.done(function(){Tasks((i+1),callback);});
  }
  else
  {
   callback();
  }
 })(0,function(){deferred.resolve();});
 
//Below function call all the functions (GetFileBuffer,UploadFile,GettheLibraryItem,UpdatingTheItemColumns)
 function ProcessFiles(ind)
 {
  var deferred = $.Deferred();
  var getFile = getFileBuffer(ind);
  
  getFile.done(function (arrayBuffer) {
   
   // Add the file to the SharePoint folder.
   var addFile = addFileToFolder(arrayBuffer,ind);
   addFile.done(function (file, status, xhr) {
    
    // Get the list item that corresponds to the uploaded file.
    var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
    getItem.done(function (listItem, status, xhr) { 
          spcrud.update($http, vm.ImageList, listItem.d.Id, { 'Item_x0020_CodeId': vm.itemId }

                        ).then(function (resp) {      
     
     // Change the display name and title of the list item.
    // var changeItem = updateListItem(listItem.d.__metadata,ind , vm.itemId);
    // changeItem.done(function (data, status, xhr) {      
      //alert("File  uploaded");
     // deferred.resolve();
     });
   //  changeItem.fail(onError);
    });
    getItem.fail(onError);
   });
   addFile.fail(onError);
  });
  getFile.fail(onError);
  return deferred.promise();
 }
 
 
    // Below code Get the local file as an array buffer.
    function getFileBuffer(ind) {
        var deferred = jQuery.Deferred();
        var reader = new FileReader();
        reader.onloadend = function (e) {
            deferred.resolve(e.target.result);
  }
        reader.onerror = function (e) {
            deferred.reject(e.target.error);
  }
        reader.readAsArrayBuffer(fileInput[0].files[ind]);
        return deferred.promise();
 }
 

// Below code Add the file to the file collection in the Shared Documents folder.
    function addFileToFolder(arrayBuffer,ind) {
  
        // Get the file name from the file input control on the page.        
  
  var fileName = fileInput[0].files[ind].name; 
  
        // Construct the endpoint.
        var fileCollectionEndpoint = String.format(
  "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
  "/add(overwrite=true, url='{2}')",
  serverUrl, serverRelativeUrlToFolder, fileName);
  
        // Send the request and return the response.
        // This call returns the SharePoint file.
        return jQuery.ajax({
            url: fileCollectionEndpoint,
            type: "POST",
            data: arrayBuffer,
            processData: false,
            headers: {
                "accept": "application/json;odata=verbose",
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
    "content-type": "application/json;odata=verbose"
                //"content-length": arrayBuffer.byteLength
   }
  });
 }
 // Below code Get the list item that corresponds to the file by calling the file's ListItemAllFields property.
    function getListItem(fileListItemUri) {
        // Send the request and return the response.
        return jQuery.ajax({
            url: fileListItemUri,
            type: "GET",
            headers: { "accept": "application/json;odata=verbose" }
  });
 }
 

// Below code Update the display name and title of the list item.
    function updateListItem(itemMetadata,ind,ItemCOde) {
  //Adding ID with file name here 
 // var newName =  ID.toString()+'-'+fileInput[0].files[ind].name;
        // Define the list item changes. Use the FileLeafRef property to change the display name. 
        // For simplicity, also use the name as the title. 
        // The example gets the list item type from the item's metadata, but you can also get it from the
        // ListItemEntityTypeFullName property of the list.
        var body = String.format("{{'__metadata':{{'type':'{0}'}},'Item_x0020_CodeId':{1}}}",
  itemMetadata.type ,ItemCOde );
  
        // Send the request and return the promise.
        // This call does not return response content from the server.
        return jQuery.ajax({
            url: itemMetadata.uri,
            type: "POST",
            data: body,
            headers: {
                "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                "content-type": "application/json;odata=verbose",
                //"content-length": body.length,
                "IF-MATCH": itemMetadata.etag,
                "X-HTTP-Method": "MERGE"
   }
  });
 }
 return deferred.promise();
}

//Below code for Display error messages. 
function onError(error) {
    //alert(error.responseText);
}


/*---------------------------------------------------------------------------------------------------------- */


    vm.claer = function () {
        vm.Item = null;
        vm.Item.Image = null;
        vm.SaveButton = vm.SaveButton ? false : false;
        vm.IsVisible = vm.IsVisible ? false : false;
        vm.AddButton = vm.AddButton ? true : true;
    }
    vm.claerEdit = function () {
        vm.Item = null;
        vm.AddButton = vm.AddButton ? false : true;
        vm.SaveButton = vm.SaveButton ? false : false;
        vm.IsVisible = vm.IsVisible ? false : true;
        vm.isDisabledQuantity = false;
    }
    // // Get Image from RnR Product Images list
    // vm.setFiles = function (element) {
    //     vm.$apply(function (vm) {
            
    //         // Turn the FileList object into an Array
    //         var reader = new FileReader();
    //         var a = reader.readAsBinaryString(element.files[0]);
    //         vm.files = []
    //         for (var i = 0; i < element.files.length; i++) {
    //             vm.files.push(element.files[i])
    //         }
    //         var fd = new FormData()
    //         for (var i in vm.files) {
    //             fd.append("uploadedFile", vm.files[i])
    //         }
    //         spcrud.uploadFile_new($http, vm.ImageList, element.files[0]).then(function (resp) {
    //             alert(resp.status);
    //             vm.itemId = resp.data.d.ID;
    //             vm.read();
         
    //         });
    //     });
    // };
       vm.OnEdit = function (resp) {
           filterListByItemCode = 'Item_x0020_Code/Item_x0020_Code eq \'' + resp.Item_x0020_Code + '\'';
        vm.filterByItemCode = {
            select: '*',
            filter: filterListByItemCode,
            orderby: orderbyModified
            };
             spcrud.read($http, vm.ApprovalList, vm.filterByItemCode).then(function (response) {
                if (response.status === 200) {
                    vm.CheckItems = response.data.d.results[0].Status;
                }
                if (vm.CheckItems == 'Pending') {
                    alert('Cannot Update Item ,It is already in pending state!');
                }
        else {
            vm.Item = resp;
            vm.SaveButton = vm.SaveButton ? true : true;
            vm.IsVisible = vm.IsVisible ? false : true;
            vm.AddButton = vm.AddButton ? false : false;
            vm.isDisabledQuantity = true;
            vm.ClearButton = false;
            vm.ClearEditButton = true;
        }
      });
    }

    vm.read();
    // Update Item to RnR Product Catalog Approval list
    vm.UpdateItem = function (resp) {
        filterListByItemCode = 'Item_x0020_Code/Item_x0020_Code eq \'' + resp.Item_x0020_Code + '\'';
        vm.filterByItemCode = {
            select: '*',
            filter: filterListByItemCode,
            orderby: orderbyModified
        };
        if (resp.Item_x0020_Name == undefined) {
            alert("Enter Item Name");
        }
        else if (resp.Points == undefined) {
            alert("Enter Points");
        }
        else if (resp.ID != null) {
            spcrud.read($http, vm.ApprovalList, vm.filterByItemCode).then(function (response) {
                if (response.status === 200) {
                    vm.CheckItems = response.data.d.results[0].Status;
                }
                if (vm.CheckItems == 'Pending') {
                    alert('Cannot Update Item ,It is already in pending state!');
                    vm.claerEdit();

                }
                else {
                vm.flag = 1;
                    if (vm.flag != '') {
                        spcrud.create($http, vm.ApprovalList, { 'Title': 'Item Adding', 'Status': 'Pending', 'Item_x0020_CodeId': resp.ID, 'Points': resp.Points, 'Quantity': resp.Quantity, 'Updated_x0020_Quantity': resp.NewQuantity, 'Item_x0020_Name': resp.Item_x0020_Name, 'Item_x0020_Description': resp.Item_x0020_Description , 'Comments':resp.Comments}

                        ).then(function (createresp) {
                          spcrud.update($http, vm.RnRProductCatalog, resp.ID, { 'Comments':resp.Comments }

                        ).then(function (resp) {  

                            alert("Product Updated Successfully! And sent for approval.");
                            vm.read();
                            vm.claer();
                            vm.SaveButton = vm.SaveButton ? false : false;
                            vm.AddButton = vm.AddButton ? true : true;
                            vm.isDisabledQuantity = false;
                            vm.IsVisibleWhenReduced =false;
                            vm.read();
                            vm.readList();
                        });
                        });
                    }
                }
            }, function (error) {

            });

        } else {
            alert("Cannot Update Item");
        }
    }
    // Delete Functionality
    vm.OnDelete = function (resp) {

        filterListByItemCode = 'Item_x0020_Code/Item_x0020_Code eq \'' + resp.Item_x0020_Code + '\'';
        vm.filterByItemCode = {
            select: '*',
            filter: filterListByItemCode,
            orderby: orderbyModified
        };
        if (resp.ID != null) {
            spcrud.read($http, vm.ApprovalList, vm.filterByItemCode).then(function (response) {
                if (response.status === 200) {
                    vm.CheckItems = response.data.d.results[0].Status;
                }
                if (vm.CheckItems == 'Pending') {
                    alert('Cannot Delete Item , It is  already in pending state!');

                }
                else {
                vm.flag = 1;
                    if (vm.flag != '') {
                        spcrud.update($http, vm.RnRProductCatalog, resp.ID, { 'Item_x0020_Status': 'Inactive' }

                        ).then(function (resp) {
                            spcrud.update($http, vm.ApprovalList, response.data.d.results[0].ID, { 'Item_x0020_Status': 'Inactive' }
                            ).then(function (resp) {
                            });
                            // if (confirm()="")
                            //{
                            confirm("Product Deleted Successfully!.");
                            //}

                            vm.read();
                        });
                    }
                }
            }, function (error) {

            });
        } else {
            alert("Cannot Delete Item");
        }
    }

    // Diaplay image to the grid
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
                
            });

        }, this);
        
    }

       vm.appendimgtoapproval = function () {
        vm.ApprovalItemDetails.forEach(function (productItem) {
            var id = productItem.Item_x0020_Code;
            nameFilter = 'Item_x0020_Code eq \'' + id.Item_x0020_Code + '\'';
            var Options = { filter: nameFilter };
            spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
                if (response.status === 200)
                    vm.Url = response.data.d.results;
                vm.ApprovalItemDetails.find(f => f.Item_x0020_Code == id).Url = response.data.d.results;
            }, function (error) {
                
            });

        }, this);
        
    }
}
angular.module('stockManagemenApp', []).controller('stockManagementCtl', stockManagementCtl);