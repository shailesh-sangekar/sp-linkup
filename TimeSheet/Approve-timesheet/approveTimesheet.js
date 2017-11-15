function ApproveTimesheetCtl($scope,$http, myService) 
{  
    var vm = $scope;
    vm.spinnerloaded = false;
    vm.loaded = false;
    vm.groupedItems = [];
    vm.itemsPerPage = 10;
    vm.pagedItems = [];
    vm.currentPage = 0;
    vm.filteredItems = [];
    vm.EmployeeTimeSheetList='Employee Timesheet';
    vm.TimeSheetList='Timesheet';
    vm.EmployeePersonalDetailsMaster = "Employee Personal Details Master";
    vm.FinancialYearMaster = "Financial Year Master";
    vm.EmployeeLeavesMaster = "Employee Leaves Master";
    vm.getLoggedInUser=function(){
        spcrud.getCurrentUser($http).then(function(LogResponse){
            if(LogResponse.status === 200)
                    var myJSON = JSON.stringify(LogResponse.data.d);
                    vm.loginData=LogResponse.data.d;
                    console.log(vm.loginData);
                    vm.CurrentLoggedInUser = LogResponse.data.d.Title;
                    vm.CurrentLoggedInUserId = LogResponse.data.d.Id;
                    console.log(vm.CurrentLoggedInUser);
                    vm.readData(vm.CurrentLoggedInUser);
        },function(error){
            console.log('error',error);
        });
    };
    vm.getLoggedInUser();
    vm.readData=function(CurrentLoggedInUser){
        statusSubmitted = 'Submitted';
        status = 'Partially Approved';
        var approvedFilter = '(Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\' ) and (Pending_x0020_Approver/Title eq \'' + CurrentLoggedInUser + '\') and (Submitted_x0020_Status eq \'' + statusSubmitted + '\' or Submitted_x0020_Status eq \'' + status + '\')';
       ApproveFilter = '(Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\' ) and (Pending_x0020_Approver/Title eq \'' + CurrentLoggedInUser + '\')';
        commentSelect = 'Approver_x0020_User/Title,Pending_x0020_Approver/Title,Employee/Title,*';
        commentExpand = 'Approver_x0020_User/Title,Pending_x0020_Approver/Title,Employee/Title';
        ModeifiedDate = 'Modified desc';
        count = '100000';
        var Options = {
            select: commentSelect,
            expand: commentExpand,
            orderby: ModeifiedDate,
            top: count,
            filter: approvedFilter
        };           
spcrud.read($http, vm.EmployeeTimeSheetList,Options).then(function(EmpResponse) {
    if (EmpResponse.status === 200)  
        var myJSON = JSON.stringify(EmpResponse.data.d.results);
        vm.DatalistEMPTimeSheet = EmpResponse.data.d.results;
        console.log('vm.DatalistEMPTimeSheet',vm.DatalistEMPTimeSheet);
          timesheetFilter = '(Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\' )';
    timesheetSelect = 'Approver_x0020_User/Title,Project/Title,*';
    timesheetExpand = 'Approver_x0020_User/Title,Project/Title';
    ModeifiedDate = 'Created desc';
    count = '10000';
    var TimesheetOptions = {
    select: timesheetSelect,
       expand: timesheetExpand,
        orderby: ModeifiedDate,
        top: count,
        filter: timesheetFilter
    };  
        spcrud.read($http, vm.TimeSheetList,TimesheetOptions).then(function(EmpResp) {
    if (EmpResp.status === 200)  
    var myJSON = JSON.stringify(EmpResp.data.d.results);
    vm.TimeSheet = EmpResp.data.d.results;
    vm.DatalistEMPTimeSheet.forEach(fItem =>{
        vm.TimeSheet.forEach(tItem =>{
            if(fItem.Id == tItem.Timesheet_x0020_ID){
                fItem.Project_x0020_Timesheet_x0020_St=tItem.Project_x0020_Timesheet_x0020_St;
            }
        })
        
    })
    vm.groupToPages();

    
},function(error) {
    console.log('error', error);
});
    },function(error) {
        console.log('error', error);
    });
    
}; 
vm.readTimesheetData=function(id){
    vm.ItemID=id;
    statusSubmitted = 'Submitted';
    status = 'Partially Approved';
    LoggedInUser = vm.CurrentLoggedInUser;
    var timesheetFilter = '(Timesheet_x0020_ID eq \'' + id + '\' )';
    //timesheetFilter = '(Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\' )';
    timesheetSelect = 'Approver_x0020_User/Title,Project/Title,*';
    timesheetExpand = 'Approver_x0020_User/Title,Project/Title';
    ModeifiedDate = 'Created desc';
    count = '100';
    var OptionsTimesheet = {
    select: timesheetSelect,
       expand: timesheetExpand,
        orderby: ModeifiedDate,
        top: count,
        filter: timesheetFilter
    };           
spcrud.read($http, vm.TimeSheetList,OptionsTimesheet).then(function(Response) {
if (Response.status === 200)  
    var myJSON = JSON.stringify(Response.data.d.results);
    vm.data=Response.data.d.results;
    console.log('vm.data',vm.data);
    vm.data.forEach(ItemData=>{
        if(ItemData.Approver_x0020_User.Title == LoggedInUser){
            vm.DatalistTimeSheet = ItemData;
        }
    }) 
    console.log('vm.DatalistTimeSheet',vm.DatalistTimeSheet);
  dategiven=vm.DatalistTimeSheet.Start_x0020_Date;
   anyday=new Date(dategiven);
   datee=vm.convert(dategiven);
   vm.Monday=moment(moment(dategiven)).format('DD-MM-YYYY');
   vm.Tuesday=moment(moment(moment(dategiven)).add('days', 1)).format('DD-MM-YYYY');
   vm.Wednesday=moment(moment(moment(dategiven)).add('days', 2)).format('DD-MM-YYYY');
   vm.Thursday=moment(moment(moment(dategiven)).add('days', 3)).format('DD-MM-YYYY');
   vm.Friday=moment(moment(moment(dategiven)).add('days', 4)).format('DD-MM-YYYY');
   vm.Saturday=moment(moment(moment(dategiven)).add('days', 5)).format('DD-MM-YYYY');
   vm.Sunday=moment(moment(moment(dategiven)).add('days', 6)).format('DD-MM-YYYY');
   vm.monTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Mondayhrs,vm.DatalistTimeSheet.Mondaynbhrs);
   vm.tueTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Tuesdayhrs,vm.DatalistTimeSheet.Tuesdaynbhrs);
   vm.wedTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Wednesdayhrs,vm.DatalistTimeSheet.Wednesdaynbhrs);
   vm.thurTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Thursdayhrs,vm.DatalistTimeSheet.Thursdaynbhrs);
   vm.friTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Fridayhrs,vm.DatalistTimeSheet.Fridaynbhrs);
   vm.satTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Saturdayhrs,vm.DatalistTimeSheet.Saturdaynbhrs);
   vm.sunTotalTime=vm.CalculateTime(vm.DatalistTimeSheet.Sundayhrs,vm.DatalistTimeSheet.Sundaynbhrs);
   vm.TotalBillableHr=vm.CalaculateBillableTime();
   vm.TotalNonBillableHr=vm.CalaculateNonBillableTime();
   vm.TotalHr=vm.CalculateTotalTime(vm.TotalBillableHr,vm.TotalNonBillableHr);

},function(error) {
    console.log('error', error);
});

}; 
vm.CalculateTotalTime=function(time1,time2){
    vm.Total = '';
    if(time1 != null && time2 != null){
        const [hr2,min2] = time2.split(':');
        vm.time=(moment(time1,"HH:mm").add('minute',min2).format('HH:mm') );
        const [hr1,min1] = vm.time.split(':');
       var abc=parseFloat(hr1)+parseFloat(hr2);
       vm.Total = +abc +':' + min2;;
        return vm.Total;
    }
    else{
        if(time1 != null){
            vm.Total = time1;
            return vm.Total;
        } else if(time2 != null){
            vm.Total = time2;
            return vm.Total;
        } else{
            return vm.Total;
        }
    }
}
vm.CalaculateBillableTime =function(){
    vm.totalbillable='00:00';
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Mondayhrs);
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Tuesdayhrs);
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Wednesdayhrs);
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Thursdayhrs);
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Fridayhrs);
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Saturdayhrs);
    vm.totalbillable=vm.CalculateTime(vm.totalbillable,vm.DatalistTimeSheet.Sundayhrs);
    return vm.totalbillable;
}
vm.CalaculateNonBillableTime =function(){
    vm.totalnonbillable='00:00';
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Mondaynbhrs);
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Tuesdaynbhrs);
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Wednesdaynbhrs);
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Thursdaynbhrs);
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Fridaynbhrs);
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Saturdaynbhrs);
    vm.totalnonbillable=vm.CalculateTotalTime(vm.totalnonbillable,vm.DatalistTimeSheet.Sundaynbhrs);
    return vm.totalnonbillable;
}
vm.CalculateTime=function(time1,time2){
    vm.timeTotal = '';
    if(time1 != null && time2 != null){
        const [hr1,min1] = time2.split(':');
        vm.time=(moment(time1,"HH:mm").add('hours',hr1).format('HH:mm') );
        vm.timeTotal=(moment(vm.time,"HH:mm").add('minute',min1).format('HH:mm') );
        return vm.timeTotal;
    }
    else{
        if(time1 != null){
            vm.timeTotal = time1;
            return vm.timeTotal;
        } else if(time2 != null){
            vm.timeTotal = time2;
            return vm.timeTotal;
        } else{
            return vm.timeTotal;
        }
    }
}

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

    for (var i = 0; i < vm.DatalistEMPTimeSheet.length; i++) {
        if (i % vm.itemsPerPage === 0) {
            vm.pagedItems[Math.floor(i / vm.itemsPerPage)] = [vm.DatalistEMPTimeSheet[i]];
        } else {
            vm.pagedItems[Math.floor(i / vm.itemsPerPage)].push(vm.DatalistEMPTimeSheet[i]);
        }
    }
    vm.spinnerloaded=true;
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
vm.filterItems= function(filterText){
    vm.filterText=filterText;
    var data = $filter('filter')(vm.DatalistEMPTimeSheet,vm.filterText, false,'Title');
    vm.groupToPagesFilter(data);
    vm.page = 1;
 
};
var count=10;
vm.showFIlter=function(count){
    vm.itemsPerPage=count;
    vm.groupToPagesFilter(vm.DatalistEMPTimeSheet);
    vm.page = 1;
}
vm.ShowModal = function(item) {
    //vm.GetDataforReplyResolveFunction(item);
    vm.employeeTimesheet = item;
    console.log('vm.employeeTimesheet',vm.employeeTimesheet);
    vm.toggleModalReject(item);
    vm.readTimesheetData(item.Id);
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
vm.convert=function(str) {
    var date = new Date(str),
        mnth = ("0" + (date.getMonth()+1)).slice(-2),
        day  = ("0" + date.getDate()).slice(-2);
    return [ day, mnth, date.getFullYear() ].join("-");
}
vm.Approve=function(data){
    var Id = vm.DatalistTimeSheet.Id;
    timesheetId=vm.DatalistTimeSheet.Timesheet_x0020_ID;
    LoggedInUser = vm.CurrentLoggedInUser;
    var approveTimesheetFilter = '(Timesheet_x0020_ID eq \'' + Id + '\' ) and (Approver_x0020_User/Title eq \'' + LoggedInUser + '\' )';
    comments=data;
    var approveFiltertimesheet = {
            filter: approveTimesheetFilter
        };   
    spcrud.update($http, vm.TimeSheetList, Id, {
        'Project_x0020_Timesheet_x0020_St': 'Approved',
        'Approver_x0020_Comment':data
    }).then(function (resp) {
        var timesheetFilter = '(Timesheet_x0020_ID eq \'' + vm.ItemID + '\' )';
        //timesheetFilter = '(Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\' )';
        timesheetSelect = 'Approver_x0020_User/Title,Project/Title,*';
        timesheetExpand = 'Approver_x0020_User/Title,Project/Title';
        ModeifiedDate = 'Created desc';
        count = '100';
        var OptionsTimesheet = {
        select: timesheetSelect,
           expand: timesheetExpand,
            orderby: ModeifiedDate,
            top: count,
            filter: timesheetFilter
        };           
    spcrud.read($http, vm.TimeSheetList,OptionsTimesheet).then(function(Response) {
    if (Response.status === 200)  
        var myJSON = JSON.stringify(Response.data.d.results);
        vm.AllTimesheetOfEmployee=Response.data.d.results;
        vm.AllTimesheetOfEmployee.forEach(ItemData=>{
            if(ItemData.Approver_x0020_User.Title == LoggedInUser){
                vm.DatalistTimeSheet = ItemData;
            }
        }) 
        console.log(vm.AllTimesheetOfEmployee);  
        approvedTimesheetsCount = 0;
        rejectedTimesheetsCount = 0;
        submittedTimesheetsCount = 0;
        vm.AllTimesheetOfEmployee.forEach(f => {
            if (f.Project_x0020_Timesheet_x0020_St == "Approved") {
                approvedTimesheetsCount = approvedTimesheetsCount + 1;
            } else if(f.Project_x0020_Timesheet_x0020_St == "Rejected") {
                rejectedTimesheetsCount = rejectedTimesheetsCount + 1;
            } else if(f.Project_x0020_Timesheet_x0020_St == "Submitted") {
                submittedTimesheetsCount = submittedTimesheetsCount + 1;
            }
        });
        if (submittedTimesheetsCount != 0)
        {
            if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount != 0)
            {
                vm.employeeTimesheet.Email_x0020_Status = false;
                vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
            }
            if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount == 0)
            {
                vm.employeeTimesheet.Submitted_x0020_Status = "Partially Approved";
            }
            if (approvedTimesheetsCount == 0 && rejectedTimesheetsCount != 0)
            {
                vm.employeeTimesheet.Email_x0020_Status = false;
                vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
            }
            if (approvedTimesheetsCount == 0 && rejectedTimesheetsCount == 0)
            {
                vm.employeeTimesheet.Submitted_x0020_Status = "Submitted";

                ////
               // vm.AccruedLeavesForCurrentEmployee();
              
                 
                 
            }
           
        }
        else if (submittedTimesheetsCount == 0)
        {
            if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount != 0)
            {
                vm.employeeTimesheet.Email_x0020_Status = false;
                vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
            }
            if (approvedTimesheetsCount == 0 && rejectedTimesheetsCount != 0)
            {
                vm.employeeTimesheet.Email_x0020_Status = false;
                vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
            }
            if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount == 0)
            {
                vm.employeeTimesheet.Email_x0020_Status = false;
                vm.employeeTimesheet.Submitted_x0020_Status = "Approved";
                vm.employeeTimesheet.Timesheet_x0020_Approved_x0020_D = new Date();

                ///Accrued Employee's leave
                //vm.AccruedLeavesForCurrentEmployee(vm.employeeTimesheet, vm.AllTimesheetOfEmployee);
                emptimesheet=vm.employeeTimesheet;
                allTimesheet= vm.AllTimesheetOfEmployee;
                var empFilter = '(Employee_x0020_ID eq \'' + emptimesheet.Title + '\' )';
                empListSelect = 'Designation/Title,*';
                empListExpand = 'Designation/Title';
                
                     var EmpOptions = {
                        filter: empFilter,
                        select: empListSelect,
                        expand: empListExpand
                     };           
             spcrud.read($http, vm.EmployeePersonalDetailsMaster,EmpOptions).then(function(Resp) {
                 if (Resp.status === 200)  
                     var myJSON = JSON.stringify(Resp.data.d.results);
                     vm.Emplist = Resp.data.d.results[0];
                     EmpDOJ = vm.Emplist.DOJ;
                     EmpDOJ = "2017-09-18T18:30:00Z";
                    EmpDesignation = vm.Emplist.Designation.Title;
                   weekStartDate = emptimesheet.Start_x0020_Date;
                   weekEndDate= emptimesheet.End_x0020_Date;
                 EmployeeeName = emptimesheet.Employee.Title;
                     MondayCount = 1.0, TuesdayCount = 1.0, WednesdayCount = 1.0, ThursdayCount = 1.0, FridayCount = 1.0, SaturdayCount = 1.0, SundayCount = 1.0;
                     LeavesCount = 0.0, TotalDaysPresent = 0.0, midWeekJoinNonWorkingday = 0.0;
                     if (allTimesheet.length > 0)
                    {
                        //find if project type is leave 
                        allTimesheet.forEach(TimesheetItem => 
                        {
                            var TaskName = TimesheetItem.Task;
                            //Get project value
                            var ProjectName = TimesheetItem.Project.Title;
                            var pro=ProjectName.toLowerCase();
                            //if yes then check which type of leave and calculate accordingly
                            if (ProjectName != null && angular.equals(ProjectName.toLowerCase(), "leave"))
                            {
                                if (TaskName != null)
                                {
                                    if (angular.equals(TaskName.toLowerCase(), "leave"))
                                    {
                                        LeavesCount += 0.0;
                                    }
                                    if (angular.equals(TaskName.toLowerCase(), "halfday leave"))
                                    {
                                        LeavesCount += 0.0;
                                    }
                                    if (angular.equals(TaskName.toLowerCase(), "absent"))
                                    {
                                        LeavesCount += 1.0;
                                    }
                                    if (angular.equals(TaskName.toLowerCase(), "halfday absent"))
                                    {
                                        LeavesCount += 0.5;
                                    }
                                    if (angular.equals(TaskName.toLowerCase(), "holiday floating"))
                                    {
                                        LeavesCount += 0.0;
                                    }
                                }
                            }
                            else
                            {
                                //else check for each record if there is entry for each day of the week
                                if ( (TimesheetItem.Mondayhrs != null) || (TimesheetItem.Mondaynbhrs != null))
                                {
                                    MondayCount = 1.0;
                                }
                                if ((TimesheetItem.Tuesdayhrs != null) || (TimesheetItem.Tuesdaynbhrs != null))
                                {
                                    TuesdayCount = 1.0;
                                }
                                if ((TimesheetItem.Wednesdayhrs != null) || (TimesheetItem.Wednesdaynbhrs != null))
                                {
                                    WednesdayCount = 1.0;
                                }
                                if ((TimesheetItem.Thursdayhrs != null) || (TimesheetItem.Thursdaynbhrs != null))
                                {
                                    ThursdayCount = 1.0;
                                }
                                if ((TimesheetItem.Fridayhrs != null) || (TimesheetItem.Fridaynbhrs != null))
                                {
                                    FridayCount = 1.0;
                                }
                                if ((TimesheetItem.Saturdayhrs != null) || (TimesheetItem.Saturdaynbhrs != null))
                                {
                                    SaturdayCount = 1.0;
                                }
                                if ((TimesheetItem.Sundayhrs != null) || (TimesheetItem.Sundaynbhrs != null))
                                {
                                    SundayCount = 1.0;
                                }
                            }
                        })
                    }
                    if (weekEndDate <= EmpDOJ || weekStartDate <= EmpDOJ)
                    {
                     midWeekJoinNonWorkingday = 0;
                     for (i = 0; i < 7; i++) //Monday to sunday
                     {
                         weekstart= moment(weekStartDate).add('days', i).format("YYYY-MM-DDTHH:mm:ssZ");
                         if (weekstart < EmpDOJ)
                         {
                             midWeekJoinNonWorkingday++;
                         }
                     }
                    }
                    TotalDaysPresent = MondayCount + TuesdayCount + WednesdayCount + ThursdayCount + FridayCount + SaturdayCount + SundayCount - LeavesCount - midWeekJoinNonWorkingday;
                    statusCurrent = "Current";
                    var statusFilter = '(Status eq \'' + statusCurrent + '\' )';
                    var FinancialYearOptions = { 
                        filter: statusFilter
                    };           
            spcrud.read($http, vm.FinancialYearMaster,FinancialYearOptions).then(function(FinYearResponse) {
                if (FinYearResponse.status === 200)  
                    var myJSON = JSON.stringify(FinYearResponse.data.d.results);
                    vm.FinYear = FinYearResponse.data.d.results[0];
                    currentFinancialYear=vm.FinYear.Title;
                    console.log(vm.FinYear);
                    var leavesFilter = '(Year eq \'' + currentFinancialYear + '\' ) and (Employee_x0020_ID eq \'' + emptimesheet.Title + '\' )';
                    var leavesFilterOptions = { 
                        filter: leavesFilter
                    };  
                    spcrud.read($http, vm.EmployeeLeavesMaster,leavesFilterOptions).then(function(empLeavesResponse) {
                     if (empLeavesResponse.status === 200)  
                         var myJSON = JSON.stringify(empLeavesResponse.data.d.results);
                         vm.employeeLeavesMasterData = empLeavesResponse.data.d.results[0];
                         console.log('Employee Leaves Master',vm.employeeLeavesMasterData);
                         if (angular.equals(EmpDesignation.toLowerCase(), "trainee"))
                         {
                             vm.employeeLeavesMasterData.Year_x0020_Start_x0020_Date = vm.FinYear.Start_x0020_Date;
                             vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date = vm.FinYear.End_x0020_Date;
                             vm.employeeLeavesMasterData.Accrued_x0020_Leave = vm.employeeLeavesMasterData.Accrued_x0020_Leave + 0; //Trainee can not accrues leave
                             ///NOTE:: Commenting this functionality as Floating Leave functionality is deprecated. - Shailesh S.
                             /// employeeLeavesMasterData._FloatingHolidayBalance = employeeLeavesMasterData.FloatingHolidayBalance + (TotalDaysPresent * LeaveAccrualNumbers.FloatingLeave);
             
                             ///****Linkup calculation****/
                             /// UpdateLeavesAccrued(currentFinancialYear, 0, EmployeeUser.User, TotalDaysPresent * (0.016));
                         }
                         else
                         {
             
                             vm.employeeLeavesMasterData.Year_x0020_Start_x0020_Date = vm.FinYear.Start_x0020_Date;
                             vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date = vm.FinYear.End_x0020_Date;
                             vm.employeeLeavesMasterData.Accrued_x0020_Leave = (parseFloat(vm.employeeLeavesMasterData.Accrued_x0020_Leave) + (TotalDaysPresent * 0.049)).toString(); //Trainee doen't can not accrues leave
                             ///NOTE:: Commenting this functionality as Floating Leave functionality is deprecated. - Shailesh S.
                             /// employeeLeavesMasterData._FloatingHolidayBalance = employeeLeavesMasterData.FloatingHolidayBalance + (TotalDaysPresent * LeaveAccrualNumbers.FloatingLeave);
             
                             ///****Linkup calculation****/
                             /// UpdateLeavesAccrued(currentFinancialYear, TotalDaysPresent * (0.049), EmployeeUser.User, TotalDaysPresent * (0.016));
                         }
                         spcrud.update($http, vm.EmployeeLeavesMaster, vm.employeeLeavesMasterData.ID, {
                             'Year_x0020_Start_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_Start_x0020_Date,
                             'Year_x0020_End_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date
                           //  'Accrued_x0020_Leave': vm.employeeLeavesMasterData.Accrued_x0020_Leave
                         }).then(function (response) {
                             if (response.status === 204) {
                                vm.pendingApproverId = [];
                                vm.employeeTimesheet.Pending_x0020_ApproverId.results.forEach(item=>{
                                    if(item != vm.CurrentLoggedInUserId){
                                        vm.pendingApproverId.push(item);
                                    }
                            })
                            vm.pendingApprover = [];
                            vm.employeeTimesheet.Pending_x0020_Approver.results.forEach(item=>{
                                if(item.Title != vm.CurrentLoggedInUser){
                                    vm.pendingApprover.push(item.Title);
                                }
                        })
                        pendingApprover=parseFloat(vm.pendingApproverId.toString());
                        //pendingApproverName=vm.pendingApprover[0].Title.toString();
                        vm.NEwpendingApproverId = [];
                            console.log('vm.pendingApprover',vm.pendingApprover);
                            vm.employeeTimesheet.Pending_x0020_ApproverId.results=pendingApprover;
                            vm.employeeTimesheet.Pending_x0020_Approver.results=vm.pendingApprover;
                                console.log('emp',vm.employeeTimesheet);
                                    spcrud.update($http, vm.EmployeeTimeSheetList, vm.employeeTimesheet.ID, {
                                                        'Pending_x0020_ApproverId':{'results': vm.pendingApproverId},
                                                       // 'Pending_x0020_Approver': vm.pendingApprover,
                                                          'Year_x0020_End_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date
                                                        // 'Accrued_x0020_Leave': vm.employeeLeavesMasterData.Accrued_x0020_Leave
                                                     }).then(function (response) {
                                                         if (response.status === 204) {
                                     
                                                         }
                                                     }, function (error) {
                                                         console.log('error', error);
                                                     });
                             }
                         }, function (error) {
                             console.log('error', error);
                         });
                     },function(error) {
                         console.log('error', error);
                     });
                },function(error) {
                    console.log('error', error);
                });
         
                    console.log(vm.Emplist);   
                 },function(error) {
                     console.log('error', error);
                 });  
            }
            
        }
        vm.pendingApproverId = [];
        vm.employeeTimesheet.Pending_x0020_ApproverId.results.forEach(item=>{
            if(item != vm.CurrentLoggedInUserId){
                vm.pendingApproverId.push(item);
            }
    })
    vm.pendingApprover = [];
    vm.employeeTimesheet.Pending_x0020_Approver.results.forEach(item=>{
        if(item.Title != vm.CurrentLoggedInUser){
            vm.pendingApprover.push(item);
        }
})
    console.log('vm.pendingApprover',vm.pendingApprover);
    vm.employeeTimesheet.Pending_x0020_ApproverId.results=vm.pendingApproverId;
    vm.employeeTimesheet.Pending_x0020_Approver.results=vm.pendingApprover;
        console.log('emp',vm.employeeTimesheet);
            // spcrud.update($http, vm.EmployeeTimeSheetList, vm.employeeTimesheet.ID, {
            //                      'Pending_x0020_ApproverId': vm.pendingApproverId,
            //                      'Year_x0020_End_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date,
            //                      'Accrued_x0020_Leave': vm.employeeLeavesMasterData.Accrued_x0020_Leave
            //                  }).then(function (response) {
            //                      if (response.status === 204) {
             //                         alert("Approved successfully.");
            //                      }
            //                  }, function (error) {
            //                      console.log('error', error);
            //                  });          
        alert("Approved successfully.");
    });
      
    }, function (error) {
        console.log('error', error);
    });
}
vm.Reject=function(comment){
    var Id = vm.DatalistTimeSheet.Id;
    spcrud.update($http, vm.TimeSheetList, Id, {
        'Project_x0020_Timesheet_x0020_St': 'Rejected',
        'Approver_x0020_Comment':comment
    }).then(function (response) {
        if (response.status === 204) {
            var timesheetFilter = '(Timesheet_x0020_ID eq \'' + vm.ItemID + '\' )';
            //timesheetFilter = '(Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\' )';
            timesheetSelect = 'Approver_x0020_User/Title,Project/Title,*';
            timesheetExpand = 'Approver_x0020_User/Title,Project/Title';
            ModeifiedDate = 'Created desc';
            count = '100';
            var OptionsTimesheet = {
            select: timesheetSelect,
               expand: timesheetExpand,
                orderby: ModeifiedDate,
                top: count,
                filter: timesheetFilter
            };           
        spcrud.read($http, vm.TimeSheetList,OptionsTimesheet).then(function(Response) {
                if (Response.status === 200)
                var myJSON = JSON.stringify(Response.data.d.results);
                vm.AllTimesheetOfEmployee=Response.data.d.results;
                vm.AllTimesheetOfEmployee.forEach(ItemData=>{
                    if(ItemData.Approver_x0020_User.Title == LoggedInUser){
                        vm.DatalistTimeSheet = ItemData;
                    }
                }) 
                console.log(vm.AllTimesheetOfEmployee);  
                approvedTimesheetsCount = 0;
                rejectedTimesheetsCount = 0;
                submittedTimesheetsCount = 0;
                vm.AllTimesheetOfEmployee.forEach(f => {
                    if (f.Project_x0020_Timesheet_x0020_St == "Approved") {
                        approvedTimesheetsCount = approvedTimesheetsCount + 1;
                    } else if(f.Project_x0020_Timesheet_x0020_St == "Rejected") {
                        rejectedTimesheetsCount = rejectedTimesheetsCount + 1;
                    }
                });
                vm.AllTimesheetOfEmployee.forEach(f => {
                    if (f.Project_x0020_Timesheet_x0020_St == "Submitted") {
                    spcrud.update($http, vvm.TimeSheetList, f.Id,{
                        'Project_x0020_Timesheet_x0020_St': 'Rejected',
                        'Approver_x0020_Comment':data
                             }).then(function (response) {
                                 if (response.status === 204) {
             
                                 }
                             }, function (error) {
                                 console.log('error', error);
                             });          
                    }
                });
                if (submittedTimesheetsCount != 0)
                {
                    if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount != 0)
                    {
                        vm.employeeTimesheet.Email_x0020_Status = false;
                        vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
                    }
                    if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount == 0)
                    {
                        vm.employeeTimesheet.Submitted_x0020_Status = "PartiallyApproved";
                    }
                    if (approvedTimesheetsCount == 0 && rejectedTimesheetsCount == 0)
                    {
                        vm.employeeTimesheet.Submitted_x0020_Status = "Submitted";
                    }
                    if (approvedTimesheetsCount == 0 && rejectedTimesheetsCount != 0)
                    {
                        vm.employeeTimesheet.Email_x0020_Status = false;
                        vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
                    }
                }
                else if (submittedTimesheetsCount == 0)
                {
                    if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount != 0)
                    {
                        vm.employeeTimesheet.Email_x0020_Status = false;
                        vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
                    }
                    if (approvedTimesheetsCount == 0 && rejectedTimesheetsCount != 0)
                    {
                        vm.employeeTimesheet.Email_x0020_Status = false;
                        vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
                    }
                    if (approvedTimesheetsCount != 0 && rejectedTimesheetsCount == 0)
                    {
                        vm.employeeTimesheet.Email_x0020_Status = false;
                        vm.employeeTimesheet.Submitted_x0020_Status = "Rejected";
                        vm.employeeTimesheet.Timesheet_x0020_Approved_x0020_D = new Date();
    
                        ///Accrued Employee's leave
                        emptimesheet=vm.employeeTimesheet;
                        allTimesheet= vm.AllTimesheetOfEmployee;
                        var empFilter = '(Employee_x0020_ID eq \'' + emptimesheet.Title + '\' )';
                        empListSelect = 'Designation/Title,*';
                        empListExpand = 'Designation/Title';
                        
                             var EmpOptions = {
                                filter: empFilter,
                                select: empListSelect,
                                expand: empListExpand
                             };           
                     spcrud.read($http, vm.EmployeePersonalDetailsMaster,EmpOptions).then(function(Resp) {
                         if (Resp.status === 200)  
                             var myJSON = JSON.stringify(Resp.data.d.results);
                             vm.Emplist = Resp.data.d.results[0];
                             EmpDOJ = vm.Emplist.DOJ;
                             EmpDOJ = "2017-09-18T18:30:00Z";
                            EmpDesignation = vm.Emplist.Designation.Title;
                           weekStartDate = emptimesheet.Start_x0020_Date;
                           weekEndDate= emptimesheet.End_x0020_Date;
                         EmployeeeName = emptimesheet.Employee.Title;
                             MondayCount = 1.0, TuesdayCount = 1.0, WednesdayCount = 1.0, ThursdayCount = 1.0, FridayCount = 1.0, SaturdayCount = 1.0, SundayCount = 1.0;
                             LeavesCount = 0.0, TotalDaysPresent = 0.0, midWeekJoinNonWorkingday = 0.0;
                             if (allTimesheet.length > 0)
                            {
                                //find if project type is leave 
                                allTimesheet.forEach(TimesheetItem => 
                                {
                                    var TaskName = TimesheetItem.Task;
                                    //Get project value
                                    var ProjectName = TimesheetItem.Project.Title;
                                    var pro=ProjectName.toLowerCase();
                                    //if yes then check which type of leave and calculate accordingly
                                    if (ProjectName != null && angular.equals(ProjectName.toLowerCase(), "leave"))
                                    {
                                        if (TaskName != null)
                                        {
                                            if (angular.equals(TaskName.toLowerCase(), "leave"))
                                            {
                                                LeavesCount += 0.0;
                                            }
                                            if (angular.equals(TaskName.toLowerCase(), "halfday leave"))
                                            {
                                                LeavesCount += 0.0;
                                            }
                                            if (angular.equals(TaskName.toLowerCase(), "absent"))
                                            {
                                                LeavesCount += 1.0;
                                            }
                                            if (angular.equals(TaskName.toLowerCase(), "halfday absent"))
                                            {
                                                LeavesCount += 0.5;
                                            }
                                            if (angular.equals(TaskName.toLowerCase(), "holiday floating"))
                                            {
                                                LeavesCount += 0.0;
                                            }
                                        }
                                    }
                                    else
                                    {
                                        //else check for each record if there is entry for each day of the week
                                        if ( (TimesheetItem.Mondayhrs != null) || (TimesheetItem.Mondaynbhrs != null))
                                        {
                                            MondayCount = 1.0;
                                        }
                                        if ((TimesheetItem.Tuesdayhrs != null) || (TimesheetItem.Tuesdaynbhrs != null))
                                        {
                                            TuesdayCount = 1.0;
                                        }
                                        if ((TimesheetItem.Wednesdayhrs != null) || (TimesheetItem.Wednesdaynbhrs != null))
                                        {
                                            WednesdayCount = 1.0;
                                        }
                                        if ((TimesheetItem.Thursdayhrs != null) || (TimesheetItem.Thursdaynbhrs != null))
                                        {
                                            ThursdayCount = 1.0;
                                        }
                                        if ((TimesheetItem.Fridayhrs != null) || (TimesheetItem.Fridaynbhrs != null))
                                        {
                                            FridayCount = 1.0;
                                        }
                                        if ((TimesheetItem.Saturdayhrs != null) || (TimesheetItem.Saturdaynbhrs != null))
                                        {
                                            SaturdayCount = 1.0;
                                        }
                                        if ((TimesheetItem.Sundayhrs != null) || (TimesheetItem.Sundaynbhrs != null))
                                        {
                                            SundayCount = 1.0;
                                        }
                                    }
                                })
                            }
                            if (weekEndDate <= EmpDOJ || weekStartDate <= EmpDOJ)
                            {
                             midWeekJoinNonWorkingday = 0;
                             for (i = 0; i < 7; i++) //Monday to sunday
                             {
                                 weekstart= moment(weekStartDate).add('days', i).format("YYYY-MM-DDTHH:mm:ssZ");
                                 if (weekstart < EmpDOJ)
                                 {
                                     midWeekJoinNonWorkingday++;
                                 }
                             }
                            }
                            TotalDaysPresent = MondayCount + TuesdayCount + WednesdayCount + ThursdayCount + FridayCount + SaturdayCount + SundayCount - LeavesCount - midWeekJoinNonWorkingday;
                            statusCurrent = "Current";
                            var statusFilter = '(Status eq \'' + statusCurrent + '\' )';
                            var FinancialYearOptions = { 
                                filter: statusFilter
                            };           
                    spcrud.read($http, vm.FinancialYearMaster,FinancialYearOptions).then(function(FinYearResponse) {
                        if (FinYearResponse.status === 200)  
                            var myJSON = JSON.stringify(FinYearResponse.data.d.results);
                            vm.FinYear = FinYearResponse.data.d.results[0];
                            currentFinancialYear=vm.FinYear.Title;
                            console.log(vm.FinYear);
                            var leavesFilter = '(Year eq \'' + currentFinancialYear + '\' ) and (Employee_x0020_ID eq \'' + emptimesheet.Title + '\' )';
                            var leavesFilterOptions = { 
                                filter: leavesFilter
                            };  
                            spcrud.read($http, vm.EmployeeLeavesMaster,leavesFilterOptions).then(function(empLeavesResponse) {
                             if (empLeavesResponse.status === 200)  
                                 var myJSON = JSON.stringify(empLeavesResponse.data.d.results);
                                 vm.employeeLeavesMasterData = empLeavesResponse.data.d.results[0];
                                 console.log('Employee Leaves Master',vm.employeeLeavesMasterData);
                                 if (angular.equals(EmpDesignation.toLowerCase(), "trainee"))
                                 {
                                     vm.employeeLeavesMasterData.Year_x0020_Start_x0020_Date = vm.FinYear.Start_x0020_Date;
                                     vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date = vm.FinYear.End_x0020_Date;
                                     vm.employeeLeavesMasterData.Accrued_x0020_Leave = vm.employeeLeavesMasterData.Accrued_x0020_Leave + 0; //Trainee can not accrues leave
                                     ///NOTE:: Commenting this functionality as Floating Leave functionality is deprecated. - Shailesh S.
                                     /// employeeLeavesMasterData._FloatingHolidayBalance = employeeLeavesMasterData.FloatingHolidayBalance + (TotalDaysPresent * LeaveAccrualNumbers.FloatingLeave);
                     
                                     ///****Linkup calculation****/
                                     /// UpdateLeavesAccrued(currentFinancialYear, 0, EmployeeUser.User, TotalDaysPresent * (0.016));
                                 }
                                 else
                                 {
                     
                                     vm.employeeLeavesMasterData.Year_x0020_Start_x0020_Date = vm.FinYear.Start_x0020_Date;
                                     vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date = vm.FinYear.End_x0020_Date;
                                     vm.employeeLeavesMasterData.Accrued_x0020_Leave = (parseFloat(vm.employeeLeavesMasterData.Accrued_x0020_Leave) + (TotalDaysPresent * 0.049)).toString(); //Trainee doen't can not accrues leave
                                     ///NOTE:: Commenting this functionality as Floating Leave functionality is deprecated. - Shailesh S.
                                     /// employeeLeavesMasterData._FloatingHolidayBalance = employeeLeavesMasterData.FloatingHolidayBalance + (TotalDaysPresent * LeaveAccrualNumbers.FloatingLeave);
                     
                                     ///****Linkup calculation****/
                                     /// UpdateLeavesAccrued(currentFinancialYear, TotalDaysPresent * (0.049), EmployeeUser.User, TotalDaysPresent * (0.016));
                                 }
                                 spcrud.update($http, vm.EmployeeLeavesMaster, vm.employeeLeavesMasterData.ID, {
                                     'Year_x0020_Start_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_Start_x0020_Date,
                                     'Year_x0020_End_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date
                                   //  'Accrued_x0020_Leave': vm.employeeLeavesMasterData.Accrued_x0020_Leave
                                 }).then(function (response) {
                                     if (response.status === 204) {
                                        vm.pendingApproverId = [];
                                        vm.employeeTimesheet.Pending_x0020_ApproverId.results.forEach(item=>{
                                            if(item != vm.CurrentLoggedInUserId){
                                                vm.pendingApproverId.push(item);
                                            }
                                    })
                                    vm.pendingApprover = [];
                                    vm.employeeTimesheet.Pending_x0020_Approver.results.forEach(item=>{
                                        if(item.Title != vm.CurrentLoggedInUser){
                                            vm.pendingApprover.push(item.Title);
                                        }
                                })
                                pendingApprover=parseFloat(vm.pendingApproverId.toString());
                                //pendingApproverName=vm.pendingApprover[0].Title.toString();
                                vm.NEwpendingApproverId = [];
                                    console.log('vm.pendingApprover',vm.pendingApprover);
                                    vm.employeeTimesheet.Pending_x0020_ApproverId.results=pendingApprover;
                                    vm.employeeTimesheet.Pending_x0020_Approver.results=vm.pendingApprover;
                                        console.log('emp',vm.employeeTimesheet);
                                            spcrud.update($http, vm.EmployeeTimeSheetList, vm.employeeTimesheet.ID, {
                                                                'Pending_x0020_ApproverId':{'results': vm.pendingApproverId},
                                                               // 'Pending_x0020_Approver': vm.pendingApprover,
                                                                //  'Year_x0020_End_x0020_Date': vm.employeeLeavesMasterData.Year_x0020_End_x0020_Date
                                                                // 'Accrued_x0020_Leave': vm.employeeLeavesMasterData.Accrued_x0020_Leave
                                                             }).then(function (response) {
                                                                 if (response.status === 204) {
                                             
                                                                 }
                                                             }, function (error) {
                                                                 console.log('error', error);
                                                             });
                                     }
                                 }, function (error) {
                                     console.log('error', error);
                                 });
                             },function(error) {
                                 console.log('error', error);
                             });
                        },function(error) {
                            console.log('error', error);
                        });
                 
                            console.log(vm.Emplist);   
                         },function(error) {
                             console.log('error', error);
                         }); 
                    }
                    
                }
                vm.pendingApproverId = [];
                vm.employeeTimesheet.Pending_x0020_ApproverId.results.forEach(item=>{
                    if(item != vm.CurrentLoggedInUserId){
                        vm.pendingApproverId.push(item);
                    }
            })
            vm.pendingApprover = [];
            vm.employeeTimesheet.Pending_x0020_Approver.results.forEach(item=>{
                if(item.Title != vm.CurrentLoggedInUser){
                    vm.pendingApprover.push(item);
                }
        })
            console.log('vm.pendingApprover',vm.pendingApprover);
            vm.employeeTimesheet.Pending_x0020_ApproverId.results=vm.pendingApproverId;
            vm.employeeTimesheet.Pending_x0020_Approver.results=vm.pendingApprover;
           // console.log('emp',vm.employeeTimesheet);
            spcrud.update($http, vm.EmployeeTimeSheetList, vm.employeeTimesheet.ID, {
                'Pending_x0020_ApproverId' : { "'results'" : vm.pendingApproverId },
                //'Pending_x0020_ApproverId': vm.pendingApproverId,
                'Submitted_x0020_Status' : 'Rejected'
            }).then(function (response) {
            if (response.status === 204) 
                {
                    alert("Approved successfully.");
                }
            }, function (error) {
                console.log('error', error);
            });                     
            }, function (error) {
                console.log('error', error);
            });
        }
    }, function (error) {
        console.log('error', error);
    });        
}   
}
function modal() {
    return {
        template: '<div class="modal fade" data-backdrop="static">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content scrollModal" style="height:600px;width: 216%;margin-left: -347px;">' +
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
angular.module('ApproveTimesheetApp',[]).controller('ApproveTimesheetCtl', ApproveTimesheetCtl ).directive('modal', modal);