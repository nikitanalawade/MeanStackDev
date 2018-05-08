/**
* Module dependencies.
*/

var express = require('express')
 , routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 ,login=require('./routes/login');

var passport = require('passport');
//require('./config/passport') ;
//var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost:27017/siproj');
///var mongo = require('mongodb');
/*var db=mongoose.connect('mongodb://localhost:27017/siproj',function(err,db)
		{
		if(err)
			{
			console.log("Init error");
			}
		else{
			console.log("connected");
			}
		});
//var conn = mongoose.connection;
var multer = require('multer');
var GridFsStorage = require('multer-gridfs-storage');
var Grid = require('gridfs-stream');
Grid.mongo = mongoose.mongo;
Grid.db=mongoose.db;
var gfs = new Grid(db, mongoose);

*/

var index=require('./routes/index');
var connection = require('./connection') ;
var session = require('express-session') ;
var app = express();




// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(session({ resave: true ,secret: 'SYSTEM' , saveUninitialized: true}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
/*app.use(function(req, res, next) { //allow cross origin requests
    res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});*/

var sess ;

// development only
if ('development' == app.get('env')) {
 app.use(express.errorHandler());
}
var isValidSession = function(sess){
	 if(sess.email) {
		 //console.log(sess.email) ;
		 //console.log("logged in") ;
		 return true ;
	 }else{
		 //console.log('invalid') ;
		 return false ;
	 }
}
/*var storage = new GridFsStorage({
    gfs : gfs,
    filename: function (req, file, cb) {
    	console.lof("in file");
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1]);
    },metadata: function(req, file, cb) {
        cb(null, { originalname: file.originalname });
    },
    root: 'Project' //root name for collection to store files into
});

var upload =multer({ //multer settings for single upload
	
    storage: storage
}).single('file');
*/

app.post('/register', (req, res) => {

connection.SaveDatabase(req,res) ;
res.send({status:"User Created !"});

});

app.post('/login', (req, res) => {

connection.CheckDatabase(req,res) ;
res.redirect('/getlogin');

});


app.get('/getlogin', (req, res) => {
	 var msg=require('./connection.js');
	 if(msg.user)
		{
	 sess = req.session ;
	console.log(sess) ;
	 
	
	 sess.email = msg.user.email_id ;
	 
	 console.log(sess.email) ;
		}
	 res.send({status:msg.message});
		
});

app.post('/addproject', (req, res) => {
console.log(sess.email) ;
console.log(req.session) ;
if(sess.email) {
	connection.AddProject(req,res) ;
	res.send({status:"Project Created !"});
}else{
	console.log('invalid session') ;
}
//connection.ProjectDatabase(req.body) ;
//res.send({status:"Discussion Created !"});
});


/*app.post('/upload', (req, res) => {
	console.log("in upload");
	var path=require('path');
	var file=req.body.myFile;
	console.log(file);// add path module
	console.log(req.body.myFile.path);
    gfs.readFile(req.myFile.path, function (err, data){ // readfilr from the given path
    var dirname = path.resolve(".")+'/uploads/'; // path.resolve(“.”) get application directory path
    var newPath = dirname +   req.myFile.originalFilename; // add the file name
    gfs.writeFile(newPath, data, function (err) { // write file in uploads folder
    if(err){
    res.json("Failed to upload your file");
    }else {
  res.json("Successfully uploaded your file");
}

});
});
});*/


/*app.get('/:filename', function(req, res){
    gfs.collection('Project'); //set collection name to lookup into
 
    /** First check if file exists */
   /* gfs.files.find({filename: req.params.filename}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: "Project"
        });
        console.log("read is"+readstream);
        /** set the proper content type */
        /*res.set('Content-Type', files[0].contentType);
        /** return response */
        /*return readstream.pipe(res);
    });
//});/
*/

app.get('/getdata', (req, res) => {
 var msg=require('./connection.js');
 res.send({status:msg.msg});
});

app.get('/logout',function(req,res){
	sess = req.session ;
	sess.email = undefined ;
	res.send("Logged Out Successfully");
}) ;
http.createServer(app).listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
});