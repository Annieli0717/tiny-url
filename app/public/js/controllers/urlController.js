angular.module("tinyurlApp")
	.controller("urlController", ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
			$http.get("/api/v1/urls/" + $routeParams.shortUrl).then(function(response){
				$scope.longUrl =  response.data.longUrl;
				$scope.shortUrl =  "http://localhost:3000/" + response.data.shortUrl;
			}, function(response){
				console.log("what happened");
			});

			$scope.hour = "hour";
    		$scope.day = "day";
    		$scope.month = "month";

			$http.get("/api/v1/urls/" + $routeParams.shortUrl + "/totalClicks").then(function(response){
				$scope.totalClicks = response.data;
			}, function(response){
				console.log("what happened");
			});

			$scope.getTime = function (time) {
		        $scope.lineLabels = [];
		        $scope.lineData = [];
		        $scope.time = time;
		        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + time)
		            .then(function (response) {
		                response.data.forEach(function (info) {
		                    var legend = '';
		                    if (time === 'hour') {
		                        if (info._id.minutes < 10) {
		                            info._id.minutes = '0' + info._id.minutes;
		                        }
		                        legend = info._id.hour + ':' + info._id.minutes;
		                    } else if (time === 'day') {
		                        legend = info._id.hour + ':00';
		                    } else {
		                        legend = info._id.month + '/' + info._id.day;
		                    }
		                    $scope['lineLabels'].push(legend);
		                    $scope['lineData'].push(info.count);
		                });
		            });
		    };

		    $scope.getTime('hour');

		    var renderChart = function (chart, infos) {
		        $scope[chart + 'Labels'] = [];
		        $scope[chart + 'Data'] = [];
		        $http.get("/api/v1/urls/" + $routeParams.shortUrl + "/" + infos)
		            .then(function(response) {
		                response.data.forEach(function (info) {
		                    $scope[chart + 'Labels'].push(info._id);
		                    $scope[chart + 'Data'].push(info.count);
		                });
		            });
		    };

		    renderChart("pie", "referer");
		    renderChart("doughnut", "country");
		    renderChart("bar", "platform");
		    renderChart("base", "browser");

	}]);