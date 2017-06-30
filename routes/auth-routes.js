const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user-model.js');
const passport = require('passport');
const router = express.Router();

//REGISTRATION----------------------------------------------------------------
router.get('/signup', (req, res, next) =>{
  //Only render the special page if you are logged in
  if(req.user){
    res.redirect('/');
  }
  else{
    res.render('auth-views/signup-view.ejs');
  }
});

router.post('/signup', (req, res, next) =>{
  //Check if the username or password is empty
  if( req.body.signupUsername === '' || req.body.signupPassword === ''){
    // if either of them is, display an error to the user
    res.locals.messageForDumbUsers = "Please provide both username and password";

    res.render('auth-views/signup-view.ejs');
    return;
  }
  //Otherwise check to see if the username is already in the system
  UserModel.findOne(
    { username: req.body.signupUsername},
    (err, userFromDb) => {
      if(err){
        next(err);
        return;
      }
      //if the username is not taken,the "userFromDb" variable will be empty

      //check if "userFromDb" is not empty
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
//END REGISTRATION----------------------------------------------------

//LOG IN--------------------------------------------------------------
router.get('/login', (req, res, next) => {
  res.render('auth-views/login-view.ejs');
});

router.post('/login', passport.authenticate(
  'local',    //1st argument -> name of the strategy
              //                (determine by the strategy's npm package)
  {           //2nd argument -> setting object
    successRedirect: '/',       //"successRedirect" (where to go if login worked)
    failureRedirect: '/login'   //"failureRedirect" (where to go if login failed)
  }
));

//END LOG IN-----------------------------------------------------------

router.get('/logout', (req, res, next) => {
  // the req.logout() function is defined by the passport middleware (app.js)
  req.logout();
  res.redirect('/');
});


module.exports = router;
