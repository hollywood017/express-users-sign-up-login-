const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    //If the user is NOT logged in, "req.user" will be empty

    //Check if the user IS logged in
    if(req.user){
    res.locals.currentUser = req.user;
  }
  res.render('index');
});

//We want this page to be viewed only by logged in people.
router.get('/special', (req, res, next) => {
  //Only render the special page if you are logged in
  if(req.user){
    res.render('special-secret-view.ejs');
  }
  else{
    res.redirect('login');
  }
});

module.exports = router;
