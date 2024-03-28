const mongoose = require('mongoose');

const depressionSchema = new mongoose.Schema({
  email: String,
  totalScore: Number,

},
{
    collection:"DepressionInfo",
}
);

mongoose.model("DepressionInfo",depressionSchema);