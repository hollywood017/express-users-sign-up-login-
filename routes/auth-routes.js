const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model.js');

const router = express.Router();


router.get('/signup', (req, res, next) =>{
  res.render('auth-views/signup-view.ejs');
});

router.post('/signup', (req, res, next) =>{
  //Check if the username or password is empty
  if( req.body.signupUsername === '' || req.body.signupPassword === ''){
    res.locals.messageForDumbUsers = "Please provide both username and password";

    res.render('auth-views/signup-view.ejs');
    return;
  }
  //check to see if the username is already in the system
  UserModel.findOne(
    { username: req.body.signupUsername},
    (err, userFromDb) => {
      if(err){
        next(err);
        return;
      }
      //if the username is taken,the "userFromDb" variable will have a result

      //check if it's not empty
      if(userFromDb){
        res.locals.messageForDumbUsers = "Sorry that username is already in use.";

        res.render('auth-views/signup-view.ejs');
        return;
      }

      //if we get here, we are ready to save the new user in the DB
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel({
        fullname: req.body.signupFullName,
        username:req.body.signupUsername,
        encryptedPassword:scrambledPassword
      });
      theUser.save((err) =>{
        if (err) {
          next(err);
          return;
        }
        //redirect to home if registration is SUCCESSFUL
        res.redirect('/');
      });
    }
  );
});






module.exports = router;
