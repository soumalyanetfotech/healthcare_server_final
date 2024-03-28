require('rootpath')();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose=require('mongoose');
const bodyParser = require('body-parser');
const errorHandler = require('./helpers/error-handler');
const dotenv=require("dotenv");
const PaymentRoutes=require("./Routes/payment");
// const imgroutes= require('./Routes/image.route');

dotenv.config();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true } ));
app.use(bodyParser.json({limit: '50mb'}));
app.use(express.json());
app.use(cors());

// api routes
app.use('/users', require('./users/users.controller'));
app.use("/api/payment",PaymentRoutes);

// app.use('/users', imgroutes);

// global error handler
app.use(errorHandler);

//connect to mongodb
const mongoUrl = "mongodb+srv://soumalya:soumalya@cluster0.2r30x0d.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connected to database");
  })
  .catch((e) => console.log(e));
// start server
const port = process.env.NODE_ENV === 'production' ? 80 : 4000;
const server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});