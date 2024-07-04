//===================== INTIALIZES EXPRESS APPPP================
const express=require("express");
const bodyParser = require('body-parser');
const app=express();





app.use(express.json());
app.use(express.urlencoded({extended:true})); //TO ACCERS URL FORM ENCODED IN POSTMAN
app.use(express.static('upload'));
const cors=require("cors");
app.use(cors()); //ALLOW HTTP REQUESTS LOCAL HOSTS
app.use(bodyParser.json());
//================ REQUIRE MODULE =====================
const auth= require("./routes/Auth")
const schools= require("./routes/Schools")
const contact = require("./routes/Users")
// const transporter = require('./middlewarer/emailConfig');

// Now you can use 'transporter' to send emails

//================ RUN THE APP =====================
app.listen(4000,"localhost"),()=>{
  console.log("APP IS RUnnIG"); 
  
}
//================ API ROUTES(ENDPOITNS) =====================
app.use("/auth",auth);
app.use("/schools",schools);
app.use("/users",contact)


