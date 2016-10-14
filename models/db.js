var chalk = require('chalk');
var mongoose = require( 'mongoose' );


//var dbURI = 'mongodb://127.0.0.1/resultdb';
//var dbURI =  'mongodb://edu:edu@ds015879.mlab.com:15879/edurekadb';
var dbURI = 'mongodb://ram:ram@ds033337.mongolab.com:33337/square';
console.log("Establishing connection to the DB");
mongoose.connect(dbURI);
mongoose.connection.on('connected', function () {
  console.log(chalk.yellow('Mongoose connected to ' + dbURI));
});

mongoose.connection.on('error', function (err) {
  console.log(chalk.red('Mongoose connection error: ' + err));
});

mongoose.connection.on('disconnected', function () {
  console.log(chalk.red('Mongoose disconnected'));
});

// ***** *******  *  *****   Schema defs
var userSchema = new mongoose.Schema({
  username: {type: String, unique:true},
  gender: {type: String},
  email: {type: String, unique:true},
  studentmobile: {type: String, unique:true},
  dob: {type: String},
  fname: {type: String},
  mname: {type: String},
  parentmobile: {type: String},
  address: {type: String},
  flat: {type: String},
  landmark: {type: String},
  city: {type: String},
  pincode: {type: String},
  state: {type: String},
  rollnumber : {type: String, unique:true},
  password: String
}, {collection: 'Users'});

var marksSchema = new mongoose.Schema({		///////Name of the schema is marks/////////
  xname: {type: String, unique:true},
  roll: {type: String, unique:true},
  physics: {type: String},
  chemistry: {type: String},
  maths: {type: String},
  computer: {type: String},
  totalmarks: {type: String},
  percentage: {type: String},
  division: {type: String}
}, {collection: 'studentscorecard'});

var quiz_collSchema = new mongoose.Schema({   ///////Name of the schema is marks/////////
  qnumber: {type: String, unique: true},
  qstmnt:  {type: String, unique: true},
  option1: {type: String},
  option2: {type: String},
  option3: {type: String},
  option4: {type: String},
  answer:  {type: String}
}, {collection: 'quiz_coll'});


// register the User,quiz_collSchema & marksSchema model
mongoose.model( 'User', userSchema);
mongoose.model( 'marksModel', marksSchema);
mongoose.model( 'quizModel', quiz_collSchema);
