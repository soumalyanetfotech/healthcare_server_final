const mongoose = require("mongoose");

const DoctorInfoSchema = new mongoose.Schema(
    {
        fname: { type: String,  },
        lname: { type: String,  },
        email: { type:String,unique:true},
        phone: { type: String,   },
        gender: { type: String,   },
        country: { type: String,  },
        degree: { type: String,  },
        languages: { type: String,  },
        filename: { type: String,  },
        fileUrl: { type: String,  },
    },
    {
        collection:"DoctorInfo",
    }
);

mongoose.model("DoctorInfo",DoctorInfoSchema);