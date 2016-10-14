var express = require('express');
var session = require('express-session');
var hbars = require('express-handlebars');
var chalk = require('chalk');
var bodyparser = require('body-parser');
var db = require('./models/db.js');  // db.js must be required before routes.js
var routes = require('./routes/routes.js');
var routesMarksEntry = require('./routes/marksEntryHandlers.js');
var app = express();

///MIDDLEWARE IS A COMMONLY REQUIRED FUNCTIONALITY IN ANY WEB BASED APPLICATION.{app.use is the syntax} 
app.use(express.static(__dirname + "/public"));
app.use(bodyparser.json());     // to allow retrieving HTTP POST request parameters
app.use(bodyparser.urlencoded({extended:false})); 
app.use(session({secret: "secret",  resave : true,  saveUninitialized : false}));

app.set('view engine', 'handlebars');
app.engine('handlebars', hbars({}));

//Protecting application from unauthenticated users :: BEGIN
app.all('*', function(req, res, next){
	console.log(req.path);
	if (req.session.authenticated){
		console.log("You are already authenticated.");
		next();
	}else {
		if ((req.path === "/") 
			|| (req.path === "/authenticate")//Pages here will be shown only to all users.
						
		){
			console.log("You are going through the auth process.");
			next();
		}else  {
			console.log("You need to login.");
			res.redirect('/');
		}
	}	
	
});
//Protecting application from unauthenticated users :: END

app.get('/', routes.loginFormHandler); //Serves Default or index page to the client
app.post('/authenticate', routes.authHandler); //Authenticate Users(Admin,Students)
app.get('/logout', routes.logoutHandler); //Logs out current session of the user

app.get('/register-form', routes.registerFormHandler); //New User/Student/Admin Register Form(register-Form.handlebars)
app.post('/register-submit', routes.registerUserHandler); //Submits new user register form and registers new user only after validation

app.get('/result-form', routes.resultFormHandler); //Shows Result form page(resultForm.handlebars) for showing result 
app.post('/result-submit', routes.resultSubmitHandler); //Submits Result Show request

app.get('/marksEntryInitForm', routesMarksEntry.marksEntryInitFormHandler); //shows (marksEntryInitForm.handlebars) new marks entry form
app.post('/marksentryform', routesMarksEntry.marksEntryFormHandler); // Submits marks entry request and validates roll number for marks request.
app.post('/marksEntry', routesMarksEntry.marksEntrySubmitHandler); //// Submits marks entry request and validates submit for marks request.

app.get('/crosslist', routes.crosslistReadAllHandler); //Serves (crosslist.handlebars) to server side
app.get('/crosslist-delete-one-submit', routes.crosslistDeleteOneSubmitHandler); //Delete entry from Crosslist page
app.get('/crosslist-edit-form', routes.crosslistEditOneFormHandler); //Edit Form for Marks edit in Crosslist Page
app.post('/crosslist-edit-submit', routes.crosslistEditSubmitHandler);//Submit page after changes in edit page 

app.get('/student-info-list' , routes.StudentInfoListHandler);//Shows registered students records

app.get('/quizQuestionEntryForm', routes.quizEntryFormHandler); //Shows Quiz Question Entry Form for admin(quiz-form.handlebars)
app.post('/quizQuestionEntrySubmit', routes.quizEntrySubmitHandler); //Submits Entered questions for quiz in the database
app.get('/quizExamForm', routes.quizExamFormHandler); //Serves the quiz page to the students when selected thru menu
app.post('/quizExamForm', routes.quizExamFormHandler);//Serves the quiz page to the students when selected thru form
// app.post('/quizSubmit', routes.quizAnswerSubmitHandler);//Submit the quiz form when quiz completed(NOT USED IN CURRENT CASE)

app.use("*", function(req, res) {
     res.status(404);
     res.render('404.handlebars', {});
});

app.use(function(error, req, res, next) {
     console.log('Error : 500::' + error);
     res.status(500);
     res.render('500.handlebars', {err:error});  // good for knowledge but don't do it
});


var port = process.env.PORT || 3000;
app.listen(port, function(){
	console.log('HTTP server is listening on port: ' + port);
});