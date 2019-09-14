const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({  
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  "user_type_name": {
    type: String,
    required: true,
    default: "student"
  },

  "user_type": {
    "student" : {
      "workAs": {
        type: String,
        required: false
      },
      "accepted": {
        type: Boolean,
        required: false,
        default: false
      },
      "first_time": {
        type: Boolean,
        required: false,
        default: true
      }
    
    },

    "mentor": {
      "pre_exp": {  
        type: String,
        required: false
      },
      "links": [{
        "link_name": {
          type: String,
          required: false
        }
      }], 
      "profile_img": {
        type: String,
        required: false
      },
      
      "project_name": {
        type: String,
        required: false,
        default: "Project Name Here"
      },
      "project_details": {
        type: String,
        required: false,
        default: "Project Details Here"
      },
      "project_notaccepted_details": {
        type: String,
        required: false,
        default: "What are you going to do here ? Nothing!"
      },
      "project_accepted_details": {
        type: String,
        required: false,
        default: "Workspace Description"
      },

      "project_pre": [{
          "pre_type": {
            type: String,
            required: true
          },
          "pre_name": {
            type: String,
            required: true
          },
          "pre_link": {
            type: String,
            required: true
          }
      }],

      "project_crash_course": [{
          "crash_course_type": {
            type: String,
            required: true
          },
          "crash_course_name": {
            type: String,
            required: true
          },
          "crash_course_link": {
            type: String,
            required: true
          }
      }]
      
    }
  }


});

  
const User = mongoose.model('User', UserSchema);

module.exports = User;
