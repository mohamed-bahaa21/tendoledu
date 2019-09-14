const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const User = require('../models/User');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');


// ===================================

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, 'profileImg' + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}


// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'));

router.get('/register', forwardAuthenticated, (req, res) => res.render('register'));

router.get('/login', forwardAuthenticated, (req, res) => res.render('login'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) => {
  if (req.user.user_type_name === "mentor") {
    User.find({}, function (err, usersdata) {
      // note that data is an array of objects, not a single object!
      User.find({
        user_type_name: "mentor"
      }, function (err, mentordata) {
        res.render('mentor-dashboard', {
          user: req.user,
          users: usersdata,
          mentor: mentordata
        });

      });
    });
  } else {

    User.find({}, function (err, data) {
      // note that data is an array of objects, not a single object!
      res.render('student-dashboard', {
        user: req.user,
        users: data,
      });
    });
  }
});


// Profile
router.get('/profile', ensureAuthenticated, (req, res) => {
  if (req.user.user_type_name === "mentor") {
    User.find({}, function (err, usersdata) {
      // note that data is an array of objects, not a single object!
      User.find({
        user_type_name: "mentor"
      }, function (err, mentordata) {
        res.render('mentor-profile', {
          user: req.user,
          users: usersdata,
          mentor: mentordata,
        });
      });
    });
  } else {
    User.find({}, function (err, data) {
      // note that data is an array of objects, not a single object!
      res.render('student-profile', {
        user: req.user,
        users: data
      });
    });
  }
});

// =========================================================

router.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      console.log(err);
      res.redirect('/profile');
    } else {
      if (req.file == undefined) {
        console.log(err);
        res.redirect('/profile');
      } else {
        User.find({}, function (err, usersdata) {
          // note that data is an array of objects, not a single object!
          User.find({
            user_type_name: "mentor"
          }, function (err, mentordata) {
            res.render('mentor-profile', {
              user: req.user,
              users: usersdata,
              mentor: mentordata,
              file: `../public/uploads/${req.file.filename}`
            });
            res.redirect('/profile');
          });
        });
      }
    }
  });
});



// Crash Course
router.get('/student-crash-courses', ensureAuthenticated, (req, res) => {
  User.find({}, function (err, usersdata) {
    // note that data is an array of objects, not a single object!
    res.render('student-crash-courses', {
      user: req.user,
      users: usersdata,
    });
  });
});

router.get('/mentor-crash-courses', ensureAuthenticated, (req, res) => {
  User.find({}, function (err, usersdata) {
    // note that data is an array of objects, not a single object!
    res.render('mentor-crash-courses', {
      user: req.user,
      users: usersdata,
    });
  });
});

router.get('/mentor-pre-requisites', ensureAuthenticated, (req, res) => {
  User.find({}, function (err, usersdata) {
    // note that data is an array of objects, not a single object!
    res.render('mentor-pre-requisites', {
      user: req.user,
      users: usersdata,
    });
  });
});

module.exports = router;