var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/siproj',function(err,db)
{
if(err)
	{
	console.log("Init error");
	}
else{
	console.log("connected");
	}

var Schema = mongoose.Schema;
var userSchema =  new mongoose.Schema({
	  first_name: String,
	  last_name:  String,
	  email_id:String,
	  contact_no:String,
	  availability:String,
	  days_selected:String,
	  interest:String,
	  hash: String,
	  salt: String
	  
	});



userSchema.methods.setPassword = function(password){
	  this.salt = crypto.randomBytes(16).toString('hex');
	  
	  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};
	
	
		
userSchema.methods.generateJwt = function() {
			  var expiry = new Date();
			  expiry.setDate(expiry.getDate() + 7);

			  return jwt.sign({
			    _id: this._id,
			    email: this.email,
			    first_name: this.first_name,
			    last_name:this.last_name,
			    exp: parseInt(expiry.getTime() / 1000),
			  }, "SYSTEM"); // DO NOT KEEP YOUR SECRET IN THE CODE!
			};
			
			
var User=mongoose.model('Registration', userSchema,"RegForm");			


module.exports.SaveDatabase = function(request,response) {
	
	console.log("in mongo");
	console.log("name"+request.body.password);
	
	var newUser = new User();
	newUser.first_name= request.body.firstname;
	newUser.last_name= request.body.lastname;
	newUser.email_id=request.body.email;
	newUser.contact_no=request.body.contact;
	newUser.availability=request.body.availability;
	newUser.days_selected=request.body.days;
	newUser.interest=request.body.interest;
	
	newUser.setPassword(request.body.password);
	
	
		
		console.log(request.body.firstname);
		// save the user
		newUser.save(function(err) {
		    var token;
		    console.log("in save before generate");
		    token = newUser.generateJwt();
		    console.log("token"+token);
		    console.log("in save after generate");
		    response.status(200).json('info');
		    response.json({
		      "token" : token
		    });
		  });

};	

module.exports.CheckDatabase = function(req, res) {
	console.log("in checkdatabase");
	  passport.authenticate('local', function(err, user, info){
	    var token;

    // If Passport throws/catches an error
	    if (err) {
	    	console.log("in 404");
	    	exports.message="404";
	      res.status(404).json(err);
	      return;
	    }
	    

	    // If a user is found
	    if(user){
	    	console.log("in 200");
	    	req.session.email = user.email_id ;
	    	console.log(JSON.stringify(user)) ;
	    	exports.message="200";
	    	exports.user = user ;
	    	
	    	res.status(200).send('200');
	      token = user.generateJwt();
	      
	      res.json({
	        "token" : token
	      });
	    }	 else {
	      // If user is not found
	    	console.log("in 401");
	    	exports.message="401";
	      res.status(401).json(info);
	    }
	  })(req, res);

	};
	passport.use(new LocalStrategy({
		   usernameField: 'email'
		 },

		 function(username, password, done) {
			 console.log("in passport page");
			 console.log("username ="+username);
			 console.log("password ="+password);
			 
		   User.findOne({ email_id: username }, function (err, users) {
			
		     if (err) { 
		    	 
		    	 return done(err); }
		     // Return if user not found in database
		     if (!users) {
		    	 console.log("user not found");
		       return done(null, false, {
		         message: 'User not found'
		       });
		     }
		    
		     // Return if password is wrong 
		     var hash = crypto.pbkdf2Sync(password, users.salt, 1000, 64, 'sha512').toString('hex');
		   
		     console.log("in validation hash"+hash);
			 if(users.hash !== hash)
		      {
		  	   console.log("password not found");
		       return done(null, false, {
		    
		         message: 'Password is wrong'
		       });
		     }
		     // If credentials are correct, return the user object
		     return done(null, users);
		   });
		 }
		));


	var ProjectSchema =  new mongoose.Schema({
		project_name: String,
		 contact_no:String,
		  author:  String,
		  viewedby:String,
		  category:String,
		 
		  
		});

var Project=mongoose.model('Add_Project', ProjectSchema,"Project");

module.exports.AddProject = function(request,response) {
		
		console.log("in mongo of project");
		
		var newProject = new Project();
		newProject.project_name= request.body.projectname;
		newProject.contact_no=request.body.contact;
		newProject.author= request.body.author;
		newProject.viewedby=request.body.viewedby;
		newProject.category=request.body.category;
		
		console.log(request.body.contact);
		console.log(request.body.projectname);
			// save the user
			newProject.save(function(err) {
			    
			    console.log("saved project");
			    
			    response.status(200).json('info');
			    
			  });

	};	
});