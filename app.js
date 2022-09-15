const express =require("express");
const expresslayout=require("express-ejs-layouts");
const mongoose=require("mongoose");
const flash=require("connect-flash");
const session=require("express-session");
const passport=require("passport");
const bodyParser = require('body-parser')
const app=express();

//passport config
require("./config/passport")(passport);

//config
// const db=require("./config-folder/keys").MongoURI;

//mongo connection
mongoose.connect(db,{useNewUrlParser:true})
    .then(()=>console.log("MongoDB is connected"))
    .catch(err=>console.log(err));

const port=5000;

app.use(expresslayout);
app.set("view engine","ejs");

//Body Parser
app.use(express.urlencoded({extended:true}));

// app.use(bodyParser.json());

//express session
app.use(session({
    secret:"secret",
    resave:true,
    saveUninitialized:true
}))
//middleware
app.use(passport.initialize());
app.use(passport.session());
//flash
app.use(flash());

//Global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash("success_msg");
    res.locals.error_msg=req.flash("error_msg");
    res.locals.error=req.flash("error");
    next();
})

app.use("/",require("./routes/index"));
app.use("/user",require("./routes/user"));

app.listen(port,console.log(`server start on port ${port}`));
