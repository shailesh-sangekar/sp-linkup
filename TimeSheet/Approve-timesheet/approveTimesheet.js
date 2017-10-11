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
    vm.getLoggedInUser=function(){
        spcrud.getCurrentUser($http).then(function(LogResponse){
            if(LogResponse.status === 200)
                    var myJSON = JSON.stringify(LogResponse.data.d);
                    vm.loginData=LogResponse.data.d;
                    console.log(vm.loginData);
                    vm.CurrentLoggedInUser = LogResponse.data.d.Title;
                    console.log(vm.CurrentLoggedInUser);
                    vm.readData(vm.CurrentLoggedInUser);
        },function(error){
            console.log('error',error);
        });
    };
    vm.getLoggedInUser();
    vm.readData=function(CurrentLoggedInUser){
        ApproveFilter = 'Approver_x0020_User/Title eq \'' + CurrentLoggedInUser + '\'';
        commentSelect = 'Approver_x0020_User/Title,Pending_x0020_Approver/Title,*';
        commentExpand = 'Approver_x0020_User/Title,Pending_x0020_Approver/Title';
        var Options = {
            select: commentSelect,
            expand: commentExpand,
            filter: ApproveFilter
        };           
spcrud.read($http, vm.EmployeeTimeSheetList,Options).then(function(EmpResponse) {
    if (EmpResponse.status === 200)  
        var myJSON = JSON.stringify(EmpResponse.data.d.results);
        vm.DatalistEMPTimeSheet = EmpResponse.data.d.results;
        console.log(vm.DatalistEMPTimeSheet);
        vm.groupToPages();
        
    },function(error) {
        console.log('error', error);
    });
    
}; 
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
}
angular.module('ApproveTimesheetApp',[]).controller('ApproveTimesheetCtl', ApproveTimesheetCtl );