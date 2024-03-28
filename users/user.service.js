const config = require('config.json');
const jwt = require('jsonwebtoken');
const Role = require('../helpers/role');
const utils = require('../helpers/utils');
const { default: mongoose, mongo } = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("../schema/UserInfo");
require("../schema/BasicInfo");
require("../schema/Journal");
require("../schema/DoctorInfo");
require("../schema/Profile");
require("../schema/Assessment");
require("../schema/AppointInfo");
require("../schema/Depression");
require("../schema/Payment")

const users = mongoose.model("UserInfo");
const Basic = mongoose.model("BasicInfoDetails");
const Journal = mongoose.model("JournalInfo")
const Doctor = mongoose.model("DoctorInfo")
const Profile=mongoose.model("ProfileDetails");
const Assessment = mongoose.model("AssessmentInfo");
const Appoint = mongoose.model("AppointInfoDetails");
const Depression = mongoose.model("DepressionInfo");
const Payment = mongoose.model("Payment");
// users hardcoded for simplicity, store in a db for production applications


module.exports = {
  authenticate,
  ordersfn,
  verifyfn,
  getAll,
  // getById,
  register,
  login,
  forgotpassword,
  resetpasswordusinggetMethod,
  resetpasswordusinpostMethod,
  updateuser,
  deleteuser,
  basicinfo,
  journal,
  getjournal,
  getbasicinfo,
  getdoctorinfo,
  doctorinfo,
  postprofile,
  getprofile,
  assessmentinfo,
  getassessmentinfo,
  appointinfo,
  getappointinfo,
  depressioninfo,
  getdepressioninfo,
  payment,

};

async function getprofile(){
  try {
    const files = await Profile.find();
    return (files);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}
async function postprofile({Availability,specialization,Timeslot,About,imgname,imgUrl}){
  try {
    console.log(imgUrl);
    await Profile.create({
      Availability,
      specialization,
      Timeslot,
      About,
      imgname,
      imgUrl
    });
    return ({ status: "ok" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function doctorinfo({ fname, lname,email,phone,gender,country,degree,languages,filename,fileUrl}) {
  try {
    await Doctor.create({
      fname,
      lname,
      email,
      phone,
      gender,
      country,
      degree,
      languages,
      filename,
      fileUrl
    });
    return ({ status: "ok" });
  } catch (error) {
    throw new Error(error);
  }
}

async function getpdf(){
  try {
    // Retrieve all files from the database
    const files = await Doctor.find();
    
    // Send the files as JSON response
    return (files);
  } catch (error) {
    // If an error occurs, send a 500 status and error message
    throw new Error({ error: error.message });
  }
}

async function getbasicinfo() {
  try {
    const data = await Basic.find();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}

async function getdoctorinfo() {
  try {
    const files = await Doctor.find();
    return (files);
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}

async function getjournal() {
  try {
    const data = await Journal.find();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}

async function journal({ email, selectJournal, text, selectTag, emoji }) {
  try {
    await Journal.create({
      email, selectJournal, text, selectTag, emoji
    });
    return ({ status: "ok" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

async function payment({ email, razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  try {
    await Payment.create({
     email, razorpay_order_id, razorpay_payment_id, razorpay_signature
    });
    return ({ status: "ok" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

async function authenticate({ email, password }) {
  try {
    const user = await users.findOne({ email });

    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }
    const payload = {
      sub: user._id,
      email: user.email,
      userType: user.userType
    }
    const token = jwt.sign(payload, config.secret);
    const { password: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      token
    };
    console.log(token);
  } catch (error) {
    console.error('Authentication error:', error.message);
    throw new Error('Authentication failed');
  }
}

async function ordersfn(amount) {
  try {
    const instance = new Razorpay({
      KEY_ID: 'rzp_test_nW4W3Z3irQjkIr',
      secret: config.secret,
    });

    const options = {
      amount: amount * 100, // Converting amount to paise
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.error(error);
        throw new Error({ message: "Something Went Wrong!" });
      }
      return ({ data: order });
    });
  } catch (error) {
    console.error(error);
    throw new Error({ message: "Internal Server Error!" });
  }
}

async function verifyfn({ razorpay_order_id, razorpay_payment_id, razorpay_signature }) {
  try {
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", config.secret)
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return ({ message: "Payment verified successfully" });
    } else {
      throw new Error({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.error(error);
    throw new Error({ message: "Internal Server Error!" });
  }
}

async function getAll() {
  try {
    const user = await users.find();
    return user;
  } catch (error) {
    throw new Error('Failed to fetch users from the database');
  }
}

// async function getById(id) {
//     const user = users.findById({id});
//     if (!user) return;
//     const { password, ...userWithoutPassword } = user;
//     return userWithoutPassword;
// }

async function login({ email, password, userType }) {
  const user = await users.findOne({ email });
  console.log(user);
  if (!user) {
    return ({ error: "User not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email, userType: user.userType }, config.secret, {
      expiresIn: "200m",
    });
  }
  return ({ status: "error", error: "Invalid Password" });
}

async function register({ fname, lname, email, password, userType }) {
  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await users.findOne({ email });
    if (oldUser) {
      throw new Error("User already registered");
    }
    await users.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });
    return { status: "Registration Successfull" };
  } catch (error) {
    console.log(error);
    throw new Error('Registration failed');
  }
}

async function forgotpassword({ email }) {
  try {
    const oldUser = await users.findOne({ email });
    if (!oldUser) {
      throw new Error("User does not exist!");
    }
    // const sc = config.secret + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, sc, {
      expiresIn: "10m",
    });
    const resetLink = `${config.frontendUrl}/reset-password/${user._id}/${token}`;

    // utils.sendMail("youremail@gmail.com", "soumalyasamaddar2002@gmail.com", "Password Reset", link);
    const emailSubject = "Password Reset";
    const emailBody = `Hello,\n\nTo reset your password, please click on the following link:\n${resetLink}\n\nThis link will expire in 10 min.\n\nIf you did not request a password reset, please ignore this email.`;

    await utils.sendEmail("soumalyasamaddar2002@gamil.com", user.email, emailSubject, emailBody);

    console.log("Reset link:", resetLink);
     return {message: "Password reset link sent to your email"};
  } catch (error) {
    // console.log(error);
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
}

async function resetpasswordusinggetMethod({ id, token }) {
  // const {id,token}=req.params;
  const oldUser = await users.findOne({ _id: id });
  console.log(oldUser.fname);
  if (!oldUser) {
    return { status: "User not Exists !!" };
  }
  const s = config.secret + oldUser.password;
  try {
    const verify = jwt.verify(token, s);
    return { status: "Not Verified" };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function resetpasswordusinpostMethod() {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await users.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User not Exists !!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await users.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    return { status: "password update successfully !!" };
    // res.render("index", {
    //   email: verify.email,
    //   status: "Verified",
    // });
  } catch (error) {
    throw new Error("Something went wrong!")
  }
}

async function updateuser({ _id, fname, lname }) {
  try {
    console.log(_id)
    await users.updateOne({ _id: _id }, {
      $set: {
        fname: fname,
        lname: lname
      }
    })
    return { status: "ok,done", data: "updated successfully" };
  } catch (error) {
    console.log(error);
    throw new Error("Error");

  }
}

async function deleteuser({ id, email }) {
  try {
    console.log("Received request to delete user with ID:", email);

    // Use a different variable name for the result of deleteOne
    const result = await users.deleteOne({ email: email });
    console.log("MongoDB delete result:", result);

    // Check if any document was deleted
    if (result.deletedCount > 0) {
      return ({ status: "ok", data: "User deleted successfully" });
    } else {
      return ({ status: "not found", data: "User not found" });
    }
  } catch (error) {
    throw new Error("Error in deleteing user")
  }
}

async function basicinfo({ email, name, age, gender, marital, education, occupation, economic, informant }) {
  try {
    await Basic.create({
      email,
      name,
      age,
      gender,
      marital,
      education,
      occupation,
      economic,
      informant,
    });
    return ({ status: "ok" });
  } catch (error) {
    throw new Error(error);
  }
}


async function assessmentinfo({ email,totalScore}) {
  try {
    await Assessment.create({
      email,
      totalScore,
    });
    return { status: 'ok' };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getassessmentinfo() {
  try {
    const data = await Assessment.find();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}

async function depressioninfo({ email,totalScore}) {
  try {
    await Depression.create({
      email,
      totalScore,
    });
    return { status: 'ok' };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getdepressioninfo() {
  try {
    const data = await Depression.find();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}

async function appointinfo({email, date,time, availability,userRole}) {
  try {
    // console.log(email);
    await Appoint.create({
      email,
      date,
      time,
      availability,
      userRole,
    });
    return ({ status: "ok" });
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}

async function getappointinfo() {
  try {
    const data = await Appoint.find();
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch users from the database');
  }
}
