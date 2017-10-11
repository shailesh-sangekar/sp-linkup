function AllTicketCtl($scope, $http, $timeout, $filter) {
    var vm = $scope;
    vm.spinnerloaded = false;
    vm.loaded = false;
    vm.listESPLServiceDesk = 'ESPL Service Desk';
    vm.listESPLServiceDepartments = 'ESPL Service Departments';
    vm.listServiceDeskComments = 'Service Desk Comments';
    vm.Authorised = false;
    vm.NotAuthorised = false;
    vm.groupedItems = [];
   vm.itemsPerPage = 10;
    vm.pagedItems = [];
    vm.currentPage = 0;
    vm.mod = '';
    vm.ExportTable = false;
    Resigned = 'Resigned';
    vm.filteredItems = [];
    vm.commentData = [];
    vm.CommentHistory=false;
  vm.CommentHistoryhide=false;
    $scope.page = 1;
    $scope.itemsDisplay = 3
 

vm.commentHistoy=function(){
    vm.CommentHistoryhide=true;
   vm.CommentHistory=true;
}
vm.commentHistoyHide = function(){
    vm.CommentHistory=false;
    vm.CommentHistoryhide=false;
}
    vm.readPeopleList = function() {
        spcrud.getCurrentUser($http).then(function(response) {
            if (response.status === 200)
                var myJSON = JSON.stringify(response.data.d.results);
            vm.CurrentLoggedInUser = response.data.d.Title;
            vm.LoggedInUserID = response.data.d.Id;
            var DeptListFilter = '';
            for (i = 0; i < response.data.d.Groups.results.length; i++) {
                // if (vm.GroupFound == false) {
                if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskLinkupSupport') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Linkup Support' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskRMSSupport') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'RMS Support' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskIT') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'IT' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskHR') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'HR' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskFinance') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Finance' + '\') ';
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskAdmins') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Admin' + '\') ';
                }
            }
            vm.FinalFilter=DeptListFilter;
            vm.readlistESPLServiceDesk(DeptListFilter);
        }, function(error) {
            console.log('error', error);
        });
    };

    vm.readPeopleList();

    vm.readlistESPLServiceDesk = function(DeptListFilter) {
        if (DeptListFilter.length > 0) {
            vm.Authorised = true;
            vm.NotAuthorised = false;
        } else {
            vm.Authorised = false;
            vm.NotAuthorised = true;
        }
        var deptFilter = DeptListFilter.substring(3);
        empSelect = 'Employee/Title,Employee/ID,Department/Department,Editor/Title,Author/Title,Predefined_x0020_Concern/Predefined_x0020_Concern,*';
        empExpand = 'Employee/Title,Employee/ID,Department/Department,Editor/Title,Author/Title,Predefined_x0020_Concern/Predefined_x0020_Concern';
        CreatedDate = 'Created desc';
        count = '10000';
        // deptFilter = DeptListFilter;
        vm.resignedOptions = {
            select: empSelect,
            expand: empExpand,
            filter: deptFilter,
            orderby: CreatedDate,
            top: count
        };
        spcrud.read($http, vm.listESPLServiceDesk, vm.resignedOptions).then(function(resp) {
            if (resp.status === 200)
                var myJSON = JSON.stringify(resp.data.d.results);
            vm.DatalistESPLServiceDesk = resp.data.d.results;
            vm.DatalistESPLServiceDesk.forEach(f => {
                if (f.Created != null) {
                    var date2 = new Date();
                    var date1 = new Date(f.Created);
                    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    f.ageDiff = (workingDaysBetweenDates(date1, date2) - 1);
                }

            });
            vm.readlistServiceDeskComments();
            // vm.readlistServiceDeskComments();
            //vm.spinnerloaded = true;
        }, function(error) {
            console.log('error', error);
        });

    };
    workingDaysBetweenDates = function(startDate, endDate) {

        // Validate input
        if (endDate < startDate)
            return 0;

        // Calculate days between dates
        var millisecondsPerDay = 86400 * 1000; // Day in milliseconds
        startDate.setHours(0, 0, 0, 1); // Start just after midnight
        endDate.setHours(23, 59, 59, 999); // End just before midnight
        var diff = endDate - startDate; // Milliseconds between datetime objects    
        var days = Math.ceil(diff / millisecondsPerDay);

        // Subtract two weekend days for every week in between
        var weeks = Math.floor(days / 7);
        days = days - (weeks * 2);

        // Handle special cases
        var startDay = startDate.getDay();
        var endDay = endDate.getDay();

        // Remove weekend not previously removed.   
        if (startDay - endDay > 1)
            days = days - 2;

        // Remove start day if span starts on Sunday but ends before Saturday
        if (startDay == 0 && endDay != 6) {
            days = days - 1;
        }

        // Remove end day if span ends on Saturday but starts after Sunday
        if (endDay == 6 && startDay != 0) {
            days = days - 1;
        }

        return days;
    }
    vm.readlistServiceDeskComments = function() {
        // vm.DatalistESPLServiceDesk.forEach(function(product) {
           // var id = product.Service_x0020_Desk_x0020_ID;
          //  var deptt=product.Department.Department;
        //    statusFilter = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID eq \'' + id + '\'';
            commentSelect = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title,*';
            commentExpand = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title';
            ModeifiedDate = 'Modified desc';
            count = '100000';
            var Options = {
                select: commentSelect,
                expand: commentExpand,
                orderby: ModeifiedDate,
                top: count
               // filter: statusFilter
            };
            spcrud.read($http, vm.listServiceDeskComments, Options).then(function(response) {
                if (response.status === 200)
                    if (response.data.d.results.length > 0) {
                        vm.DatalistServiceDeskComments1 = response.data.d.results;
                        var groupBy = function(xs, key) {
                            return xs.reduce(function(rv, x) {
                                x.Modified=new Date(x.Modified);
                              (rv[x[key]] = rv[x[key]] || []).push(x);
                              return rv;
                            }, {});
                          };
                          vm.commentData=groupBy(vm.DatalistServiceDeskComments1, 'Service_x0020_Desk_x0020_IdId');
                    } 
                    vm.DatalistESPLServiceDesk.forEach(f => {
                            // vm.commentData.forEach(fcomments => {
                             //   if (vm.commentData[f.Service_x0020_Desk_x0020_ID] === fcomments.Service_x0020_Desk_x0020_Id.Service_x0020_Desk_x0020_ID){
                             if(vm.commentData[f.Id] != null){
                                 if(vm.commentData[f.Id][0].Status != null){
                                    f.FinalStatus = vm.commentData[f.Id][0].Status;
                                 }
                                else{
                                    f.FinalStatus = 'Open';
                                }
                                f.Modified = vm.commentData[f.Id][0].Modified;
                                if (vm.commentData[f.Id][0].Status === 'Resolved') {
                                    f.ResolvedBy = vm.commentData[f.Id][0].Editor.Title;
                                } else {
                                    f.ResolvedBy = '';
                                }
                             }   
                             
                               // }
                           // })
                    })
                    vm.spinnerloaded = true;
                    
            }, function(error) {
                console.log('error', error);
            });
            
        // }, this);
        vm.groupToPages();
        	
    };
 
    // vm.readlistServiceDeskComments = function() {
    //     vm.DatalistESPLServiceDesk.forEach(function(product) {
    //         var id = product.Service_x0020_Desk_x0020_ID;
    //       //  var deptt=product.Department.Department;
    //         statusFilter = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID eq \'' + id + '\'';
    //         commentSelect = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title,*';
    //         commentExpand = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title';
    //         ModeifiedDate = 'Modified desc';
    //         var Options = {
    //             select: commentSelect,
    //             expand: commentExpand,
    //             orderby: ModeifiedDate,
    //             filter: statusFilter
    //         };
    //         spcrud.read($http, vm.listServiceDeskComments, Options).then(function(response) {
    //             if (response.status === 200)
    //                 if (response.data.d.results.length > 0) {
    //                     vm.DatalistServiceDeskComments1 = response.data.d.results;
    //                     //  vm.DatalistESPLServiceDesk.find(f =>{ f.Service_x0020_Desk_x0020_ID === id}).FinalStatus = response.data.d.results[0].Status;
    //                     vm.DatalistESPLServiceDesk.forEach(f => {
    //                         if (f.Service_x0020_Desk_x0020_ID === id) {
    //                             f.FinalStatus = response.data.d.results[0].Status;
    //                             f.Modified = response.data.d.results[0].Modified
    //                             vm.DatalistServiceDeskComments1.forEach(fcomments => {
    //                                 if (fcomments.Status === 'Resolved') {
    //                                     f.ResolvedBy = fcomments.Editor.Title;
    //                                 } else {
    //                                     f.ResolvedBy = '';
    //                                 }
    //                             })
    //                         }
    //                     })
                        
    //                 } else {
    //                     vm.DatalistESPLServiceDesk.find(f => f.Service_x0020_Desk_x0020_ID == id).FinalStatus = '';
    //                 }
                    
    //         }, function(error) {
    //             console.log('error', error);
    //         });

    //     }, this);
    //     vm.groupToPages();
        	
    // };
 

    vm.filterItems= function(filterText){
    vm.filterText=filterText;
    var data = $filter('filter')(vm.DatalistESPLServiceDesk,vm.filterText, false,'Title');
    vm.groupToPagesFilter(data);
    vm.page = 1;
 
};
vm.showFIlter=function(count){
    vm.itemsPerPage=count;
    vm.groupToPagesFilter(vm.DatalistESPLServiceDesk);
    vm.page = 1;
}
// $scope.sort = {
//     column: '',
//     descending: false
// };  
// $scope.changeSorting = function(column) {
    
//             var sort = $scope.sort;
    
//             if (sort.column == column) {
//                 sort.descending = !sort.descending;
//             } else {
//                 sort.column = column;
//                 sort.descending = false;
//             }
//         };
            
//         $scope.selectedCls = function(column) {
//             return column == scope.sort.column && 'sort-' + scope.sort.descending;
//         };
 vm.groupToPagesFilter = function(data) {
        vm.pagedItems = [];
        vm.filt=data;
        for (var i = 0; i < vm.filt.length; i++) {
            if (i % vm.itemsPerPage === 0) {
                vm.pagedItems[Math.floor(i / vm.itemsPerPage)] = [vm.filt[i]];
            } else {
                vm.pagedItems[Math.floor(i / vm.itemsPerPage)].push(vm.filt[i]);
            }
        }
        //vm.statusClose(vm.filt);

    };


    vm.groupToPages = function() {
        vm.pagedItems = [];

        for (var i = 0; i < vm.DatalistESPLServiceDesk.length; i++) {
            if (i % vm.itemsPerPage === 0) {
                vm.pagedItems[Math.floor(i / vm.itemsPerPage)] = [vm.DatalistESPLServiceDesk[i]];
            } else {
                vm.pagedItems[Math.floor(i / vm.itemsPerPage)].push(vm.DatalistESPLServiceDesk[i]);
            }
        }
       // vm.statusClose(vm.DatalistServiceDeskComments1);
    };

    vm.range = function(start, end) {
        var ret = [];
        if (!end) {
            end = start;
            start = 0;
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    vm.prevPage = function() {
        if (vm.currentPage > 0) {
            vm.currentPage--;
        }
    };

    vm.nextPage = function() {
        if (vm.currentPage < vm.pagedItems.length - 1) {
            vm.currentPage++;
        }
    };

    vm.setPage = function() {
        vm.currentPage = this.n;
    };
    vm.View = function(item) {
        vm.IsView=true;
        vm.IsReply=false;
        vm.IsResolve=false;
        vm.isReplyHide = false;
        vm.isResolveHide = false;
        vm.isCommentHide = false;
        vm.toggleModalReject(item);
    };
    vm.Reply = function(item) {
        vm.IsView=false;
        vm.IsReply=true;
        vm.IsResolve=false;
        vm.isReplyHide = true;
        vm.isResolveHide = false;
        vm.isCommentHide = true;
        vm.GetDataforReplyResolveFunction(item);
        vm.toggleModalReject(item);
    };
    vm.toggleModalReject = function(itemToEdit) {
        vm.item = itemToEdit;
        vm.item.Comments = '' ;
        vm.showModal = !vm.showModal;
        vm.CommentHistory=false;
        vm.CommentHistoryhide=false;
    
    };
    vm.cancel = function(item) {
        vm.showModal = false;
    };
    vm.ReplyFunction =function(item){  
        if(vm.item.Comments != ''){
            var clientContext = SP.ClientContext.get_current();
            var list = clientContext.get_web().get_lists().getByTitle(vm.listServiceDeskComments);
            var itemCreateInfo = new SP.ListItemCreationInformation();
            var folderUrl = item.Employee_x0020_ID;
            itemCreateInfo.set_folderUrl('/Lists/Service Desk Comments/' + folderUrl);
            var listItem = list.addItem(itemCreateInfo);
            var comment = item.Comments;
            if(item.FinalStatus != undefined){
                var status = item.FinalStatus;
            }
            else{
                var status = 'Open';
            }
            
            var concern = item.Actual_x0020_Concern;
            var dept = item.Department.Department;
            var serviceid= item.Id;
            listItem.set_item('Title','No Title');
            listItem.set_item('Comments',comment);
            listItem.set_item('Status',status);
           listItem.set_item('Predefined_x0020_Concern',concern);
            listItem.set_item('Department',dept);
            listItem.set_item('Service_x0020_Desk_x0020_Id',serviceid);
            listItem.update();
            
            clientContext.load(listItem);
            clientContext.executeQueryAsync(function (sender, arges) {
                alert('Reply Saved Succcessfull');
            }, function (sender, arges) {
                alert(arges.get_message());
            });
            vm.showModal = false;
        }
        else{
            alert('Please Fill Data');
            //vm.showModal = false;
        }
//     var clientContext = SP.ClientContext.get_current();
//     var list = clientContext.get_web().get_lists().getByTitle(vm.listServiceDeskComments);
//     var itemCreateInfo = new SP.ListItemCreationInformation();
//     var folderUrl = item.Employee_x0020_ID;
//     itemCreateInfo.set_folderUrl('/Lists/Service Desk Comments/' + folderUrl);
//     var listItem = list.addItem(itemCreateInfo);
//     var comment = item.Comments;
//     var status = item.FinalStatus;
//     var concern = item.Actual_x0020_Concern;
//     var dept = item.Department.Department;
//     var serviceid= item.Id;
//     listItem.set_item('Title','No Title');
//     listItem.set_item('Comments',comment);
//     listItem.set_item('Status',status);
//    listItem.set_item('Predefined_x0020_Concern',concern);
//     listItem.set_item('Department',dept);
//     listItem.set_item('Service_x0020_Desk_x0020_Id',serviceid);
//     listItem.update();
    
//     clientContext.load(listItem);
//     clientContext.executeQueryAsync(function (sender, arges) {
//         alert('Reply Saved Succcessfull');
//     }, function (sender, arges) {
//         alert(arges.get_message());
//     });
//     vm.showModal = false;
    }
    vm.GetDataforReplyResolveFunction = function(item){
        var serviceId = item.Service_x0020_Desk_x0020_ID;
        var deptt=item.Department.Department;
        serviceIdFilter = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID eq \'' + serviceId + '\' and (Department eq \'' + deptt + '\')';
        commentSelect = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title,*';
        commentExpand = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title';
        ModeifiedDate = 'Modified desc';
        var serviceIdOptions = {
            select: commentSelect,
            expand: commentExpand,
            orderby: ModeifiedDate,
            filter: serviceIdFilter
        };
        spcrud.read($http, vm.listServiceDeskComments, serviceIdOptions).then(function(response) {
            if (response.status === 200)
                if (response.data.d.results != undefined) {
                    vm.DatalistServiceDeskComments1ById = response.data.d.results;
                } else {
                }
        }, function(error) {
            console.log('error', error);
        }); 
    };
    vm.Resolve = function(item) {
        vm.IsView=false;
        vm.IsReply=false;
        vm.IsResolve=true;
        $scope.isCommentHide = true;
        $scope.isReplyHide = false;
        $scope.isResolveHide = true;
        vm.GetDataforReplyResolveFunction(item);
        vm.toggleModalReject(item);
    };
    vm.ResolveFunction =function(item){  
        if(vm.item.Comments != ''){
        var clientContext = SP.ClientContext.get_current();
        var list = clientContext.get_web().get_lists().getByTitle(vm.listServiceDeskComments);
        var itemCreateInfo = new SP.ListItemCreationInformation();
        var folderUrl = item.Employee_x0020_ID;
        itemCreateInfo.set_folderUrl('/Lists/Service Desk Comments/' + folderUrl);
        var listItem = list.addItem(itemCreateInfo);
        var comment = item.Comments;
        //var status = item.FinalStatus;
        var concern = item.Actual_x0020_Concern;
        var dept = item.Department.Department;
        var serviceid= item.Id;
        listItem.set_item('Title','No Title');
        listItem.set_item('Comments',comment);
        listItem.set_item('Status','Resolved');
        listItem.set_item('Predefined_x0020_Concern',concern);
        listItem.set_item('Department',dept);
        listItem.set_item('Service_x0020_Desk_x0020_Id',serviceid);
        listItem.update();
        
        clientContext.load(listItem);
        clientContext.executeQueryAsync(function (sender, arges) {
            alert('Resolved Succcessfull');
        }, function (sender, arges) {
            alert(arges.get_message());
        });
        vm.showModal = false;
        //vm.showl
        var filter=vm.FinalFilter;
        vm.readlistESPLServiceDesk(filter);
    }
    else{
        alert('Please Fill Data');
        //vm.showModal = false;
    }
    };
    vm.fnExcelReport = function() {
        var tab_text = '<html xmlns:x="urn:schemas-microsoft-com:office:excel">';
        tab_text = tab_text + '<head><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>';
        tab_text = tab_text + '<x:Name>Report Sheet</x:Name>';
        tab_text = tab_text + '<x:WorksheetOptions><x:Panes></x:Panes></x:WorksheetOptions></x:ExcelWorksheet>';
        tab_text = tab_text + '</x:ExcelWorksheets></x:ExcelWorkbook></xml></head><body>';
        tab_text = tab_text + "<table border='1px'>";
        tab_text = tab_text + $('#myTableToExport').html();
        tab_text = tab_text + '</table></body></html>';
        var data_type = 'data:application/vnd.ms-excel';
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE ");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            if (window.navigator.msSaveBlob) {
                var blob = new Blob([tab_text], {
                    type: "application/csv;charset=utf-8;"
                });
                navigator.msSaveBlob(blob, 'Report.xls');
            }
        } else {
            //$('#test').attr('href', data_type + ', ' + encodeURIComponent(tab_text));
            xData = new Blob([tab_text], { type: 'text/csv' });
            var xUrl = URL.createObjectURL(xData);
            $('#test').attr('href', xUrl);
            //a.href = xUrl;
            $('#test').attr('download', 'Report.xls');
        }
    };
}


function modal() {
    return {
        template: '<div class="modal fade" data-backdrop="static">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content scrollModal" style="height:600px;">' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
        restrict: 'E',
        transclude: true,
        replace: true,
        scope: true,
        link: function postLink(scope, element, attrs) {
            scope.$watch(attrs.visible, function(value) {
                if (value == true)
                    $(element).modal('show');
                else
                    $(element).modal('hide');
            });

            $(element).on('shown.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = true;
                });
            });

            $(element).on('hidden.bs.modal', function() {
                scope.$apply(function() {
                    scope.$parent[attrs.visible] = false;
                });
            });
        }
    };
};




 






//load
angular.module('AllTicketApp',[]).controller('AllTicketCtl', AllTicketCtl ).directive('modal', modal);