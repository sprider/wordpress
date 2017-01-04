var AppWebTree = angular.module('app_WebTree', ['officeuifabric.core', 'officeuifabric.components']);

AppWebTree.controller("webTreeCtrl", ["$rootScope", "$scope", "$http", "$location", "$window",
    function ($rootScope, $scope, $http, $location, $window) {

        $scope.WebList = [];
        $scope.isLoading = true;
        $scope.scope = null;
        $scope.currentenv = null;
        $scope.localenv = null;
        $scope.needsconfig = true;
        $scope.error = '';

        $rootScope.$on('configurationChanged', function (event, args) {

            $scope.WebList = [];
            $scope.isLoading = true;
            $scope.error = '';

            if (args.scope != null && args.scope.length > 0) {
                $scope.scope = args.scope;
                $scope.currentenv = args.currentenv;
                $scope.localenv = args.localenv;
                $scope.WebList = args.WebList;

                if (currentenv === $scope.localenv) {
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

        $scope.loadMessages = function () {

            var endpointurl = _spPageContextInfo.siteAbsoluteUrl + + "/_api/web/webs?$select=Id,Title,Description,Url,WebTemplate,Created,LastItemModifiedDate&$filter=WebTemplate ne 'APP'";

            $http({
                method: 'GET',
                url: endpointurl,
                headers: { "Accept": "application/json;odata=verbose" }
            }).success(function (data, status, headers, config) {
                var results = data.d.results;

                if (results.length > 0) {
                    for (var i = 0; i < results.length; i++) {                       

                        $scope.WebList.push({
                            Id: results[i].Id, 
                            Title: results[i].Title, 
                            Description: results[i].Description, 
                            Url: results[i].Url, 
                            WebTemplate: results[i].WebList, 
                            Created: results[i].Created, 
                            LastItemModifiedDate: results[i].LastItemModifiedDate
                        });
                    }
                }

                $scope.isLoading = false;

            }).error(function (data, status, headers, config) {
                $scope.isLoading = false;
                $scope.error = 'No subsites were found.';
            });
        };

        $scope.loadMockupMessages = function () {

            $scope.WebList = [
                { Id: '9f119e61-4a5a-4374-bdd8-0c4b6306166d', Title: 'Sample Site A', Description: 'A for Apple', Url: 'https://tenant.sharepoint.com/sites/a', WebTemplate: 'STS', Created: '2015-04-24T16:06:53', LastItemModifiedDate: '2016-07-24T16:06:53' },
                { Id: '6cfe473b-7c3f-45a1-8ee3-7dc79489d508', Title: 'Sample Site B', Description: 'B for Ball', Url: 'https://tenant.sharepoint.com/sites/b', WebTemplate: 'STS', Created: '2015-05-24T16:06:53', LastItemModifiedDate: '2016-08-24T16:06:53' },
                { Id: '6cfe473b-7c3f-45a1-8ee3-7dc79489d508', Title: 'Sample Site C', Description: 'C for Cat', Url: 'https://tenant.sharepoint.com/sites/c', WebTemplate: 'STS', Created: '2015-06-24T16:06:53', LastItemModifiedDate: '2016-12-24T16:06:53' },
            ];
            $scope.isLoading = false;
        };

    }]);







