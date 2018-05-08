var app = angular.module("myapp", []);

app.controller('MainCtrl', function($scope,$window,$location,$http) {

	  $scope.sendData = function() {
		  console.log($scope.projectName);
		  console.log($scope.contact);
		  var data = {
				  projectname:$scope.projectname,
				  author:$scope.author,
				  contact:$scope.contact,
				  viewedby:$scope.viewedby,
				  category:$scope.category
				  
		  };
		  if(data)
			  {
		  $http.post('/addproject',data).then(
				  function(response){
					  alert(response.data.status);
					  $window.location.href="/stylesheets/User.html" ;
					 
				  },
				  function(){
					  alert("Please fill in the details.")
				  }) ;
		  
	  }
		  else
			  {
			  alert("Please fill the details");
			  $window.location.href="/stylesheets/Project.html" ;
			  }
		  
	  };
	  $scope.onLogout = function(){
	  console.log('inside logout') ;
	  $http.get('/logout').then(function(response){
		  alert(response.data) ;
		  $window.location.href="/stylesheets/Login.html" ;
	  },function(){
		alert('failed') ;  
	  });
  };
	  
	  $scope.upload=function(){
		  console.log("in upload of the function");
		  var file = $scope.myFile;
		  console.log(file);
		  $http.post('/upload',file).then(
				  function(response){
					  alert(response.data);
				  },function(){
					  alert("failed");
				  });
				  
	  };
  

});