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
    vm.IsVisibleWhenReduced = false;
    vm.SaveButton = false;
    vm.RejectedSaveButton = false;
    vm.AddButton = true;
    vm.ClearButton = true;
    vm.ClearEditButton = false;
    vm.checkID = '';
    vm.isDisabledQuantity = false;
    vm.isDisabledPoints = false;
    vm.isDisabledDescription = false;
    vm.isDisabledProductName = false;
    vm.isDisablesPicture = false;
    vm.isTotalDisabledQuantity = true;
    vm.Imageadd = true;
    vm.ImageUpdate = false;
    itemSelect = 'Item_x0020_Code/Item_x0020_Code,*';
    itemExpand = 'Item_x0020_Code/Item_x0020_Code';
    Active = 'Active';
    Approved = 'Approved';
    Pending = 'Pending';
    Rejected = 'Rejected';
    orderbyModified = 'Modified desc';
    // pendingFilter = '((Status eq \'' + Pending + '\' ) or ( Status eq \'' + Rejected + '\' )) and (Item_x0020_Status eq \'' + Active + '\')';
    pendingFilter = 'Status eq \'' + Pending + '\'   and Item_x0020_Status eq \'' + Active + '\'';
    RejectedFilter = ' Status eq \'' + Rejected + '\'  and Item_x0020_Status eq \'' + Active + '\'';
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
    vm.RejectedOptions = {
        select: itemSelect,
        expand: itemExpand,
        filter: RejectedFilter
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
            // vm.appendimgtoapproval();
        }, function (error) {
        });
    };
    vm.read();
    /* ----------------------------------------------------------------------------------------------------*/
    // Read List RnR Product catalog approval (Pending)
    vm.readList = function () {
     
        spcrud.read($http, vm.ApprovalList, vm.pendingOptions).then(function (resp) {
            if (resp.status === 200)
                vm.ApprovalItemDetails = resp.data.d.results;
            var ItemCount = resp.data.d.results.length - 1;
            if (resp.data.d.results.length == 0) {
                vm.productid = 1;
            }
            else {
                vm.productid = resp.data.d.results[ItemCount].ID + 1;
            }
            vm.appendimgtoapproval();
            // vm.appendimgtoapprovalForUploadedImage();
            
        }, function (error) {
        });
    };
    vm.readList();
    /* ----------------------------------------------------------------------------------------------------*/
    // Read List RnR Product catalog approval (Rejected)
    vm.readRnRApprovalListForRejectedProducts = function () {
     
        spcrud.read($http, vm.ApprovalList, vm.RejectedOptions).then(function (RejectedProductResp) {
            if (RejectedProductResp.status === 200)
                vm.RejectedProductDetails = RejectedProductResp.data.d.results;
            vm.RejectedProductImages();
            // vm.appendimgtoapprovalForUploadedImage();
            
        }, function (error) {
        });
    };
    vm.readRnRApprovalListForRejectedProducts();
    /* ----------------------------------------------------------------------------------------------------*/
    vm.readImageList = function () {
        spcrud.read($http, vm.ImageList).then(function (resp) {
            if (resp.status === 200)

                vm.ImageDetailsDetails = resp.data.d.results;
            //  vm.ImageId =resp.data.d.results[0].ID;
        }, function (error) {
            vm.UpdateItemID = resp.ID;
        });
    };
    vm.readImageList();
    /* ----------------------------------------------------------------------------------------------------*/

    //Calculate total Quantity
    vm.TotalQuantity = function (resp) {
        vm.Item.TotalQuantity = vm.Item.NewQuantity + vm.Item.Quantity;
        if (vm.Item.NewQuantity < 0) {
            vm.IsVisibleWhenReduced = true;
        }
        else
            vm.IsVisibleWhenReduced = false;
        vm.Item.Comments = null;
    }
    /* ----------------------------------------------------------------------------------------------------*/

    // Add New Item to RnR product catalog list
    vm.AddProduct = function (resp) {
        vm.read();
        vm.readList();
        if (resp.Item_x0020_Name == undefined) {
            alert("Enter Product Name");
        }
        else if (resp.Points == undefined) {
            alert("Points cannot be blank OR out of range");
        }
        else if (resp.Quantity == undefined) {
            alert("Quantity cannot be blank OR out of range");
        }
        else {
            spcrud.create($http, vm.RnRProductCatalog, { 
                'Title': 'Item Adding', 
                'Status': 'Pending', 
                'Item_x0020_Code': 'ESPP77100' + vm.productid, 
                'Points': resp.Points, 'Quantity': 0, 
                'Updated_x0020_Quantity': resp.Quantity, 
                'Item_x0020_Name': resp.Item_x0020_Name, 
                'Item_x0020_Description': resp.Item_x0020_Description, 
                'Item_x0020_Status': 'Active' }
            ).then(function (resp) {
                vm.itemId = resp.data.d.ID;
                spcrud.create($http, vm.ApprovalList, { 
                    'Title': 'Item Adding', 
                    'Status': 'Pending', 
                    'Item_x0020_CodeId': vm.itemId, 
                    'Points': resp.data.d.Points, 
                    'Quantity': resp.data.d.Updated_x0020_Quantity, 
                    'Updated_x0020_Quantity': 0, 
                    'Item_x0020_Name': resp.data.d.Item_x0020_Name, 
                    'Item_x0020_Description': resp.data.d.Item_x0020_Description, 
                    'Item_x0020_Status': 'Active' }
                ).then(function (response) {
                    vm.uploadFile();
                   // vm.FileUpload = null;
                    //vm.appendimgtoapproval();
                    alert("Product Added Successfully! And sent for Approval");
                    vm.readList();
                    vm.claer();
                });
            });
        }
        angular.element("input[type='file']").val(null);
    }

    vm.readImageList();
    /*------------------------------------------------------------ Image code ----------------------------------*/
    vm.uploadFile = function () {
        var deferred = $.Deferred();
        // Define the folder path for this example.
        var serverRelativeUrlToFolder = '/RnR Product Images';    //Ex: '/sites/<Site>/<SubSite>/<LibraryName>';
        // Get test values from the file input and text input page controls.
        var fileInput = jQuery('#FileUpload');
        // Get the server URL.
        var serverUrl = _spPageContextInfo.webAbsoluteUrl;
        // Below Code call all files in a loop, Initiate method calls using jQuery promises.
        // Get the local file as an array buffer.
        (function Tasks(i, callback) {
            if (i < fileInput[0].files.length) {
                var success = ProcessFiles(i);
                success.done(function () { Tasks((i + 1), callback); });
            }
            else {
                callback();
            }
        })(0, function () { deferred.resolve(); });
        //Below function call all the functions (GetFileBuffer,UploadFile,GettheLibraryItem,UpdatingTheItemColumns)
        function ProcessFiles(ind) {
            var deferred = $.Deferred();
            var getFile = getFileBuffer(ind);
            getFile.done(function (arrayBuffer) {
                // Add the file to the SharePoint folder.
                var addFile = addFileToFolder(arrayBuffer, ind);
                addFile.done(function (file, status, xhr) {
                    // Get the list item that corresponds to the uploaded file.
                    var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
                    getItem.done(function (listItem, status, xhr) {
                        // update item code in image list
                        spcrud.update($http, vm.ImageList, listItem.d.Id, { 'Item_x0020_CodeId': vm.itemId }
                        ).then(function (resp) {
                            angular.element("input[type='file']").val(null);
                            vm.readList();
                            vm.readImageList();
                        });
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
        function addFileToFolder(arrayBuffer, ind) {
            var fileName = vm.itemId + fileInput[0].files[ind].name;
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
        function updateListItem(itemMetadata, ind, ItemCOde) {
            //Adding ID with file name here 
            // var newName =  ID.toString()+'-'+fileInput[0].files[ind].name;
            // Define the list item changes. Use the FileLeafRef property to change the display name. 
            // For simplicity, also use the name as the title. 
            // The example gets the list item type from the item's metadata, but you can also get it from the
            // ListItemEntityTypeFullName property of the list.
            var body = String.format("{{'__metadata':{{'type':'{0}'}},'Item_x0020_CodeId':{1}}}",
                itemMetadata.type, ItemCOde);

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
        //vm.Imageadd = null;
        vm.SaveButton = vm.SaveButton ? false : false;
        vm.RejectedSaveButton = vm.RejectedSaveButton ? false : false;
        vm.IsVisible = vm.IsVisible ? false : false;
        vm.AddButton = vm.AddButton ? true : true;
        vm.FileUpload = null;
        vm.FileUploadUpdate = null;
    }
    /* ----------------------------------------------------------------------------------------------------- */
    vm.claerEdit = function () {
        vm.Item = null;
        vm.AddButton = vm.AddButton ? false : true;
        vm.SaveButton = vm.SaveButton ? false : false;
        vm.RejectedSaveButton = vm.RejectedSaveButton ? false : false;
        vm.IsVisible = vm.IsVisible ? false : true;
        vm.isDisabledQuantity = false;
        vm.isDisabledProductName = false;
        vm.isDisablesPicture = false;
        vm.isDisabledPoints = false;
        vm.isDisabledDescription = false;
        vm.FileUploadUpdate = null;
    }
    /* ----------------------------------------------------------------------------------------------------- */
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
                alert('The selected item already pending for approval');
            }
            else {
                    
                    vm.Item = resp;
                    vm.SaveButton = vm.SaveButton ? true : true;
                    vm.IsVisible = vm.IsVisible ? false : true;
                    vm.AddButton = vm.AddButton ? false : false;
                    vm.isDisabledQuantity = true;
                    vm.isDisabledPoints = true;
                    vm.isDisabledDescription = true;
                    vm.isDisabledProductName = true;
                    vm.isDisablesPicture = true;
                    // vm.Imageadd = false;
                    // vm.ImageUpdate = true;
                    vm.ClearButton = false;
                    vm.ClearEditButton = true;
            }
        });
    }

    vm.read();
    // ---------------------------------------------- Edit Rejected Products ----------------------------------
vm.EditRejected = function (EditResponse){
               // Read Item ID for rejected Item
        vm.RejectedItemCode = EditResponse.Item_x0020_Code.Item_x0020_Code;
        
        approvedFilter = 'Item_x0020_Code eq \'' + vm.RejectedItemCode + '\''; 
        vm.ProductIDOptions = {
        filter: approvedFilter
    };        
        spcrud.read($http, vm.RnRProductCatalog, vm.ProductIDOptions).then(function (RejectResponse) {
            if (RejectResponse.status === 200)
              vm.RejectedProductID =  RejectResponse.data.d.results[0].ID;
            
        }, function (error) {
        });
                vm.Item = EditResponse;
                vm.SaveButton = vm.SaveButton ? false : false;
                vm.RejectedSaveButton = vm.RejectedSaveButton ? true : true;
                vm.IsVisible = vm.IsVisible ? false : true;
                vm.AddButton = vm.AddButton ? false : false;
                vm.isDisabledQuantity = true;
                vm.Imageadd = false;
                vm.ImageUpdate = true;
                vm.ClearButton = false;
                vm.ClearEditButton = true;
}

    /* ----------------------------------------------------------------------------------------------------- */
    // Update Item to RnR Product Catalog Approval list
    vm.UpdateItem = function (resp) {
        filterListByItemCode = 'Item_x0020_Code/Item_x0020_Code eq \'' + resp.Item_x0020_Code + '\'';
        vm.ImageUpdateItemID = resp.Item_x0020_Code;
        vm.UpdateItemCodeForDeletedImage = resp.ID;
         if (resp.ID != null) {
            spcrud.read($http, vm.ApprovalList, vm.filterByItemCode).then(function (response) {
                if (response.status === 200) {
                    vm.CheckItems = response.data.d.results[0].Status;
                }
                if (vm.CheckItems == 'Pending') {
                    alert('The selected item already pending for approval!');
                    vm.claerEdit();
                }
                else {
                    vm.flag = 1;
                    if (vm.flag != '') {
                        vm.UpdateditemId = resp.ID;
                        spcrud.create($http, vm.ApprovalList, { 
                            'Title': 'Item Adding', 
                            'Status': 'Pending', 
                            'Item_x0020_CodeId': resp.ID, 
                            'Points': resp.Points, 
                            'Quantity': resp.Quantity, 
                            'Updated_x0020_Quantity': resp.NewQuantity, 
                            'Item_x0020_Name': resp.Item_x0020_Name, 
                            'Item_x0020_Description': resp.Item_x0020_Description, 
                            'Comments': resp.Comments 
                        }
                        ).then(function (createresp) {
                                alert("Product Updated Successfully! And sent for approval.");
                                vm.read();
                                vm.claer();
                                vm.SaveButton = vm.SaveButton ? false : false;
                                vm.AddButton = vm.AddButton ? true : true;
                                vm.isDisabledQuantity = false;
                                vm.isDisabledPoints = false;
                                vm.isDisabledDescription= false;
                                vm.isDisabledProductName = false;
                                vm.IsVisibleWhenReduced = false;
                                vm.isDisablesPicture = false;
                                vm.Imageadd = true;
                                vm.ImageUpdate = false;
                                vm.readList();
                            });
                       // });
                    }
                }
            }, function (error) {
            });
        } else {
            alert("Cannot Update Item");
        }
           vm.readImageList();
    }
// --------------------------------------------------------- Edit Rejected Products----------------------------
vm.UpdateRejectedItem = function (RejectedItemresp)
{
      vm.UpdatedId  = RejectedItemresp.ID;
        vm.ImageUpdateItemID = RejectedItemresp.Item_x0020_Code.Item_x0020_Code;
       spcrud.update($http, vm.ApprovalList, vm.UpdatedId , { 
           'Status': 'Pending', 
        //    'Item_x0020_CodeId': RejectedItemresp.Id, 
           'Points': RejectedItemresp.Points, 
           'Quantity': RejectedItemresp.Quantity, 
           'Updated_x0020_Quantity': RejectedItemresp.NewQuantity, 
           'Item_x0020_Name': RejectedItemresp.Item_x0020_Name, 
           'Item_x0020_Description': RejectedItemresp.Item_x0020_Description, 
           'Comments': RejectedItemresp.Comments 
        }).then(function (createresp) {
            
                // Image update
                    if (jQuery('#FileUploadUpdate')[0].files.length != 0) {
                        updateImageIDFilter = 'Item_x0020_Code/Item_x0020_Code eq \'' + vm.ImageUpdateItemID + '\'';
                        vm.FilterdImageID = {
                                                select: itemSelect,
                                                expand: itemExpand,
                                                filter: updateImageIDFilter
                                            };
                        spcrud.read($http, vm.ImageList, vm.FilterdImageID).then(function (resp) {
                                     if (resp.status === 200)
                                        vm.ImageDetailsDetails = resp.data.d.results;
                                        vm.ImageId = resp.data.d.results[0].ID; 
                                         }).then(function (resp) {

                                        // Delete previous image
                                        spcrud.del($http, vm.ImageList, vm.ImageId).then(function (resp) {
                                         
                                              vm.uploadUpdatedFile();
                                                alert("Product Updated Successfully! And sent for approval.");
                                vm.read();
                                vm.claer();
                                vm.SaveButton = vm.SaveButton ? false : false;
                                vm.AddButton = vm.AddButton ? true : true;
                                vm.isDisabledQuantity = false;
                                vm.isDisabledPoints = false;
                                vm.isDisabledDescription= false;
                                vm.isDisabledProductName = false;
                                vm.IsVisibleWhenReduced = false;
                                vm.isDisablesPicture = false;
                                vm.Imageadd = true;
                                vm.ImageUpdate = false;
                                vm.readList();
                                vm.readRnRApprovalListForRejectedProducts();
                                        });
                                      });
                                }
           });
}
    /* ----------------------------------------------------------------------------------------------------- */
   vm.uploadUpdatedFile = function (){
        var deferred = $.Deferred();
        var serverRelativeUrlToFolder = '/RnR Product Images';    //Ex: '/sites/<Site>/<SubSite>/<LibraryName>';
        var fileInput = jQuery('#FileUploadUpdate');
        var serverUrl = _spPageContextInfo.webAbsoluteUrl;
        (function Tasks(i, callback) {
            if (i < fileInput[0].files.length) {
                var success = ProcessFiles(i);
                success.done(function () { Tasks((i + 1), callback); });
            }
            else {
                callback();
            }
        })(0, function () { deferred.resolve(); });
        function ProcessFiles(ind) {
            var deferred = $.Deferred();
            var getFile = getFileBuffer(ind);
            getFile.done(function (arrayBuffer) {
                var addFile = addFileToFolder(arrayBuffer, ind);
                addFile.done(function (file, status, xhr) {
                    var getItem = getListItem(file.d.ListItemAllFields.__deferred.uri);
                    getItem.done(function (listItem, status, xhr) {
                        // update item code in image list
                        spcrud.update($http, vm.ImageList, listItem.d.Id, { 'Item_x0020_CodeId':vm.RejectedProductID }
                        ).then(function (resp) {
                            angular.element("input[type='file']").val(null);
                            vm.readList();
                            vm.readImageList();
                        });
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
        function addFileToFolder(arrayBuffer, ind) {
            var fileName = vm.RejectedProductID+ fileInput[0].files[ind].name;
            // Construct the endpoint.
            var fileCollectionEndpoint = String.format(
                "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
                "/add(overwrite=true, url='{2}')",
                serverUrl, serverRelativeUrlToFolder, fileName);
            return jQuery.ajax({
                url: fileCollectionEndpoint,
                type: "POST",
                data: arrayBuffer,
                processData: false,
                headers: {
                    "accept": "application/json;odata=verbose",
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "content-type": "application/json;odata=verbose"
                }
            });
        }
        function getListItem(fileListItemUri) {
            return jQuery.ajax({
                url: fileListItemUri,
                type: "GET",
                headers: { "accept": "application/json;odata=verbose" }
            });
        }
        function updateListItem(itemMetadata, ind, ItemCOde) {
            var body = String.format("{{'__metadata':{{'type':'{0}'}},'Item_x0020_CodeId':{1}}}",
                itemMetadata.type, ItemCOde);
            return jQuery.ajax({
                url: itemMetadata.uri,
                type: "POST",
                data: body,
                headers: {
                    "X-RequestDigest": jQuery("#__REQUESTDIGEST").val(),
                    "content-type": "application/json;odata=verbose",
                    "IF-MATCH": itemMetadata.etag,
                    "X-HTTP-Method": "MERGE"
                }
            });
        }
        return deferred.promise();
    }
    function onError(error) {
            alert('Something went wrong please contact admin !');
    }
   
   //------------------------------------------------------------------------------------------------------
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
                            confirm("Product Deleted Successfully !");
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
    /* ----------------------------------------------------------------------------------------------------- */
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
    /* ----------------------------------------------------------------------------------------------------- */
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

    // -------------------------------- Iamges for rejected products -------------------------------

    vm.RejectedProductImages = function () {
        vm.RejectedProductDetails.forEach(function (productItem) {
            var id = productItem.Item_x0020_Code;
            nameFilter = 'Item_x0020_Code eq \'' + id.Item_x0020_Code + '\'';
            var Options = { filter: nameFilter };
            spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
                if (response.status === 200)
                    vm.Url = response.data.d.results;
                vm.RejectedProductDetails.find(f => f.Item_x0020_Code == id).Url = response.data.d.results;
            }, function (error) {

            });

        }, this);

    }

    // vm.appendimgtoapprovalForUploadedImage = function () {
    //  //   vm.RejectedProductDetails.forEach(function (productItem) {
    //       //  var id = productItem.Item_x0020_Code;
    //         nameFilter = 'Item_x0020_Code eq \'' +  vm.ImageUpdateItemID + '\'';
    //         var Options = { filter: nameFilter };
    //         spcrud.getImg($http, vm.ImageList, Options).then(function (response) {
    //             if (response.status === 200)
    //                 vm.Url = response.data.d.results;
    //             vm.RejectedProductDetails.find(f => f.Item_x0020_Code == vm.ImageUpdateItemID).Url = response.data.d.results;
    //         }, function (error) {

    //         });

    //   //  }, this);

    // }
}
/* ----------------------------------------------------------------------------------------------------- */
angular.module('stockManagemenApp', []).controller('stockManagementCtl', stockManagementCtl);
