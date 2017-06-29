//We are configuring Passport in a separate file to avoid making a mess in app.js

const passport = require('passport');
const bcrypt = require('bcrypt');


const UserModel = require('../models/user-model.js');
//serializeUser (controls what goes into the bowel)

//deserializeUser (controls what you check when you get the bowel)

//STRATEGIESꜜꜜꜜꜜꜜꜜꜜꜜꜜ--------------------------------------------
//  the different ways we can log into our app
//SETUP passport-local
const LocalStrategy = require('passport-local').Strategy;

passort.use(new LocalStrategy(
  {             //1st argument -> settings object
      usernameField: 'loginUsername',
      passwordField: 'loginPassword'
  },

  (formUsername, formPassword, next) =>{  //2nd argument -> callback (will be called when a user tries to login)

  //#1 Is there an account with the provided username?
  //  (is there a user with that username in the database?)
  //query the database
  UserModel.findOne(
    { username: formUsername },
    (err, userFromDb) => {
        if (err){
          next(err);
          return;
        }
        //if the username is taken,the "userFromDb" variable will be empty

        //check if "userFromDb" is empty
        if(userFromDb === null){
          //In PASSPORT, if you call the next function with "false" in the 2nd position, that means LOGIN FAILED.
          next(null, false);
          return;
        }
        //#2 If there is a user with that username, is the PASSWORD correct?
        if (bcrypt.compareSync(formPassword, userFromDb.encryptedPassword) === false){
            //In PASSPORT, if you call the next function with "false" in the 2nd position, that means LOGIN FAILED.
          next(null, false);
          return;
        }
        //If we pass those if statements, LOGIN SUCCESSFUL!!!
        next(null, userFromDb);
        //In PASSPORT, if you call next() with a user in 2nd position, that means LOGIN SUCCESS
    }
  );



  }
));
