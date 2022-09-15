const localstrategy=require("passport-local").Strategy;
const mongoose=require("mongoose");
const bcrypt=require("bcrypt");
const User=require("../models/User");

module.exports=(passport)=>{
    console.log("Connect to passport")
    passport.use(
        new localstrategy({usernameField:"email"},(email,password,done)=>{
        //Match User
        User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message:"That email is not registered"})
                }
                //Match Password
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err){
                        throw err;
                        // console.log(err);
                    }
                    if(isMatch){
                        return done(null,user)
                    }
                    else{
                        return done(null,false,{message:"Password is Incorrect"})
                    }
                });
            })
            .catch(err=>console.log(err));
    })
    );
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    });
    passport.deserializeUser((id, done)=>{
        User.findById(id,(err, user)=>{
            done(err, user);
        });
    })
}