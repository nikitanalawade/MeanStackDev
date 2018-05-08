
angular.module('myapp',[]).controller('MainCtrl', function($scope,$window,$location,$http) {

  $scope.sendData = function() {
	  var data = {
			  firstname:$scope.firstname,
			  lastname:$scope.lastname,
			  email:$scope.email,
			  contact:$scope.contact,
			  password:$scope.password,
			  availability:$scope.availability,
			  days:$scope.days,
			  interest:$scope.interest
			  
	  }
	  if(data)
		  {
	  $http.post('/register',data).then(
			  function(response){
				  alert(response.data.status);
				  $window.location.href="/stylesheets/Login.html" ;
				 
			  },
			  function(){
				  alert("Please fill in the details.")
			  }) ;
	  
  }
	  else
		  {
		  alert("Please fill the details");
		  $window.location.href="/stylesheets/Registration.html" ;
		  }
	  
  }

});