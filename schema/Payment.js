const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    }, 
    
  razorpay_order_id: {
    type: String,
    required: true,
  },
  razorpay_payment_id: {
    type: String,
    required: true,
  },
  razorpay_signature: {
    type: String,
    required: true,
  },

});

 mongoose.model("Payment", paymentSchema);