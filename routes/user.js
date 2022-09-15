const express =require("express");
const router=express.Router();
const bcrypt=require("bcrypt");
const passport=require("passport");
const User=require("../models/User");
const { forwardAuthenticated } = require("../config/auth");
const flash=require("connect-flash");

router.get("/login",forwardAuthenticated,(req,res)=>{
    res.render("login");
})

router.get("/register",forwardAuthenticated,(req,res)=>{
    res.render("register");
})
//Register Handle
router.post("/register",async(req,res)=>{
    const {name,email,password,password2}=req.body;
    let errors=[];
    const salt= await bcrypt.genSalt(10);
    const hashpassword= await bcrypt.hash(password,salt);
    
    //Check Required Field
    if(!name || !email || !password){
        errors.push({msg:"Please fill all the fields"});
    }

    //Check For Password
    if(password!==password2){
        errors.push({msg:"Password does not match"});
    }

    //Check for password Lenght
    if(password.length<6){
        errors.push({msg:"Password should be at least 6 character"});
    }

    if(errors.length>0){
        res.render("register",{
            errors,
            name,
            email,
            password,
            password2
        });
    }
    else{
        //validations passed
        User.findOne({email:email})
            .then(user=>{
                if(user){
                    errors.push({msg:"email is already registered"});
                    res.render("register",{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                    console.log(errors);
                }
                else{
                    const newUser=new User({
                        name,
                        email,
                        password:hashpassword
                    });
                    // console.log(newUser);

                    //save the User in DB
                    newUser.save()
                        .then(user=>{
                            res.redirect("login");
                            res.flash("success_msg","You are now registered and can log in");
                        })
                        .catch(err=>console.log(err));
                }
            })
    }
});

//Login Handle
router.post("/login",(req,res,next)=>{
    passport.authenticate('local',{
        // console.log("authenticate");
        // console.log(err);
        // console.log(user);
        // console.log(info);
        successRedirect:"/dashboard",
        failureRedirect:"/user/login",
        failureFlash:true
    })(req,res,next);
    console.log("post request");
});

//logout Handle
router.get('/logout',(req, res)=>{
    req.logout((err)=>{
      if (err) { return next(err); }
      req.flash('success_msg', 'You are logged out');
      res.redirect('/user/login');
    });
});

module.exports=router;