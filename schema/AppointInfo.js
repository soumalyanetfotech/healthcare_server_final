const mongoose = require("mongoose");

const AppointInfoSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        date: { type: Date, required: true }, // New field for date
        time: { type: String, required: true }, // New field for time (assuming string format)
        availability: { type: String, required: true }, // New field for availability
        userRole: { type: String, required: true } // New field for user role
    },
    {
        collection: "AppointInfoDetails",
    }
);

mongoose.model("AppointInfoDetails", AppointInfoSchema);
