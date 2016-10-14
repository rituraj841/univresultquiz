var mongoose = require( 'mongoose' );

var mModel = mongoose.model('marksModel');
var userModel = mongoose.model('User');
var qModel = mongoose.model( 'quizModel' );

exports.loginFormHandler = function (req, res){
	res.render('login.handlebars', {});
};//loginPageHandler

exports.authHandler = function (req, res){
	var nmReq = req.body.nm; //Here "nm" & "pwd" is matched from name attribute name in login.handlebars
	var pwdReq = req.body.pwd;
	var loginOutcome;
// mModel.findOne
	userModel.findOne({username:nmReq}, function(err, userObj){ //here we're requesting mongoose driver to find a record in userModel whose username field has given value. 
	    if(userObj === null){
	     	loginOutcome = "Login Failed: Username does not exist.";
        console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);
	     	res.render('login.handlebars', {LoginMessage:loginOutcome});
	    } else {  //userObj is Not NULL
	    	if(pwdReq === userObj.password) {
	    		loginOutcome = "Login successful";
          req.session.authenticated = true;
          req.session.loggedinUser = nmReq;
          console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);

          if(nmReq === "admin"){ //if logged in name is ADMIN
            req.session.rollInSession = 'NA';
            req.session.isAdmin = true;
          }else{                            //This condition is for student login only
            req.session.rollInSession = userObj.rollnumber;
            req.session.isAdmin = false;
          }
          res.render('landingpage.handlebars',
            {welcomeMessage:loginOutcome,
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,    ////Session
            LOGGED_USER_NAME: req.session.loggedinUser
          });

				} else{
				  loginOutcome = "Login Failed: Password did not match.";
          console.log( "Login Name %s, Password %s. Login outcome [%s]", nmReq, pwdReq, loginOutcome);
          res.render('login.handlebars', {LoginMessage:loginOutcome});
		    }
		  }//userObj is Not NULL

	});//findOne
}; //authHandler


exports.logoutHandler = function (req, res){
  req.session.destroy();
  res.render('login.handlebars', {LoginMessage:"You have successfully logged out."});
};//logoutHandler


exports.registerFormHandler = function(req, res){
   res.render("register-Form.handlebars", {}); // serves new user register form page when clicked from page link in Menu
}; //registerFormHandler


exports.registerUserHandler = function(req, res){
   var usernameReq = req.body.username; //here(the one in the right side) username,gender..etc.. is matched from the name attribute of the corresponding forms
   var genderReq = req.body.gender;
   var emailReq = req.body.email;
   var studentmobileReq = req.body.studentmobile;
   var dobReq = req.body.dob;
   var fnameReq = req.body.fname;
   var mnameReq = req.body.mname;
   var parentmobileReq = req.body.parentmobile;
   var addressReq = req.body.address;
   var flatReq = req.body.flat;
   var landmarkReq = req.body.landmark;
   var cityReq = req.body.city;
   var pincodeReq = req.body.pincode;
   var stateReq = req.body.state;
   var rollnumberReq = req.body.rollnumber;
   var passwordReq = req.body.password;
   var newuser = new User(); //creating a variable newuser for saving new entries

   newuser.username = usernameReq;   //here the(the one in the left side) username,gender,email etc.. is matched from db.js 
   newuser.gender = genderReq;
   newuser.email = emailReq;
   newuser.studentmobile = studentmobileReq;
   newuser.dob = dobReq;
   newuser.fname = fnameReq;
   newuser.mname = mnameReq;
   newuser.studentmobile = parentmobileReq;
   newuser.address = addressReq;
   newuser.flat = flatReq;
   newuser.landmark = landmarkReq;
   newuser.city = cityReq;
   newuser.pincode = pincodeReq;
   newuser.state = stateReq;
   newuser.rollnumber = rollnumberReq;
   newuser.password = passwordReq;

   //save to db through model
   newuser.save(function(err, savedUser){  /////confusion
       if(err){
         var message = "A user already exists with that username or email"; //populate a error/success message to user
         console.log(message);
         res.render("register", {errorMessage:message}); //here the message will be populated into {{errorMessage}} in the res.render page 
         return;
       }else{
         var message = '<span class="label label-success">Registration succesful</span>';
         req.session.newuser = savedUser.username;
         res.render('landingpage.handlebars', 
         {welcomeMessage:"message"}); //here the message will be populated into {{welcomeMessage}} in the res.render page
       }
   });
};//registerUserHandler


exports.resultFormHandler = function(req, res){
   res.render("resultForm.handlebars",  // serves new result view form page when clicked from page link in Menu
          {IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            USER_ROLL:req.session.rollInSession,
            LOGGED_USER_NAME: req.session.loggedinUser});
}; //resultFormHandler


exports.resultSubmitHandler = function(req,res){
  var rollReq = req.body.roll;  //Here "roll" is matched from name attribute in respective form
  console.log("resultPageHandler Roll" + rollReq);

  mModel.findOne({roll:rollReq}, function(err, mrksRec){
    if (!err && mrksRec != null){

      res.render('resultPage.handlebars', //Sends all data records from database to result show page////////////
          {marks:mrksRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }else{
      console.log("roll number not found");
      var message = "<span class='label label-danger'>Record not found. Check Your Roll Number</span>";
      res.render('landingpage.handlebars',
          {welcomeMessage:message,            //welcome message on landing.handlebars page
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }

  });
}//resultSubmitHandler


exports.crosslistReadAllHandler = function(req,res){
  var marksArray;
  mModel.find({}, function(err, mrksRec){ //find is used to find all records from the DB
    if (!err && mrksRec != null){
      console.log(JSON.stringify(mrksRec));
      marksArrray = mrksRec;
      outcomeBoolean = 1;
      res.render('crosslist.handlebars',
          {marks:mrksRec,           //assign the retrieved DB into marks and send it to crosslist.handlebars for showing crosslist page with the data.
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }
  });//find
} //crosslistReadAllHandler


/////////////////////////////ADD/EDIT/DELETE/SAVE CHANGES///////////////////////////////////////////////////


exports.crosslistDeleteOneSubmitHandler = function(req, res){     //FUNCTIONALITY FOR DELETE ON CROSSLIST PAGE
  var rollToEdit = req.query.rollnumber;
  mModel.remove({roll:rollToEdit}, function(err, marksRec){
  if (!err){
    var message = '<span class="label label-success">A record removed successfully</span>';
    res.render('landingpage.handlebars',
          {welcomeMessage:message,            //welcome message on landing.handlebars page
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
  }
}); //mModel.remove
}; //crosslistDeleteOneSubmitHandler

exports.crosslistEditOneFormHandler = function(req, res){     //FUNCTIONALITY FOR EDIT ON CROSSLIST PAGE
  var rollToEdit = req.query.rollnumber;
  mModel.findOne({roll:rollToEdit}, function(err, marksRec){
  if (!err){
    //console.log("Going to edit -> [" + marksRec.roll + " : " + marksRec.description + "]")  ;
    //var message = '<span class="label label-danger">update failed</span>';
    res.render('editPage.handlebars', {
            marksRec:marksRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
  }
}); //mModel.findOne
}; //crosslistEditOneFormHandler


exports.crosslistEditSubmitHandler = function(req, res){        //FUNCTIONALITY FOR SAVE AFTER EDIT ON CROSSLIST PAGE
    var rollRequest = req.body.roll;
    var phySubjRequest = req.body.physics;
    var chemSubjRequest = req.body.chemistry;
    var mathsSubjRequest = req.body.maths;
    var compSubjRequest = req.body.computer;

    var totalMarksCalc = parseInt(compSubjRequest)          //RECALCULATING TOTAL MARKS AFTER EDIT ON CROSSLIST PAGE
              + parseInt(phySubjRequest)
              + parseInt(chemSubjRequest)
              + parseInt(mathsSubjRequest);
   var percCalc = (totalMarksCalc * 100)/400;
   var divCalc;
   if (percCalc >= 60 ){
    divCalc = "1st";
   }else if (percCalc >= 45){
    divCalc = "2nd";
   }else if (percCalc >= 30 ){
    divCalc = "3rd";
   }else {
    divCalc ="fail";
   }

   mModel.update({roll:rollRequest},      ///UPDATING/ POPULATING THE DB WUTH NEW RECORDS
                    {$set:                                    //confusion
                      {
                        physics: phySubjRequest,
                        chemistry: chemSubjRequest,
                        maths: mathsSubjRequest,
                        computer: compSubjRequest,
                        totalmarks: totalMarksCalc,
                        percentage: percCalc,
                        division: divCalc
                      }},
                    {multi:false}, function(err, updatedRec){       //confusion
   if(err){
     var message = '<span class="label label-danger">Update Failed</span>';
     res.render('landingpage.handlebars', {
            welcomeMessage:message,     //welcome message on landing.handlebars page
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
   }else{
     var message = '<span class="label label-success">Update succesful</span>';
     res.render('landingpage.handlebars', {
            welcomeMessage:message,                         //welcome message on landing.handlebars page
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
   }
  });
}; //crosslistEditSubmitHandler


//////////////////////////   STUDENT INFORMATION  /////////////////////////////
exports.StudentInfoListHandler = function(req,res){
  var studentArray;
  userModel.find({}, function(err, userRec){
    if (!err && userRec != null){
      console.log(JSON.stringify(userRec));     ////ADD SOME COMMENT HERE
      studentArrray = userRec;
      outcomeBoolean = 1;
      res.render('registeredstudents.handlebars',
          {candidate:userRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    }
  });//StudentInformationHandler
}

/////////////////////////////////////// EVERYTHING ABOUT QUIZ  STARTS HERE /////////////////////////////////////////////// 

exports.quizEntryFormHandler = function(req, res){
   res.render("quiz-form.handlebars",      // serves quiz form page when clicked quiz form page link in Menu
          {IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            USER_ROLL:req.session.rollInSession,
            LOGGED_USER_NAME: req.session.loggedinUser});
}; //quizEntryFormHandler


exports.quizEntrySubmitHandler = function(req, res){
   var quesnumReq = req.body.questionnumber;  
   var statemReq = req.body.statement;
   var option1Req = req.body.option1;
   var option2Req = req.body.option2;
   var option3Req = req.body.option3;
   var option4Req = req.body.option4;
   var ansReq = req.body.answer;

   var newquestion = new qModel()
   newquestion.qnumber = quesnumReq;
   newquestion.qstmnt = statemReq;
   newquestion.option1 = option1Req;
   newquestion.option2 = option2Req;
   newquestion.option3 = option3Req;
   newquestion.option4 = option4Req;
   newquestion.answer = ansReq;

   //save to db through model
   
   newquestion.save(function(err, savedQ){
       if(err){
         var message = "This Question Already Exists";
         console.log(message);
         res.render("quiz-form.handlebars", {errorMessage:message});
        
       }else{
                          
        var message = '<span class="label label-success">Quiz Question Entry succesful</span>'; 
         res.render('landingpage.handlebars',
         {welcomeMessage:message,                     //welcome message on landing.handlebars page     
          IS_ADMIN:req.session.isAdmin,
          AUTHENTICATED:req.session.authenticated,
          LOGGED_USER_NAME: req.session.loggedinUser });
       }
   });
};//quizEntrySubmitHandler

exports.quizExamFormHandler = function(req, res){
    console.log("entering quizExamFormHandler");       
    if(req.session.QNUMBER){
      console.log("quizExamFormHandler Session has QNUMBER");
      var qn = req.body.Q; //Here Q is matched from name attribute ("name="Q") in quiz-Exam.handlebars 
      var ans = req.body.answer;
      console.log("Question : %s ::: Answer : %s", qn, ans);
      if(ans === req.session.QANS){
        console.log("answer is correct");
        req.session.quizmarks = parseInt( req.session.quizmarks)+5;  
      }else{
        console.log("answer incorrect");
      }
      console.log("quiz marks: %s", req.session.quizmarks);
      
        qn = parseInt(qn)+1; //After question 1,next question.
       qModel.findOne({qnumber:qn}, function(err, questRec){ //find from qModel in (db.js) qnumber
         if (!err && (questRec !== null) ){
           var HAS_QUESTION = true;
           req.session.QNUMBER = questRec.qnumber;
           req.session.QANS = questRec.answer;
           res.render('quiz-Exam.handlebars',
            {
            QUESTION:questRec,              //assign the retrieved DB into marks and send it to quiz-Exam.handlebars for showing page with the data.
            HAS_QUESTION:HAS_QUESTION,
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
         }else{
            var HAS_QUESTION = false;
            var message = '<span class="label label-danger">No More Questions </span>'; 
            res.render('quiz-Exam.handlebars',
            {errorMessage:message,                         //here the message will be populated into {{errorMessage}} in the res.render page
              HAS_QUESTION:HAS_QUESTION,
              IS_ADMIN:req.session.isAdmin,
              AUTHENTICATED:req.session.authenticated,
              LOGGED_USER_NAME: req.session.loggedinUser });
          }
       });  
    }else{
      req.session.quizmarks = "0";
      console.log("quizExamFormHandler Session doesnot have QNUMBER");
      var qn = "1";
       qModel.findOne({qnumber:qn}, function(err, questRec){
         if (!err && (questRec !== null) ){
           var HasQ = true;
           req.session.QNUMBER = questRec.qnumber;
           res.render('quiz-Exam.handlebars',
            {
            QUESTION:questRec,      //assign the retrieved DB into marks and send it to quiz-Exam.handlebars for showing page with the data.
            HAS_QUESTION:HasQ,
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
         }else{
            var HasQ = false;
            var message = '<span class="label label-danger">Question Not Available</span>'; 
            res.render('quiz-Exam.handlebars',
            {errorMessage:message,                                    //here the message will be populated into {{errorMessage}} in the res.render page
              HAS_QUESTION:HasQ,
              IS_ADMIN:req.session.isAdmin,
              AUTHENTICATED:req.session.authenticated,
              LOGGED_USER_NAME: req.session.loggedinUser });
            }
       });  
    }


           
};//quizExamFormHandler


 exports.quizAnswerSubmitHandler = function(req,res){
  qModel.findOne({qnumber:questionnumberReq}, function(err, questRec){
    if (!err && questRec != null){
      // console.log("roll number not found in user collection");
        var message = "<span class='label label-success'>record </span>";
          res.render('landingpage.handlebars', 
          { quest:questRec});                 
    } 


  });
}//quizAnswerSubmitHandler
