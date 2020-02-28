const express = require('express');
const app = express();

//Json conversor middleware
app.use(express.json());


//Headers
app.use(function(req, res, next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Allow-Headers",
      "Origin, X-requested-With, Content-Type, Accept"
    );
    next();
});

//Routes
const transactions = require('./routes/transactionRoutes');
app.use('/transaction', transactions);


module.exports = app;