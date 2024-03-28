const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const { default: mongoose, mongo } = require('mongoose');
const authorize = require('../helpers/authorize')
const Role = require('../helpers/role');
const  multer = require('multer');
const path = require('path');
const e = require('cors');


// const storage1 = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads1/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });
  
//   const imageFilter = function (req, file, cb) {
//     // Accept image files only
//     if (!file.originalname.match(/\.(jpg|jpeg|PNG|png|gif)$/)) {
//       return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
//   };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
//   });
  
//   const upload = multer({ 
//     storage: storage,
//     limits: { fileSize: 10 * 1024 * 1024 } // Set file size limit to 10MB (in bytes)
//   });

//   const upload1 = multer({ 
//     storage: storage1,
//     limits: { fileSize: 10 * 1024 * 1024 }, // Set file size limit to 10MB (in bytes)
//     fileFilter: imageFilter // Apply the image filter
//   });
  
// routes
router.get('/getprofile',getprofile);
router.post('/postprofile',postprofile);
router.post('/authenticate', authenticate);    
router.get('/',authorize([Role.Admin,Role.Expert]), getAll); // admin only
// router.get('/:id',  getById);       // all authenticated users
router.post("/register",register);              // register all the users
router.post("/forgotpassword",forgotpassword);
router.get("/reset-password/:id/:token",resetpasswordusinggetMethod);
router.post("/reset-password/:id/:token",resetpasswordusinpostMethod);
router.post("/updateuser",updateuser);
router.post("/deleteuser",deleteuser);
router.post("/basicinfo",basicinfo);
router.post("/login-user",login);
router.post('/order',ordersfn);
router.post('/journal',journal);
router.get('/journal',getjournal);
router.post('/assessmentinfo', assessmentinfo);
router.get('/assessmentinfo', getassessmentinfo);
router.post('/depressioninfo',depressioninfo)
router.get('/depressioninfo', getdepressioninfo)
router.get('/doctorinfo',getdoctorinfo);
router.get('/getbasicinfo',getbasicinfo);
router.post('/appointinfo',appointinfo);
router.get('/appointinfo',getappointinfo);
router.post("/doctor",doctorinfo);
router.post("/payment",payment)
module.exports = router;

function getprofile(req,res,next){
    userService.getprofile().then(users => res.json(users))
    .catch(err => next(err));
}

function postprofile(req,res,next){
    console.log("Profile:")
    console.log(req.body)
    const { Availability,specialization, Timeslot, About,imgname,imgUrl } = req.body;
    // Combine file and body data into a single object
    const formdata = {
        Availability,
        specialization,
        Timeslot,
        About,
        imgname,
        imgUrl
    };
    console.log("Profile Info:",formdata);
    userService.postprofile(formdata).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add the profile' }))
    .catch(err => next(err));
}

function appointinfo(req,res,next){
    console.log("Appoint Info:",req.body);
    userService.appointinfo(req.body).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add info' }))
    .catch(err => next(err));
}

function getappointinfo(req,res,next){
    userService.getappointinfo().then(users => res.json(users))
    .catch(err => next(err));
}

function payment(req,res,next){
    console.log("Payment Info:",req.body);
    userService.payment(req.body).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add payment info' }))
    .catch(err => next(err));
}

function doctorinfo(req,res,next){
    console.log(req.body)
    userService.doctorinfo(req.body).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add the doctor' }))
    .catch(err => next(err));
}

function getbasicinfo(req,res,next){
    userService.getbasicinfo().then(users => res.json(users))
    .catch(err => next(err));
}

// function assessementinfo(req,res,next){
//     userService.assessementinfo().then(users => res.json(users))
//     .catch(err => next(err));
// }

function getjournal(req,res,next){
    userService.getjournal().then(users => res.json(users))
    .catch(err => next(err));
}

function getassessmentinfo(req,res,next){
    userService.getassessmentinfo().then(users => res.json(users))
    .catch(err => next(err));
}

function getdepressioninfo(req,res,next){
    userService.getdepressioninfo().then(users => res.json(users))
    .catch(err => next(err));
}

function getdoctorinfo(req,res,next){
    userService.getdoctorinfo().then(users => res.json(users))
    .catch(err => next(err));
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
    .then(user => {
        if (user) {
            const token1=user.token;
            const fname=user._doc.fname;
            const lname=user._doc.lname;
            const email=user._doc.email;
            const role=user._doc.userType;
            res.json({ status: "ok",token1,role,fname,email,lname});
        } else {
            res.status(400).json({ message: 'Username or password is incorrect' });
        }
    })
    .catch(err => next(err));

}

function journal(req, res, next) {
    console.log("Post Journal",req.body);
    userService.journal(req.body)
        .then(user => {
            console.log(user);
            if (user) {
                res.json({ status: "ok"});
            } else {
                res.status(400).json({ message: "error" });
            }
        })
        .catch(err => {console.log(err);next(err)});
}

// function assessmentinfo(req, res, next) {
//     console.log("Post Journal",req.body);
//     userService.assessment(req.body)
//         .then(user => {
//             console.log(user);
//             if (user) {
//                 res.json({ status: "ok"});
//             } else {
//                 res.status(400).json({ message: "error" });
//             }
//         })
//         .catch(err => {console.log(err);next(err)});
// }

// function assessmentinfo(req,res,next){
//     console.log(req.file)
//     console.log(req.body)
//     const {answers,totalScore,anxietyLevel} = req.body;
//     // Combine file and body data into a single object
//     const formData = {
//         totalScore,
//         anxietyLevel
//     };
//     console.log("Doctor Info:",formData);
//     userService.assessementinfo(formData).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add the doctor' }))
//     .catch(err => next(err));
// }
function assessmentinfo(req, res, next) {
    userService.assessmentinfo(req.body)
      .then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add the assessment' }))
      .catch(err => next(err));
  }
  
  function depressioninfo(req, res, next) {
    userService.depressioninfo(req.body)
      .then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot add the assessment' }))
      .catch(err => next(err));
  }


function ordersfn(req,res,next){
    userService.ordersfn(req.body).then(user=>user? res.json({ status: "ok" }) : res.status(400).json({message:'Error'}))
    .catch(err=>next(err));
}

function login(req,res,next){
    userService.login(req.body).then(user=>user? res.json({ status: "ok" }) : res.status(400).json({message:'Error'}))
    .catch(err=>next(err));
}

function register(req,res,next){
    console.log(req.body);
    userService.register(req.body)
    .then(user=>user? res.json({ status: "ok" }) : res.status(400).json({message:'Error'}))
    .catch(err=>next(err));
}

function forgotpassword(req, res, next) {
    try {
        userService.forgotpassword(req.body); // Call the corrected function with await
        res.json({ status: "password reset link sent" }); // Respond with success message
      } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Error sending reset password link' }); // Respond with error message
      }
    
  }
function resetpasswordusinggetMethod(req,res,next){
    userService.resetpasswordusinggetMethod(req.params).then(user => user ? res.json(user) : res.status(400).json({ message: 'Username or password is incorrect' }))
    .catch(err => next(err));
}

function resetpasswordusinpostMethod(req,res,next){
    userService.resetpasswordusinpostMethod(req.params);
}

function updateuser(req,res,next){
    userService.updateuser(req.body).then(user => user ? res.json(user) : res.status(400).json({ message: 'error' }))
    .catch(err => next(err));
}

function deleteuser(req,res,next){
    console.log(req.body);
    userService.deleteuser(req.body).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot delete the user' }))
    .catch(err => next(err));
}

function basicinfo(req,res,next){
    console.log("Basic Info:",req.body);
    userService.basicinfo(req.body).then(user => user ? res.json(user) : res.status(400).json({ message: 'cannot delete the user' }))
    .catch(err => next(err));
}



function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

// function getById(req, res, next) {
//     const currentUser = req.user;
//     const id = parseInt(req.params.id);

//     // only allow admins to access other user records
//     if (id !== currentUser.sub && currentUser.role !== Role.Admin) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }

//     userService.getById(req.params.id)
//         .then(user => user ? res.json(user) : res.sendStatus(404))
//         .catch(err => next(err));
// }