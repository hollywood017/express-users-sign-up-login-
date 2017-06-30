//We are configuring Passport in a separate file to avoid making a mess in app.js

const passport = require('passport');
const bcrypt = require('bcrypt');


const UserModel = require('../models/user-model.js');
//serializeUser (controls what goes into the bowel)
// - save only the user's datatbase ID in the bowel
// - happens ONLY when you login
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
  //    |
  // null in 1st argument means NO ERROR
});

//deserializeUser (controls what you check when you get the bowel)
// - use the ID in the bowel to retrieve the user's information
// - happens everytime you visit the site after logging in
passport.deserializeUser((idFromBowl, next) => {
  UserModel.findById(
    idFromBowl,
    (err, userFromDb) => {
      if(err){
        next(err);
        return;
      }
      // Tell passport that we got the user's info from the DB
      next(null, userFromDb);
      //    |
      // null in 1st argument means NO ERROR
    }
  );
});

//STRATEGIESꜜꜜꜜꜜꜜꜜꜜꜜꜜ--------------------------------------------
//  the different ways we can log into our app
//SETUP passport-local
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
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


//passport -facebook (log in with your facebook account)
const FbStrategy = require('passport-facebook').Strategy;

passport.use(new FbStrategy(
  {    //1st argument -> settings object
    clientID: '411662565900672',
    clientSecret: 'bff857cbd2f90e6da5696b1c0a3a348a',
    callbackURL: '/auth/facebook/callback'
  },            // out route (name this whatever you want)
  (accessToken, refreshToken, profile, next) => {  //2nd argument -> callback
           //(will be called when a user allows us to log them in with FACEBOOK)
      console.log('');
      console.log('---------FACEBOOK PROFILE INFO-----------');
      console.log(profile);
      console.log('');

      UserModel.findOne(
        {facebookId: profile.id},
        (err, userFromDb) => {
          //"userFromDb" will be empty if this is first time the user logs in with FACEBOOK
          if(err) {
            next(err);
            return;
          }
          //Check if they have logged in before
          if(userFromDb) {
            //just log them in
            next(null, userFromDb);
            return;
          }

          //If it's the first time they log in, SAVE THEM IN THE DB!
          const theUser = new UserModel({
            fullName: profile.displayName,
            facebookId: profile.id
          });
          theUser.save((err) => {
            if(err) {
              next(err);
              return;
            }
            //Now that they are saved, Log them in.
            next(null, theUser);
          });
        }
      );


      //Receiving the Faceook user info and SAVING IT!

      //UNLESS we have already saved their info, in which case we log them in.
  }
));

//passport-google-oauth (log in with Google account)
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(new GoogleStrategy(
  {    //1st argument -> settings object
    clientID: '525959150202-3uh3n6b4leddodll9cdg3uv9grtac02d.apps.googleusercontent.com',
    clientSecret: 'orKgLFsck--YHgfG9eKyteML',
    callbackURL: '/auth/google/callback'
  },            // out route (name this whatever you want)
  (accessToken, refreshToken, profile, next) => {  //2nd argument -> callback
           //(will be called when a user allows us to log them in with FACEBOOK)
      console.log('');
      console.log('---------GOOGLE PROFILE INFO-----------');
      console.log(profile);
      console.log('');

      UserModel.findOne(
        {googleId: profile.id},
        (err, userFromDb) => {
          //"userFromDb" will be empty if this is first time the user logs in with FACEBOOK
          if(err) {
            next(err);
            return;
          }
          //Check if they have logged in before
          if(userFromDb) {
            //just log them in
            next(null, userFromDb);
            return;
          }

          //If it's the first time they log in, SAVE THEM IN THE DB!
          const theUser = new UserModel({
            fullName: profile.displayName,
            googleId: profile.id
          });

          //if displayName is empty, use email instead.
          if (theUser.fullName === undefined){
            theUser.fullName = profile.emails[0].value;
          }

          theUser.save((err) => {
            if(err) {
              next(err);
              return;
            }
            //Now that they are saved, Log them in.
            next(null, theUser);
          });
        }
      );


      //Receiving the Faceook user info and SAVING IT!

      //UNLESS we have already saved their info, in which case we log them in.
  }
));
