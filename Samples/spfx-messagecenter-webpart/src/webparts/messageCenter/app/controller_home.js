var AppMessageCenter = angular.module('app_MessageCenter', ['ui.bootstrap']);

AppMessageCenter.controller("controller_home", ["$rootScope", "$scope", "$uibModal", "$http", "$location", "$window",
    function ($rootScope, $scope, $uibModal, $http, $location, $window) {

        $scope.notifications = [];
        $scope.isLoading = true;
        $scope.listapi = null;
        $scope.listname = null;
        $scope.selectedfields = null;
        $scope.needsconfig = true;
        $scope.error = null;

        $rootScope.$on('configurationChanged', function (event, args) {

            $scope.notifications = [];
            $scope.isLoading = true;
            $scope.error = null;

            if (args.listapi != null && args.listapi.length > 0
                && args.listname != null && args.listname.length > 0
                && args.selectedfields != null && args.selectedfields.length > 0) {
                $scope.listapi = args.listapi;
                $scope.listname = args.listname;
                $scope.selectedfields = args.selectedfields;

                if (args.EnvironmentType == 1) {
                    $scope.loadMockupMessages();
                }
                else {
                    $scope.loadMessages();
                }
                $scope.needsconfig = false;
                $scope.$apply();
            }
            else {
                $scope.needsconfig = true;
                $scope.$apply();
            }
        });

        $scope.showDetails = function (size, message) {

            var modalInstance = $uibModal.open({
                templateUrl: 'messagedetails.html',
                controller: 'ModalInstanceCtrl_Details',
                size: size,
                scope: $scope,
                resolve: {
                    messagedetails: function () {
                        return message;
                    }
                }
            });

            modalInstance.result.then(function () { }, function () { });
        };

        $scope.viewMore = function (size) {

            var modalInstance = $uibModal.open({
                templateUrl: 'viewmore.html',
                controller: 'ModalInstanceCtrl_ViewMore',
                size: size,
                scope: $scope,
                resolve: {

                }
            });

            modalInstance.result.then(function () { }, function () { });
        };

        $scope.loadMessages = function () {
            $http({
                method: 'GET',
                url: _spPageContextInfo.siteAbsoluteUrl + $scope.listapi + "getByTitle('" + $scope.listname + "')/items?$select=" + $scope.selectedfields,
                headers: { "Accept": "application/json;odata=verbose" }
            }).success(function (data, status, headers, config) {
                $scope.notifications = data.d.results;
                $scope.isLoading = false;
            }).error(function (data, status, headers, config) {
                $scope.isLoading = false;
                $scope.error = 'Unable to load the details.';
            });
        };

        $scope.loadMockupMessages = function () {
            $scope.notifications = [{ Id: '0', Title: 'Sample', Status: 'Sample Status', Category: 'Sample Category', Published: '2016-08-12T07:00:00Z', Description: 'Sample Desc' }];
            $scope.isLoading = false;
        };

    }]);

AppMessageCenter.controller("ModalInstanceCtrl_Details", ["$scope", "$uibModalInstance", "messagedetails",
    function ($scope, $uibModalInstance, messagedetails) {
        $scope.Description = messagedetails.Description;

        $scope.Close = function () {
            $uibModalInstance.dismiss();
        };
    }]);

AppMessageCenter.controller("ModalInstanceCtrl_ViewMore", ["$rootScope", "$scope", "$uibModalInstance", "$http", "$location", "$window",
    function ($rootScope, $scope, $uibModalInstance, $http, $location, $window) {

        $scope.Close = function () {
            $uibModalInstance.dismiss();
        };

        var pageSize = 2;
        var topVal = pageSize;
        var lastPage = pageSize;
        var queryUrl = '';
        var firstPage = 0;

        $scope.loadPagedData = function () {

            $scope.moreDetials = [];
            var queryUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + $scope.listname + "')/items?$select=" + $scope.selectedfields + "&$orderby=ID asc&$top=" + parseInt(topVal);

            $http({
                method: 'GET',
                url: queryUrl,
                headers: { "Accept": "application/json;odata=verbose" }
            }).success(function (data, status, headers, config) {
                $scope.moreDetials = data.d.results;
            }).error(function (data, status, headers, config) {
                alert('Unable to load the details.');
            });
        };

        $scope.onLoadMore = function ()  {

            $scope.moreDetials = [];

            topVal = topVal + pageSize;
            firstPage = firstPage + pageSize;
            lastPage = lastPage + pageSize;
            //If PageSize will be greater than or equal to TopVal then It will go inside If
            if (topVal >= pageSize) {
                queryUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + $scope.listname + "')/items?$select=" + $scope.selectedfields + "&$orderby=ID asc&$top=" + parseInt(topVal);

            }
            //If PageSize will be less than TopVal means the data will be less than topval then It will go in else part
            else {
                topVal = pageSize;
                firstPage = 1;
                lastPage = pageSize;
                queryUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + $scope.listname + "')/items?$select=" + $scope.selectedfields + "&$orderby=ID asc&$top=" + parseInt(topVal);
            }

            $http({
                method: 'GET',
                url: queryUrl,
                headers: { "Accept": "application/json;odata=verbose" }
            }).success(function (data, status, headers, config) {
                $scope.moreDetials = data.d.results;

            }).error(function (data, status, headers, config) {
                alert('Unable to load the details.');
            });
        }

        $scope.onLoadLess = function ()  {

            $scope.moreDetials = [];

            topVal = topVal - pageSize;
            firstPage = firstPage - pageSize;
            lastPage = lastPage - pageSize;

            //If PageSize will be greater than or equal to TopVal then It will go inside If
            if (topVal >= pageSize) {
                queryUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + $scope.listname + "')/items?$select=" + $scope.selectedfields + "&$orderby=ID asc&$top=" + parseInt(topVal);
            }
            //If PageSize will be less than TopVal means the data will be less than topval then It will go in else part
            else {
                topVal = pageSize;
                firstPage = 1;
                lastPage = pageSize;
                queryUrl = _spPageContextInfo.siteAbsoluteUrl + "/_api/web/lists/getbytitle('" + $scope.listname + "')/items?$select=" + $scope.selectedfields + "&$orderby=Id asc&$top=" + parseInt(topVal);

            }

            $http({
                method: 'GET',
                url: queryUrl,
                headers: { "Accept": "application/json;odata=verbose" }
            }).success(function (data, status, headers, config) {
                $scope.moreDetials = data.d.results;
            }).error(function (data, status, headers, config) {
                alert('Unable to load the details.');
            });

        }

        $scope.loadPagedData();

    }]);






