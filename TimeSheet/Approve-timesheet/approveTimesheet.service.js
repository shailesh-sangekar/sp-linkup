angular.module('ApproveTimesheetApp').service('myService', function($http){
    var vm = this;
   
        var serviceBase = {};
        serviceBase.baseUrl = 'http://192.168.101.21:4000/api/'
        serviceBase.headers = {
            'Authorization':'Bearer ' + localStorage.getItem('authorizationData')
        };
        vm.getToken = function (loginData) {            
            var data = "grant_type=password&username=" + loginData.UserName + "&password=" + loginData.Password;            
           return $http.post(serviceBase.baseUrl + 'auth/Token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
                return response;
            }).error(function (err, status) {

            });

        }
    vm.getMyLeaves=  function(){
        var config = {
            method: 'GET',
            url: serviceBase.baseUrl + '/_api/contextinfo',
            headers: serviceBase.headers
        };

    return $http(config).then(function (results) {
        return results;
        });
    }
})