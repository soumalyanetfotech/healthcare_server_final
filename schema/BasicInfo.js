const mongoose = require("mongoose");

const BasicInfoSchema = new mongoose.Schema(
    {
        email: { type: String, required: true },
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: { type: String, required: true },
        marital: { type: String, required: true },
        education: { type: String, required: true },
        occupation: { type: String, required: true },
        economic: { type: String, required: true },
        informant: { type: String, required: true }
    },
    {
        collection:"BasicInfoDetails",
    }
);

mongoose.model("BasicInfoDetails",BasicInfoSchema);
