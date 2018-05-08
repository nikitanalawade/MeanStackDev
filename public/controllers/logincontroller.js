var app = angular.module("myapp", []);

app.controller('MainCtrl', function($scope,$window,$location,$http) {

	$scope.checks = function() {
		  var data = {
				  email:$scope.email,
				  password:$scope.password
				  
		  }
		  $http.post('/login',data).then(
				  function(response){
					  console.log("before get");
					  $http.get('/getlogin').then(

							  function (response) {
								    console.log(response.data.status);
								    $scope.result=response.data.status;
								    $scope.success="200";
								    $scope.nopass="401";
								    $scope.nouser="404";
								    if(angular.equals($scope.result, $scope.success))
								    	{
								    	console.log("in if from get");
								    	console.log($scope.result);
								    	alert("Login Successful");
								   		$window.location.href="/stylesheets/Project.html" ;
								    	}
								    else if(angular.equals($scope.result, $scope.nopass))
							    	{
							    	console.log("in if from get1");
							    	console.log($scope.result);
							    	alert("Incorrect Login Credentials");
							    	}
								    else if(angular.equals($scope.result, $scope.nouser))
								    	{
								    	console.log("in if from get2");
								    	console.log($scope.result);
								    	alert("Something Went Wrong");
								    	
								    }
								    else{
								    	alert("Failed");
								    	}
								    });
					 
				  },
				  function(){
					  alert("failed")
				  }) ;
	}



	});
