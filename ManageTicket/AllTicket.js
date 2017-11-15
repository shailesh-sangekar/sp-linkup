function AllTicketCtl($scope, $http, $timeout, $filter ,$window) {
    var vm = $scope;
    vm.spinnerloaded = false;
    vm.loaded = false;
    vm.listESPLServiceDesk = 'ESPL Service Desk';
    vm.listESPLServiceDepartments = 'ESPL Service Departments';
    vm.listServiceDeskComments = 'Service Desk Comments';
    vm.Authorised = false;
    vm.NotAuthorised = false;
    vm.groupedItems = [];
    // vm.itemsPerPage =20 ;
    //var count=20;
    vm.pagedItems = [];
    vm.currentPage = 0;
    vm.mod = '';
    vm.ExportTable = false;
    Resigned = 'Resigned';
    vm.filteredItems = [];
    vm.commentData = [];
    vm.CommentHistory = false;
    vm.LinkupGroup=false;
    vm.deptHead = false;
    //vm.CommentHistory=true;
    //vm.CommentHistoryhide=false;
    $scope.page = 1;
    $scope.itemsDisplay = 3
    vm.ShowComment = true;
    vm.HideComment = false;
    vm.CancelButton=false;
    
    vm.Dept=[];
    var Dept1='';
    vm.Dept2=[];
    vm.data=[];
    vm.FinalOpenData=[];
    vm.FinalResolvedData=[];
    vm.FinalClosedData=[];
    vm.Status='';
    vm.Priority='';
    vm.LOG=[];

     vm.TicketEditedTime='';
     vm.abc='';

    vm.RecordsPerPage=['20','40','60','100'];
    vm.StatusDropdown=['Open','Reopen','Resolved','Closed'];
    vm.PriorityDropdown=['High','Medium','Low'];
    vm.commentHistoy=function(){
    vm.HideComment=true;
    vm.CommentHistory=true;
    vm.CommentHistoryhide=true;
        // vm.CommentHistory=true;
    }
    vm.commentHistoyHide = function(){
        vm.CommentHistory=false;
        vm.HideComment=false;
        vm.ShowComment=true; 
    }
    // vm.viewcomment=function(){
    //     vm.CommentHistory=true;
    //     vm.HideComment=false;
    //     vm.ShowComment=false;
    // }
    vm.readPeopleList = function() {
        spcrud.getCurrentUser($http).then(function(response) {
            if (response.status === 200)
                var myJSON = JSON.stringify(response.data.d.results);
            vm.CurrentLoggedInUser = response.data.d.Title;
            vm.LoggedInUserID = response.data.d.Id;
            var DeptListFilter = '';
            for (i = 0; i < response.data.d.Groups.results.length; i++) {
                if (response.data.d.Groups.results[i].LoginName == 'ServiceDeptHead') {
                    vm.deptHead = true;
                    DeptListFilter = '';
                    vm.DepartmentDropdown=['Linkup Support','RMS Support','IT','HR','Finance','Admin'];
                    break;
                } else {
                // if (vm.GroupFound == false) {
                if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskLinkupSupport') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Linkup Support' + '\') and (Approver_x0020_Status eq ' + '\'' + 'Approved' + '\')';
                    var Dept1='Linkup Support';
                    vm.Dept.push(Dept1);
                    vm.LinkupGroup=true;
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskRMSSupport') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'RMS Support' + '\') ';
                    var Dept1='RMS Support';
                    vm.Dept.push(Dept1);
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskIT') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'IT' + '\') ';
                    var Dept1='IT';
                    vm.Dept.push(Dept1) ;
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskHR') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'HR' + '\') ';
                    var Dept1='HR';
                    vm.Dept.push(Dept1) ;
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskFinance') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Finance' + '\') ';
                    var Dept1='Finance';
                    vm.Dept.push(Dept1) ;
                } else if (response.data.d.Groups.results[i].LoginName == 'ServiceDeskAdmins') {
                    DeptListFilter = DeptListFilter + 'or (Department/Department eq ' + '\'' + 'Admin' + '\') ';
                    var Dept1='Admin';
                    vm.Dept.push(Dept1) ;
                } 
            }
            vm.Dept2=vm.Dept;
            vm.DepartmentDropdown=vm.Dept2;
            }
            vm.FinalFilter=DeptListFilter;
            vm.readlistESPLServiceDesk(DeptListFilter);
        }, function(error) {
            console.log('error', error);
        });
    };

    vm.readPeopleList();

    vm.readlistESPLServiceDesk = function(DeptListFilter) {
        if (DeptListFilter.length > 0 || vm.deptHead == true) {
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
        
          ///  console.log('vm.DatalistESPLServiceDesk',vm.DatalistESPLServiceDesk);
            vm.DatalistESPLServiceDesk.forEach(f => {
                if (f.Created != null) {
                    var date2 = new Date();
                    var date1 = new Date(f.Created);
                    // var timeDiff = Math.abs(date2.getTime() - date1.getTime());
                    f.ageDiff = (workingDaysBetweenDates(date1, date2) - 1);
                    if(f.ageDiff < 0){
                        f.ageDiff = 0;
                    }
                }
                f.Modified=new Date(f.Modified);

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
                       /// console.log('cmmm',vm.DatalistServiceDeskComments1);
                        var groupBy = function(xs, key) {
                            return xs.reduce(function(rv, x) {
                                x.Modified=new Date(x.Modified);
                              (rv[x[key]] = rv[x[key]] || []).push(x);
                              return rv;
                            }, {});
                          };
                          vm.commentData=groupBy(vm.DatalistServiceDeskComments1, 'Service_x0020_Desk_x0020_IdId');
                         // console.log('comment',vm.commentData);
                    } 


                    
                    vm.DatalistESPLServiceDesk.forEach(f => {
                            // vm.commentData.forEach(fcomments => {
                            //   if (vm.commentData[f.Service_x0020_Desk_x0020_ID] === fcomments.Service_x0020_Desk_x0020_Id.Service_x0020_Desk_x0020_ID){
                             if(vm.commentData[f.Id] != null){
                                if(vm.commentData[f.Id][0].Status != null){
                                    f.FinalStatus = vm.commentData[f.Id][0].Status;
                                    var LatestCommentTime=vm.commentData[f.Id][0].Modified.format('yyyy-MM-ddTHH:mm:ssZ');
                                    var TicketEditedTime= f.Modified.format('yyyy-MM-ddTHH:mm:ssZ');
                                    var ID=f.Id;
                                    if( TicketEditedTime > LatestCommentTime )
                                    {
                                        f.UpdatedBy=f.Author.Title;
                                        f.ModifiedTime=f.Modified;
                                
                                    }
                                    else
                                    {
                                       f.UpdatedBy=vm.commentData[f.Id][0].Editor.Title;
                                       f.ModifiedTime=vm.commentData[f.Id][0].Modified;
                                    }
                                }
                                else{
                                    f.FinalStatus = 'Open';      
                                }
                                // if (vm.commentData[f.Id][0].Status === 'Resolved' || vm.commentData[f.Id][0].Status === 'Closed') {
                                //     f.ResolvedBy = vm.commentData[f.Id][0].Editor.Title;
                                // } 
                                // //else if(vm.commentData[f.Id][0].Status === 'Reopen')
                                // else {
                                //     f.ResolvedBy = '';
                                // }
                                if(vm.commentData[f.Id][0].Status === 'Reopen'){
                                    for(i=0; i<vm.commentData[f.Id].length; i++){
                                        if(vm.commentData[f.Id][i].Status ==='Resolved' ){
                                            f.ResolvedBy = vm.commentData[f.Id][i].Editor.Title;
                                        }
                                    }
                                }
                                else if(vm.commentData[f.Id][0].Status === 'Resolved' ){

                                   f.ResolvedBy = vm.commentData[f.Id][0].Editor.Title;
                                }
                                else if( vm.commentData[f.Id][0].Status === 'Closed')
                                    for(i=0; i<vm.commentData[f.Id].length; i++){
                                        if(vm.commentData[f.Id][i].Status ==='Resolved' ){
                                            f.ResolvedBy = vm.commentData[f.Id][i].Editor.Title;
                                        }
                                    }
                                    // else{
                                    //     f.ResolvedBy = vm.commentData[f.Id][0].Editor.Title;
                                    // }
                             }
                            else{
                                f.FinalStatus='Open';
                                f.UpdatedBy=f.Editor.Title;
                                f.ModifiedTime=f.Modified;
                            }     
                             
                               // }
                           // })
                    })

                    vm.FinalOpenData=[];
                    vm.FinalResolvedData=[];
                    vm.FinalClosedData=[];
                    vm.FinalReopenData=[];
                    vm.DatalistESPLServiceDesk.forEach(item => {
                        // vm.commentData.forEach(fcomments => {
                         //   if (vm.commentData[f.Service_x0020_Desk_x0020_ID] === fcomments.Service_x0020_Desk_x0020_Id.Service_x0020_Desk_x0020_ID){
                        
                          if(item.FinalStatus == 'Open'){
                            vm.FinalOpenData.push(item);
                         }else if(item.FinalStatus == 'Reopen'){
                            vm.FinalReopenData.push(item);
                        }else if(item.FinalStatus == 'Resolved'){
                            vm.FinalResolvedData.push(item);
                         } else if(item.FinalStatus == 'Closed'){
                            vm.FinalClosedData.push(item);
                         }
                        // else{
                        //     vm.FinalOtherData.push(item);
                        // }
                    
                })
                                         //console.log('Open',vm.FinalOpenData);

                vm.DatalistESPLServiceDesk=[];
               
                vm.FinalOpenData.forEach(openItem =>{
                    vm.DatalistESPLServiceDesk.push(openItem);
                })
                vm.FinalReopenData.forEach(openItem =>{
                    vm.DatalistESPLServiceDesk.push(openItem);
                })
                vm.FinalResolvedData.forEach(openItem =>{
                    vm.DatalistESPLServiceDesk.push(openItem);
                })
                vm.FinalClosedData.forEach(openItem =>{
                    vm.DatalistESPLServiceDesk.push(openItem);
                })
               //console.log('FinalArray',vm.DatalistESPLServiceDesk);
                 vm.groupToPages();
         vm.spinnerloaded = true;
            }, function(error) {
                console.log('error', error);
            });
          
        // }, this);
       
       
        	
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
 vm.filterDepartment= function(Dept,Priority,Status){
     vm.Dept=Dept;
     vm.Priority=Priority;
     vm.Status=Status;
     var casestr=''
    if(vm.Dept == '')
        {
            vm.Dept=undefined;
        }
    if(vm.Priority == '')
    {
       vm.Priority=undefined;
    }
    if(vm.Status == '')
    {
       vm.Status=undefined;
    }
    if(vm.Dept != undefined && vm.Priority != undefined && vm.Status!= undefined )
    {
         casestr=1 ;
    }
    else if(vm.Dept != undefined && vm.Priority != undefined && vm.Status == undefined )
    {
        casestr=2;
    }
    else if(vm.Dept != undefined && vm.Priority == undefined && vm.Status != undefined )
        {
            casestr=3;
        }
    else if(vm.Dept != undefined && vm.Priority == undefined && vm.Status == undefined )
        {
            casestr=4;
        }
    else if(vm.Dept == undefined && vm.Priority != undefined && vm.Status != undefined )
        {
            casestr=5;
        }
    else if(vm.Dept == undefined && vm.Priority != undefined && vm.Status == undefined )
        {
            casestr=6;
        }
    else if(vm.Dept == undefined && vm.Priority == undefined && vm.Status != undefined )
        {
            casestr=7;
        }    
    else
        {
            casestr=8;
        }
        
        switch(casestr){
            case 1:
                {
                     for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if(vm.DatalistESPLServiceDesk[i].Department.Department == vm.Dept && vm.DatalistESPLServiceDesk[i].Priority == vm.Priority && vm.DatalistESPLServiceDesk[i].FinalStatus == vm.Status )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                   // console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                    //console.log("hi 1",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 2:
                {
                    for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if(vm.DatalistESPLServiceDesk[i].Department.Department == vm.Dept && vm.DatalistESPLServiceDesk[i].Priority == vm.Priority )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                    //console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                    //console.log("hi 2",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 3:
                {
                      for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if(vm.DatalistESPLServiceDesk[i].Department.Department == vm.Dept && vm.DatalistESPLServiceDesk[i].FinalStatus == vm.Status )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                    //console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                    //console.log("hi 3",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 4:
                {
                      for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if(vm.DatalistESPLServiceDesk[i].Department.Department == vm.Dept )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                    //console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                    //console.log("hi 4",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 5:
                {
                      for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if(vm.DatalistESPLServiceDesk[i].Priority == vm.Priority && vm.DatalistESPLServiceDesk[i].FinalStatus == vm.Status )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                   // console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                //console.log("hi 5",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 6:
                {
                      for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if( vm.DatalistESPLServiceDesk[i].Priority == vm.Priority  )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                    //console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                //console.log("hi 6",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 7:
                {
                      for(i=0; i<vm.DatalistESPLServiceDesk.length; i++)
                    {
                        if( vm.DatalistESPLServiceDesk[i].FinalStatus == vm.Status )
                        {
                            vm.data.push(vm.DatalistESPLServiceDesk[i]);
                        }
                    }
                    vm.groupToPagesFilter(vm.data);
                    //console.log(vm.data);
                    vm.page=1;
                    vm.data=[];
                //console.log("hi 7",vm.Dept,vm.Status,vm.Priority);
                }
                break;
            case 8:
                {
                     vm.groupToPages();
                }
                break;    
            
        };

 };
    vm.filterItems= function(filterText){
    vm.filterText=filterText;
    var data = $filter('filter')(vm.DatalistESPLServiceDesk,vm.filterText, false,'Title');
    vm.groupToPagesFilter(data);
    vm.page = 1;
 
};

vm.showFIlter=function(count){
    vm.itemsPerPage=count;
    if(vm.Dept!= undefined || vm.Dept!= '' || vm.Priority != undefined || vm.Priority!='' || vm.Status!= undefined || vm.Status!='' )
        {
          vm.itemsPerPage=count;
          vm.filterDepartment(vm.Dept,vm.Priority,vm.Status);
        }
    else{
            vm.groupToPagesFilter(vm.DatalistESPLServiceDesk);
            vm.page = 1;
    }    
   
};
 vm.groupToPagesFilter = function(data) {
        if(vm.itemsPerPage == null || vm.itemsPerPage == undefined){
            vm.itemsPerPage=vm.RecordsPerPage[0];
        }
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
if(vm.itemsPerPage == null || vm.itemsPerPage == undefined){
            vm.itemsPerPage=vm.RecordsPerPage[0];
        }
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
        vm.CommentHistory=true;
        vm.IsView=true;
        vm.IsReply=false;
        vm.IsResolve=false;
        vm.isReplyHide = false;
        vm.isResolveHide = false;
        vm.isCommentHide = false;
       vm.CancelButton=false;
        vm.ShowComment=false;
        vm.HideComment=false;
        vm.GetDataforReplyResolveFunction(item);
        vm.toggleModalReject(item);
    };
    vm.Reply = function(item) {
        vm.IsView=false;
        vm.IsReply=true;
        vm.IsResolve=false;
        vm.isReplyHide = true;
        vm.isResolveHide = false;
        vm.isCommentHide = true;
        vm.ShowComment=true;
        vm.CommentHistory=false;
        vm.HideComment=false;
        vm.CancelButton=true;
        vm.GetDataforReplyResolveFunction(item);
        vm.toggleModalReject(item);
    };
    vm.toggleModalReject = function(itemToEdit) {
        vm.item = itemToEdit;
        vm.item.Comments = '' ;
        vm.showModal = !vm.showModal;
       // vm.CommentHistory=false;
        //vm.CommentHistoryhide=false;
    
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
                $window.location.reload();
            }, function (sender, arges) {
                alert(arges.get_message());
            });
            vm.showModal = false;
        }
        else{
            alert('Please Enter Comment');
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
        vm.ShowComment=true;
        vm.CommentHistory=false;
        vm.HideComment=false;
         vm.CancelButton=true;
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
             $window.location.reload();
        }, function (sender, arges) {
            alert(arges.get_message());
        });
        vm.showModal = false;
        //vm.showl
        var filter=vm.FinalFilter;
        vm.readlistESPLServiceDesk(filter);
    }
    else{
        alert('Please Enter Comment');
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