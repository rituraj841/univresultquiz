var mongoose = require( 'mongoose' );
var User = mongoose.model( 'User' );
var mModel = mongoose.model('marksModel');
var userModel = mongoose.model('User');
var qModel = mongoose.model( 'quizModel' );



exports.marksEntryInitFormHandler = function(req, res){
   res.render("marksEntryInitForm.handlebars",
          { AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
};//marksEntryInitFormHandler


exports.marksEntryFormHandler = function(req,res){
  var rollnumberReq = req.body.rollnumber;

  userModel.findOne({rollnumber:rollnumberReq}, function(err, userRec){
    if (!err && userRec != null){

      mModel.findOne({roll:rollnumberReq}, function(err, marksRec){
        if (!err && marksRec != null){
          var msg = "<span class='label label-danger'>This Student's marks record is already entered</span>";
          res.render('marksEntryInitForm.handlebars', 
          { ErrorMessage:msg,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
        }
        else{
          res.render('marksEntryForm.handlebars', //Sends all data records from database to marks entry show page////////////
          { user:userRec,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
        }
      });

    }else{
      console.log("roll number not found in user collection");
      var message = "<span class='label label-danger'>User record not found. Check Your Roll Number</span>";
          res.render('marksEntryInitForm.handlebars', 
          { ErrorMessage:message,
            IS_ADMIN:req.session.isAdmin,
            AUTHENTICATED:req.session.authenticated,
            LOGGED_USER_NAME: req.session.loggedinUser});
    } 


  });
}//marksEntryFormHandler


exports.marksEntrySubmitHandler = function(req, res){
   var nameReq = req.body.nm;////req=request
   var rollReq = req.body.roll;
   var physicsReq = req.body.physics;
   var chemistryReq = req.body.chemistry;
   var mathsReq = req.body.maths;
   var computerReq = req.body.computer;

   console.log("name=%s roll=%s",nameReq, rollReq );
   console.log("physics=%s chem=%s maths=%s comp=%s",physicsReq, chemistryReq ,mathsReq ,computerReq );

   var newmarks = new mModel();
   newmarks.xname = nameReq;
   newmarks.roll = rollReq;
   newmarks.physics = physicsReq;
   newmarks.chemistry = chemistryReq;
   newmarks.maths = mathsReq;
   newmarks.computer = computerReq;
   newmarks.totalmarks = parseInt(newmarks.physics)
              + parseInt(newmarks.chemistry)
              + parseInt(newmarks.maths)
              + parseInt(newmarks.computer) ;
   var perc = (newmarks.totalmarks * 100)/400; 
   var div; 
   if (perc >= 60 ){
    div = "1st";
   }else if (perc >= 45){
    div = "2nd";
   }else if (perc >= 30 ){
    div = "3rd";
   }else {
    div ="fail";
   }
  newmarks.division = div;
  console.log(" Marks total=%s", newmarks.totalmarks);
   //save to db through model
   newmarks.save(function(errorx, savedRec){
       if(errorx){
         var message = "A entry already exists with that name or roll";
         console.log(message);
         res.render('landingpage.handlebars',
          {welcomeMessage:"Entry Submission failed",
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
       }else{
         //req.session.newmarks = savedstudentsscorecard.marks;
         res.render('landingpage.handlebars',
          {welcomeMessage:"Entries Submitted succesfully",
            AUTHENTICATED:req.session.authenticated,
            IS_ADMIN:req.session.isAdmin,
            LOGGED_USER_NAME: req.session.loggedinUser});
       }
   });
};//marksEntrySubmitHandler

