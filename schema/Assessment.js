const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  email: String,
  totalScore: Number,

},
{
    collection:"AssessmentInfo",
}
);

mongoose.model("AssessmentInfo",assessmentSchema);