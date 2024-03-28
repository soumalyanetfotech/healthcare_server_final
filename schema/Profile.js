const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
    {
        Availability: { type: String, required: true },
        specialization: { type: String, required: true },
        Timeslot: { type: String, required: true },
        About: { type: String, required: true },
        imgname: { type: String, required: true },
        imgUrl: { type: String, required: true },
    },
    {
        collection:"ProfileDetails",
    }
);

mongoose.model("ProfileDetails",ProfileSchema);
