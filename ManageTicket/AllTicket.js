function AllTicketCtl($scope, $http, $timeout) {
    var vm = $scope;
    vm.spinnerloaded = false;
    vm.loaded = false;
    vm.listESPLServiceDesk = 'ESPL Service Desk';
    vm.listESPLServiceDepartments = 'ESPL Service Departments';
    vm.listServiceDeskComments = 'Service Desk Comments';
    vm.Authorised = false;
    vm.NotAuthorised = false;
    vm.groupedItems = [];
    vm.itemsPerPage = 5;
    vm.pagedItems = [];
    vm.currentPage = 0;
    vm.mod = '';

    Resigned = 'Resigned';


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
        empSelect = 'Employee/Title,Department/Department,Editor/Title,Author/Title,Predefined_x0020_Concern/Predefined_x0020_Concern,*';
        empExpand = 'Employee/Title,Department/Department,Editor/Title,Author/Title,Predefined_x0020_Concern/Predefined_x0020_Concern';
        CreatedDate = 'Created desc';
        count = '1000';
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
            console.log('main data');
            console.log(vm.DatalistESPLServiceDesk);
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
            vm.spinnerloaded = true;
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
        vm.DatalistESPLServiceDesk.forEach(function(product) {
            var id = product.Service_x0020_Desk_x0020_ID;
            statusFilter = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID eq \'' + id + '\'';
            commentSelect = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title,*';
            commentExpand = 'Service_x0020_Desk_x0020_Id/Service_x0020_Desk_x0020_ID,Editor/Title';
            ModeifiedDate = 'Modified desc';
            var Options = {
                select: commentSelect,
                expand: commentExpand,
                orderby: ModeifiedDate,
                filter: statusFilter
            };
            spcrud.read($http, vm.listServiceDeskComments, Options).then(function(response) {
                if (response.status === 200)
                    if (response.data.d.results.length > 0) {
                        vm.DatalistServiceDeskComments1 = response.data.d.results;
                        //  vm.DatalistESPLServiceDesk.find(f =>{ f.Service_x0020_Desk_x0020_ID === id}).FinalStatus = response.data.d.results[0].Status;
                        vm.DatalistESPLServiceDesk.forEach(f => {
                            if (f.Service_x0020_Desk_x0020_ID === id) {
                                f.FinalStatus = response.data.d.results[0].Status;
                                f.Modified = response.data.d.results[0].Modified
                                vm.DatalistServiceDeskComments1.forEach(fcomments => {
                                    if (fcomments.Status === 'Resolved') {
                                        f.ResolvedBy = fcomments.Editor.Title;
                                    } else {
                                        console.log(vm.DatalistServiceDeskComments1);
                                        f.ResolvedBy = '';
                                    }
                                })
                            }
                        })
                    } else {
                        console.log('empty');
                        console.log(response.data.d.results);
                        vm.DatalistESPLServiceDesk.find(f => f.Service_x0020_Desk_x0020_ID == id).FinalStatus = '';
                    }
            }, function(error) {
                console.log('error', error);
            });

        }, this);
        console.log(vm.DatalistESPLServiceDesk);
        vm.groupToPages();
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
        vm.toggleModalReject(item);
    };
    vm.toggleModalReject = function(itemToEdit) {
        vm.item = itemToEdit;
        vm.showModal = !vm.showModal;
    };
    vm.cancel = function(item) {
        vm.showModal = false;
    }
    vm.Resolve = function(item) {
        vm.IsView=false;
        vm.IsReply=false;
        vm.IsResolve=true;
        $scope.isCommentHide = true;
        $scope.isReplyHide = false;
        $scope.isResolveHide = true;
        vm.toggleModalReject(item);

    };
    spcrud.create($http, vm.listServiceDeskComments, {
        'Comments': 'test',
        'Status': 'redeem adding',
        'Predefined_x0020_Concern': 'Pending',
        'Department': redeemdate,
        'Service_x0020_Desk_x0020_Id': itemId
    }).then(function(resp) {
        vm.value = vm.product[0].Items_x0020_Redemend + quantity;
    });
}

function modal() {
    return {
        template: '<div class="modal fade" data-backdrop="static">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content" style="height:600px;">' +
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
angular.module('AllTicketApp', []).controller('AllTicketCtl', AllTicketCtl).directive('modal', modal);