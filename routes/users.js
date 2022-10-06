const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load User model
const User = require('../models/User');
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');


// Login Page
router.get('/login', forwardAuthenticated, (req, res) => res.redirect('/login'));

// Register Page
router.get('/register', forwardAuthenticated, (req, res) => res.redirect('/register'));

// Register
router.post('/register', (req, res) => {
  const {
    name,
    workAs,
    email,
    password,
    password2
  } = req.body;
  let errors = [];

  if (!name || !workAs || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      workAs,
      email,
      password,
      password2
    });
  } else {
    User.findOne({
      email: email
    }).then(user => {
      if (user) {
        errors.push({
          msg: 'Email already exists'
        });
        res.render('register', {
          errors,
          name,
          workAs,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          user_type_name: 'student'
        });
        if (newUser.user_type_name === 'student') {
          newUser.user_type.mentor = null;

          newUser.user_type.student.workAs = workAs;
          newUser.user_type.student.accepted = false;
        }




        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post('/login', (req, res, next) => {
  User.findOne({
    email: req.body.email
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      if (doc != null) {
        if (doc.user_type.student.accepted) {
          if (doc.user_type.student.first_time) {
            req.flash(
              'success_msg',
              'CONGRATS! ' + doc.name + ', you have been accepted to this workspace. Keep an eye on your email and the website for updates!'
            );
          }
          doc.user_type.student.first_time = false;
          doc.save();
        }
      }
      passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
    }
  });
});

router.get('/dashboard', (req, res) => {

});

// Logout
router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) { return next(err); }
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });

});








// Accept Student
router.post('/accept-student', (req, res) => {

  User.findById(req.body.userId, function (err, doc) {
    if (!err) {
      doc.user_type.student.accepted = true;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Student ' + doc.name + ': has been successfully accepted.'
          );
          res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
    } else {
      console.log('Error in accepting student :' + err);
    }
  });

});

// Delete Student
router.post('/delete-student', (req, res) => {
  User.findByIdAndRemove(req.body.userId, (err, doc) => {
    if (!err) {
      req.flash(
        'success_msg',
        'Student ' + doc.name + ': has been successfully deleted.'
      );
      res.redirect('/dashboard');
    } else {
      console.log('Error in deleting student :' + err);
    }
  });
});

// Edit Project Name
router.post('/edit-project-name', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.user_type.mentor.project_name = req.body.userProjectName;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Project Name: Has Been Successfully Changed.'
          );
          res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
    }
  });

});

// Edit Project Details
router.post('/edit-project-details', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.user_type.mentor.project_details = req.body.userProjectDetails;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Project Details: Has Been Successfully Changed.'
          );
          res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
    }
  });
});
// Edit Not Accepted Project Details
router.post('/edit-notaccepted-project-details', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.user_type.mentor.project_notaccepted_details = req.body.userNotAcceptedProjectDetails;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Workspace Details: Has Been Successfully Updated.'
          );
          res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
    }
  });
});
// Edit Accepted Project Details
router.post('/edit-accepted-project-details', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.user_type.mentor.project_accepted_details = req.body.userAcceptedProjectDetails;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Workspace Details: Has Been Successfully Updated.'
          );
          res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
    }
  });
});

// Add A Crash Course
router.post('/add-crash-course', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      var crashCourse = {
        crash_course_type: req.body.courseType,
        crash_course_name: req.body.courseName,
        crash_course_link: req.body.courseLink
      };
      doc.user_type.mentor.project_crash_course.push(crashCourse);

      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'A New Skill Has Been Successfully Added.'
          );
          res.redirect('/mentor-crash-courses');
        })
        .catch(err => console.log(err));
    }
  });
});

// Delete A Crash Course
router.post('/delete-crash-course', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {

      doc.user_type.mentor.project_crash_course.pull({
        _id: req.body.courseId
      });
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            doc.user_type.mentor.project_crash_course.crash_course_name + ': Has Been Successfully Deleted.'
          );
          res.redirect('/mentor-crash-courses');
        })
        .catch(err => console.log(err));
    }
  });
});




// Add A Pre Course
router.post('/add-pre-req', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      var preReq = {
        pre_type: req.body.preType,
        pre_name: req.body.preName,
        pre_link: req.body.preLink
      };
      doc.user_type.mentor.project_pre.push(preReq);

      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'A New Skill Has Been Successfully Added.'
          );
          res.redirect('/mentor-pre-requisites');
        })
        .catch(err => console.log(err));
    }
  });
});

// Delete A Crash Course
router.post('/delete-pre-course', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {

      doc.user_type.mentor.project_pre.pull({
        _id: req.body.courseId
      });
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            doc.user_type.mentor.project_pre.pre_name + ': Has Been Successfully Deleted.'
          );
          res.redirect('/mentor-pre-requisites');
        })
        .catch(err => console.log(err));
    }
  });
});


// Edit Pre Experience
router.post('/edit-mentor-preExp', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.user_type.mentor.pre_exp = req.body.mentorPreExp;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Previous Experience: Has Been Successfully Updated.'
          );
          res.redirect('/dashboard');
        })
        .catch(err => console.log(err));
    }
  });
});

// Edit Mentor Name
router.post('/edit-mentor-name', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.name = req.body.mentorName;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Your Account Name: Has Been Successfully Updated.'
          );
          res.redirect('/profile');
        })
        .catch(err => console.log(err));
    }
  });
});

// Edit Mentor Email
router.post('/edit-mentor-email', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.email = req.body.mentorEmail;
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'Your Account Email: Has Been Successfully Updated.'
          );
          res.redirect('/profile');
        })
        .catch(err => console.log(err));
    }
  });
});

// Edit Mentor Password
router.post('/edit-mentor-password', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, (err, doc) => {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(req.body.mentorPassword, salt, (err, hash) => {
          if (err) throw err;
          doc.password = hash;
          doc
            .save()
            .then(function (err, result) {
              req.flash(
                'success_msg',
                'Your Password: Has Been Successfully Updated.'
              );
              res.redirect('/profile');
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// Add Mentor Links
router.post('/mentor-links', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      var newLink = {
        link_name: req.body.mentorLinks
      };
      doc.user_type.mentor.links.push(newLink);
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            'A New Link Has Been Successfully Updated.'
          );
          res.redirect('/profile');
        })
        .catch(err => console.log(err));
    }
  });
});

// Delete A Mentor Link
router.post('/delete-mentor-links', (req, res) => {
  User.findOne({
    user_type_name: "mentor"
  }, function (err, doc) {
    if (err) {
      console.log("Something wrong when updating data!");
    } else {
      doc.user_type.mentor.links.pull({
        _id: req.body.linkId
      });
      doc
        .save()
        .then(function (err, result) {
          req.flash(
            'success_msg',
            doc.user_type.mentor.links.link_name + ': Has Been Successfully Deleted.'
          );
          res.redirect('/profile');
        })
        .catch(err => console.log(err));
    }
  });
});



module.exports = router;